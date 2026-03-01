-- SAP Sage Database Schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- SAP Systems
CREATE TABLE sap_systems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    system_type VARCHAR(20) NOT NULL,
    host VARCHAR(255) NOT NULL,
    client VARCHAR(3) NOT NULL,
    protocol VARCHAR(10) DEFAULT 'https',
    port INTEGER DEFAULT 443,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SAP Metadata
CREATE TABLE sap_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    system_id UUID REFERENCES sap_systems(id),
    object_type VARCHAR(50),
    object_name VARCHAR(100) NOT NULL,
    technical_name VARCHAR(100),
    description TEXT,
    module VARCHAR(10),
    metadata JSONB,
    business_context TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_metadata_system ON sap_metadata(system_id);
CREATE INDEX idx_metadata_type ON sap_metadata(object_type);
CREATE INDEX idx_metadata_name ON sap_metadata(object_name);
CREATE INDEX idx_metadata_module ON sap_metadata(module);

-- Conversations
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(100) DEFAULT 'default_user',
    title VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);

-- Integration Patterns
CREATE TABLE integration_patterns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pattern_name VARCHAR(255) NOT NULL,
    pattern_type VARCHAR(50),
    source_system VARCHAR(100),
    target_system VARCHAR(100),
    description TEXT,
    technical_details JSONB,
    success_rate DECIMAL(5,2),
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SAP Events
CREATE TABLE sap_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    system_id UUID REFERENCES sap_systems(id),
    event_name VARCHAR(255) NOT NULL,
    event_type VARCHAR(50),
    trigger_object VARCHAR(100),
    trigger_field VARCHAR(100),
    business_meaning TEXT,
    frequency_estimate VARCHAR(50),
    payload_structure JSONB,
    integration_opportunities TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Knowledge Base
CREATE TABLE knowledge_base (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category VARCHAR(50),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    tags TEXT[],
    source VARCHAR(100),
    relevance_score INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default data
INSERT INTO sap_systems (name, system_type, host, client, protocol, port) 
VALUES ('S4HANA Production', 'S4HANA', 's4h1909.sapfever.com', '100', 'https', 443);

INSERT INTO conversations (title) VALUES ('Getting Started with SAP Sage');

INSERT INTO messages (conversation_id, role, content) 
VALUES (
    (SELECT id FROM conversations LIMIT 1),
    'assistant',
    'Welcome to SAP Sage! I am your AI copilot for SAP integration. I can help you learn your SAP landscape, design integrations, and build solutions. What would you like to explore first?'
);

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO sapsage;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO sapsage;
