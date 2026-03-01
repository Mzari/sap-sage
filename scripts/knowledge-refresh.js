'use strict';
require('dotenv').config({ path: '../.env' });
const fetch = require('node-fetch');

const BACKEND = process.env.BACKEND_URL || 'https://sap-sage-production.up.railway.app';

const TOPICS = [
  'SAP Cloud Integration CPI iFlow configuration',
  'CPI Groovy script error handling',
  'SAP API Management BTP policy',
  'SAP Event Mesh topic subscription',
  'S/4HANA OData V4 released APIs',
  'SAP RAP BDEF behavior definition',
  'SAP RAP draft handling',
  'ABAP Clean Core guidelines',
  'SAP BTP Connectivity Service Cloud Connector',
  'SAP ECC Plant Maintenance ASANWEE',
  'SAP ECC IDoc partner profile configuration',
  'SAP SuccessFactors OData API authentication',
  'SAP Ariba procurement integration API',
  'SAP CAP Node.js service development',
  'SAP HANA Cloud database connection',
  'SAP Fiori Elements list report annotations',
  'SAP BTP Authorization Trust Management',
  'S/4HANA Business Events outbound configuration',
  'SAP Integration Advisor mapping guidelines',
  'CPI adapter SFTP configuration',
  'SAP BTP Destination Service configuration',
  'SAP OData CSRF token handling',
  'SAP CPI message processing log monitoring',
  'SAP ABAP function module RFC enabled',
  'SAP S/4HANA Business Partner API',
  'SAP Purchase Order OData API',
  'SAP Plant Maintenance notification API',
  'SAP CPI exception subprocess error handling',
  'SAP API Management developer portal',
  'SAP Event Mesh queue subscription',
];

async function checkFresh(topic) {
  try {
    const res = await fetch(`${BACKEND}/api/knowledge/${encodeURIComponent(topic)}`);
    const data = await res.json();
    return data?.count > 0;
  } catch { return false; }
}

async function store(topic, content, sourceUrl) {
  try {
    await fetch(`${BACKEND}/api/knowledge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, content, sourceUrl, source: 'sap-help-auto' }),
    });
  } catch (e) {
    console.error(`  Failed to store: ${e.message}`);
  }
}

async function searchSapHelp(query) {
  try {
    const url = `https://help.sap.com/http.svc/search?q=${encodeURIComponent(query)}&language=en&product=`;
    const res = await fetch(url, { timeout: 8000 });
    if (!res.ok) return null;
    const data = await res.json();
    const hits = (data.hits || []).slice(0, 3);
    if (!hits.length) return null;
    return {
      content: hits.map(h => `${h.title}: ${(h.content || h.description || '').slice(0, 300)}`).join(' | '),
      sourceUrl: hits[0].url || hits[0].link || 'https://help.sap.com',
    };
  } catch { return null; }
}

async function run() {
  console.log(`\nSAP Sage Knowledge Refresh`);
  console.log(`Backend: ${BACKEND}`);
  console.log(`Topics:  ${TOPICS.length}`);
  console.log('─'.repeat(50));

  let cached = 0, fresh = 0, errors = 0;

  for (let i = 0; i < TOPICS.length; i++) {
    const topic = TOPICS[i];
    process.stdout.write(`[${String(i+1).padStart(2)}/${TOPICS.length}] ${topic.slice(0, 45).padEnd(45)} `);

    const isFresh = await checkFresh(topic);
    if (isFresh) {
      console.log('↩ already fresh');
      fresh++;
      continue;
    }

    const result = await searchSapHelp(topic);
    if (result) {
      await store(topic, result.content, result.sourceUrl);
      console.log('✓ cached');
      cached++;
    } else {
      console.log('✗ no results');
      errors++;
    }

    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 500));
  }

  console.log('─'.repeat(50));
  console.log(`✓ Newly cached: ${cached}`);
  console.log(`↩ Already fresh: ${fresh}`);
  console.log(`✗ No results: ${errors}`);
  console.log(`\nDone.`);
}

run();
