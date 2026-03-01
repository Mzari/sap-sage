const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection error:', err);
  } else {
    console.log('✅ Database connected at:', res.rows[0].now);
  }
});

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const dbResult = await pool.query('SELECT COUNT(*) as count FROM sap_systems');
    res.json({
      status: 'healthy',
      timestamp: new Date(),
      service: 'SAP Sage Backend',
      database: 'connected',
      sap_systems: parseInt(dbResult.rows[0].count)
    });
  } catch (err) {
    res.status(500).json({ status: 'unhealthy', error: err.message });
  }
});

// Get conversations
app.get('/api/conversations', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM conversations ORDER BY updated_at DESC');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

// Get messages for a conversation
app.get('/api/conversations/:id/messages', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC',
      [id]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

// Create new conversation
app.post('/api/conversations', async (req, res) => {
  try {
    const { title } = req.body;
    const result = await pool.query(
      'INSERT INTO conversations (title) VALUES ($1) RETURNING *',
      [title || 'New Conversation']
    );

    await pool.query(
      'INSERT INTO messages (conversation_id, role, content) VALUES ($1, $2, $3)',
      [result.rows[0].id, 'assistant', 'Hello! How can I help you with your SAP integration today?']
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

// INTELLIGENT MESSAGE HANDLER WITH CLAUDE
app.post('/api/messages', async (req, res) => {
  try {
    const { conversation_id, content } = req.body;

    // Save user message
    const userMessage = await pool.query(
      'INSERT INTO messages (conversation_id, role, content) VALUES ($1, $2, $3) RETURNING *',
      [conversation_id, 'user', content]
    );

    const question = content.toLowerCase();

    // Query BOTH sap_metadata AND sap_odata_services
    let sapData = { rows: [] };

    try {
      // Try sap_odata_services first (has 2371 services!)
      let odataQuery = 'SELECT service_name as technical_name, title as object_name, description, \'ODATA\' as object_type FROM sap_odata_services WHERE is_active = true';
      const odataParams = [];

      if (question.includes('material') || question.includes('mm') || question.includes('inventory') || question.includes('stock')) {
        odataQuery += ` AND (service_name LIKE '%MATERIAL%' OR title LIKE '%MATERIAL%' OR service_name LIKE '%PRODUCT%')`;
      } else if (question.includes('sales') || question.includes('sd') || question.includes('order')) {
        odataQuery += ` AND (service_name LIKE '%SALES%' OR title LIKE '%SALES%' OR service_name LIKE '%ORDER%')`;
      } else if (question.includes('finance') || question.includes('fi') || question.includes('invoice')) {
        odataQuery += ` AND (service_name LIKE '%INVOICE%' OR service_name LIKE '%PAYMENT%' OR title LIKE '%FINANCIAL%')`;
      }

      if (question.includes('custom') || question.includes('z service')) {
        odataQuery += ` AND service_name LIKE 'Z%'`;
      }

      odataQuery += ' ORDER BY title LIMIT 30';
      sapData = await pool.query(odataQuery, odataParams);

      // Also get from sap_metadata if needed
      if (sapData.rows.length < 10) {
        const metadataQuery = 'SELECT technical_name, object_name, description, object_type FROM sap_metadata LIMIT 20';
        const metadataData = await pool.query(metadataQuery);
        sapData.rows = [...sapData.rows, ...metadataData.rows];
      }
    } catch (queryErr) {
      console.error('Query error:', queryErr);
      // Fallback to simple query
      sapData = await pool.query('SELECT service_name as technical_name, title as object_name FROM sap_odata_services LIMIT 20');
    }

    // Get systems
    const systems = await pool.query('SELECT name, system_id, host FROM sap_systems LIMIT 1');

    // Get conversation history
    const history = await pool.query(
      'SELECT role, content FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC LIMIT 10',
      [conversation_id]
    );

    let response = '';

    // BUILD CONTEXT FOR CLAUDE
    let sapContext = `\n\n=== USER'S SAP SYSTEM ===\n`;
    sapContext += `System: ${systems.rows[0]?.name || 'S/4HANA 1909'} at ${systems.rows[0]?.host}\n`;
    sapContext += `Total Services Available: 2,371 OData services\n`;
    sapContext += `Relevant to Query: ${sapData.rows.length}\n\n`;

    if (sapData.rows.length > 0) {
      sapContext += `Top Services Found:\n`;
      sapData.rows.slice(0, 15).forEach(s => {
        sapContext += `\n- ${s.object_name || s.technical_name}\n`;
        sapContext += `  Technical: ${s.technical_name}\n`;
        if (s.description) sapContext += `  ${s.description}\n`;
      });
    }

    // CHECK IF CLAUDE API KEY IS CONFIGURED
    if (process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== '') {
      try {
        // CALL CLAUDE API
        const claudeResponse = await axios.post(
          'https://api.anthropic.com/v1/messages',
          {
            model: 'claude-sonnet-4-20250514',
            max_tokens: 2000,
            system: `You are SAP Sage, an expert AI assistant with complete knowledge of the user's SAP S/4HANA 1909 system.

You have access to their actual SAP service catalog with 2,371 OData services. When answering questions:
1. Reference SPECIFIC services from their system by name
2. Explain what each service does in business terms
3. Provide sample OData queries when relevant
4. Suggest practical integration approaches
5. Be concise and actionable
6. Format with **bold** headers and \`code blocks\`

Current SAP System Context:
${sapContext}

Answer based on the ACTUAL services above. If asked about something not in the list, say you don't see it in their current catalog but can help if they provide more details.`,
            messages: [
              ...history.rows.slice(-5).map(msg => ({
                role: msg.role === 'assistant' ? 'assistant' : 'user',
                content: msg.content
              })),
              { role: 'user', content: content }
            ]
          },
          {
            headers: {
              'x-api-key': process.env.ANTHROPIC_API_KEY,
              'anthropic-version': '2023-06-01',
              'content-type': 'application/json'
            }
          }
        );

        response = claudeResponse.data.content[0].text;

      } catch (claudeError) {
        console.error('Claude API error:', claudeError.response?.data || claudeError.message);

        // FALLBACK: Structured response without Claude
        if (sapData.rows.length > 0) {
          response = `**Found ${sapData.rows.length} relevant services in your S/4HANA 1909 system:**\n\n`;
          sapData.rows.slice(0, 10).forEach((s, i) => {
            response += `${i + 1}. **${s.object_name || s.technical_name}**\n`;
            response += `   \`${s.technical_name}\`\n`;
            if (s.description) response += `   ${s.description}\n`;
            response += `\n`;
          });
          if (sapData.rows.length > 10) {
            response += `\n_...and ${sapData.rows.length - 10} more services_\n`;
          }
          response += `\n💡 Ask me specific questions about any of these services!`;
          response += `\n\n_(Note: Claude API error - showing basic results)_`;
        } else {
          response = `I found your S/4HANA 1909 system with 2,371 OData services, but none matched your specific query. Try asking about:\n- Material Management (MM)\n- Sales & Distribution (SD)\n- Finance (FI)\n- Custom Z-services\n\n_(Claude API error: ${claudeError.message})_`;
        }
      }
    } else {
      // NO API KEY - Still provide good response
      if (sapData.rows.length > 0) {
        response = `**Your S/4HANA 1909 System**\n\n`;
        response += `Total: 2,371 OData services available\n`;
        response += `Showing ${Math.min(sapData.rows.length, 10)} relevant services:\n\n`;

        sapData.rows.slice(0, 10).forEach((s, i) => {
          response += `${i + 1}. **${s.object_name || s.technical_name}**\n`;
          response += `   \`${s.technical_name}\`\n\n`;
        });

        response += `\n🔑 **Want intelligent answers?** Add \`ANTHROPIC_API_KEY\` to \`backend/.env\``;
      } else {
        response = `Your system has 2,371 OData services. Ask me about:\n- Material Management\n- Sales Orders\n- Finance\n- Custom services\n\n🔑 Add ANTHROPIC_API_KEY for smarter answers!`;
      }
    }

    // Save assistant message
    const assistantMessage = await pool.query(
      'INSERT INTO messages (conversation_id, role, content) VALUES ($1, $2, $3) RETURNING *',
      [conversation_id, 'assistant', response]
    );

    // Update conversation
    await pool.query(
      'UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [conversation_id]
    );

    res.json({
      success: true,
      data: {
        user_message: userMessage.rows[0],
        assistant_message: assistantMessage.rows[0]
      }
    });
  } catch (err) {
    console.error('Message processing error:', err);
    res.status(500).json({ success: false, error: 'Failed to process message', details: err.message });
  }
});

// Get SAP systems
app.get('/api/sap-systems', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM sap_systems ORDER BY created_at DESC');
    res.json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    console.error('Error fetching SAP systems:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get SAP metadata - NOW USES sap_odata_services!
app.get('/api/sap-metadata', async (req, res) => {
  try {
    const { limit = 100, offset = 0, search } = req.query;

    let query = `
      SELECT 
        id,
        service_name as "technicalName",
        title as "objectName",
        description,
        service_version as "version",
        is_active as "isActive",
        'ODATA_SERVICE' as "objectType",
        synced_at as "discoveredAt"
      FROM sap_odata_services
      WHERE is_active = TRUE
    `;

    const params = [parseInt(limit), parseInt(offset)];

    if (search) {
      query += ` AND (service_name ILIKE $3 OR title ILIKE $3)`;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY title LIMIT $1 OFFSET $2`;

    const result = await pool.query(query, params);

    const countQuery = search
      ? `SELECT COUNT(*) FROM sap_odata_services WHERE is_active = TRUE AND (service_name ILIKE $1 OR title ILIKE $1)`
      : `SELECT COUNT(*) FROM sap_odata_services WHERE is_active = TRUE`;

    const countParams = search ? [`%${search}%`] : [];
    const countResult = await pool.query(countQuery, countParams);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        total: parseInt(countResult.rows[0].count),
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: (parseInt(offset) + result.rows.length) < parseInt(countResult.rows[0].count)
      }
    });
  } catch (err) {
    console.error('Error fetching metadata:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get SAP events
app.get('/api/sap-events', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM sap_events ORDER BY created_at DESC LIMIT 100');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

// Get statistics - FIXED VERSION
app.get('/api/stats', async (req, res) => {
  try {
    // Execute queries individually with error handling
    const systemsCount = await pool.query('SELECT COUNT(*) FROM sap_systems');
    const odataCount = await pool.query('SELECT COUNT(*) FROM sap_odata_services WHERE is_active = true');
    const metadataCount = await pool.query('SELECT COUNT(*) FROM sap_metadata');
    const tablesCount = await pool.query('SELECT COUNT(*) FROM sap_tables');
    const functionsCount = await pool.query('SELECT COUNT(*) FROM sap_function_modules');
    const conversationsCount = await pool.query('SELECT COUNT(*) FROM conversations');
    const messagesCount = await pool.query('SELECT COUNT(*) FROM messages');

    res.json({
      success: true,
      data: {
        systems: {
          total: parseInt(systemsCount.rows[0].count),
          active: parseInt(systemsCount.rows[0].count)
        },
        metadata: {
          totalObjects: parseInt(odataCount.rows[0].count) +
            parseInt(metadataCount.rows[0].count) +
            parseInt(tablesCount.rows[0].count) +
            parseInt(functionsCount.rows[0].count),
          byType: {
            ODATA_SERVICE: parseInt(odataCount.rows[0].count),
            METADATA: parseInt(metadataCount.rows[0].count),
            TABLE: parseInt(tablesCount.rows[0].count),
            FUNCTION: parseInt(functionsCount.rows[0].count)
          }
        },
        conversations: {
          total: parseInt(conversationsCount.rows[0].count)
        },
        messages: {
          total: parseInt(messagesCount.rows[0].count)
        }
      }
    });
  } catch (err) {
    console.error('Stats error:', err.message);
    res.status(500).json({
      success: false,
      error: 'Database error',
      details: err.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log('');
  console.log('🚀 SAP Sage Backend Started!');
  console.log('================================');
  console.log(`📡 API Server:    http://localhost:${PORT}`);
  console.log(`💚 Health Check:  http://localhost:${PORT}/api/health`);
  console.log(`📊 Statistics:    http://localhost:${PORT}/api/stats`);
  console.log(`🎯 SAP Metadata:  http://localhost:${PORT}/api/sap-metadata`);
  console.log('================================');
  console.log('');
});