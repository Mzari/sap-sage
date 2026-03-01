# Simple Schema Installer for SAP-Sage
Write-Host "Installing SAP-Sage Database Schema..." -ForegroundColor Cyan

$schema = @'
DROP TABLE IF EXISTS sap_sync_jobs CASCADE;
DROP TABLE IF EXISTS sap_custom_code CASCADE;
DROP TABLE IF EXISTS sap_function_parameters CASCADE;
DROP TABLE IF EXISTS sap_function_modules CASCADE;
DROP TABLE IF EXISTS sap_odata_entity_fields CASCADE;
DROP TABLE IF EXISTS sap_odata_entities CASCADE;
DROP TABLE IF EXISTS sap_odata_services CASCADE;
DROP TABLE IF EXISTS sap_table_relationships CASCADE;
DROP TABLE IF EXISTS sap_table_fields CASCADE;
DROP TABLE IF EXISTS sap_tables CASCADE;
DROP TABLE IF EXISTS sap_systems CASCADE;

CREATE TABLE sap_systems (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    host VARCHAR(255) NOT NULL,
    client VARCHAR(3),
    system_id VARCHAR(10),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(host, client)
);

INSERT INTO sap_systems (name, host, client, system_id, description)
VALUES ('S/4HANA 1909', 's4h1909.sapfever.com', '000', 'S4H', 'SAP S/4HANA 1909 Production')
ON CONFLICT (host, client) DO UPDATE SET name = EXCLUDED.name, updated_at = CURRENT_TIMESTAMP;

CREATE TABLE sap_tables (
    id SERIAL PRIMARY KEY,
    system_id INTEGER REFERENCES sap_systems(id) ON DELETE CASCADE,
    table_name VARCHAR(30) NOT NULL,
    table_type VARCHAR(10),
    description TEXT,
    module VARCHAR(10),
    metadata JSONB,
    synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(system_id, table_name)
);

CREATE TABLE sap_table_fields (
    id SERIAL PRIMARY KEY,
    table_id INTEGER REFERENCES sap_tables(id) ON DELETE CASCADE,
    field_name VARCHAR(30) NOT NULL,
    position INTEGER,
    data_type VARCHAR(10),
    length INTEGER,
    decimals INTEGER,
    key_field BOOLEAN DEFAULT FALSE,
    description TEXT,
    metadata JSONB,
    UNIQUE(table_id, field_name)
);

CREATE TABLE sap_table_relationships (
    id SERIAL PRIMARY KEY,
    system_id INTEGER REFERENCES sap_systems(id) ON DELETE CASCADE,
    from_table VARCHAR(30),
    from_field VARCHAR(30),
    to_table VARCHAR(30),
    to_field VARCHAR(30),
    relationship_type VARCHAR(20),
    metadata JSONB,
    UNIQUE(system_id, from_table, from_field, to_table, to_field)
);

CREATE TABLE sap_odata_services (
    id SERIAL PRIMARY KEY,
    system_id INTEGER REFERENCES sap_systems(id) ON DELETE CASCADE,
    service_name VARCHAR(100) NOT NULL,
    service_version VARCHAR(10) DEFAULT 'v1',
    namespace VARCHAR(100),
    title TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(system_id, service_name, service_version)
);

CREATE TABLE sap_odata_entities (
    id SERIAL PRIMARY KEY,
    service_id INTEGER REFERENCES sap_odata_services(id) ON DELETE CASCADE,
    entity_name VARCHAR(100) NOT NULL,
    entity_set_name VARCHAR(100),
    description TEXT,
    metadata JSONB,
    UNIQUE(service_id, entity_name)
);

CREATE TABLE sap_odata_entity_fields (
    id SERIAL PRIMARY KEY,
    entity_id INTEGER REFERENCES sap_odata_entities(id) ON DELETE CASCADE,
    field_name VARCHAR(100) NOT NULL,
    edm_type VARCHAR(50),
    max_length INTEGER,
    nullable BOOLEAN DEFAULT TRUE,
    is_key BOOLEAN DEFAULT FALSE,
    label TEXT,
    metadata JSONB,
    UNIQUE(entity_id, field_name)
);

CREATE TABLE sap_function_modules (
    id SERIAL PRIMARY KEY,
    system_id INTEGER REFERENCES sap_systems(id) ON DELETE CASCADE,
    function_name VARCHAR(30) NOT NULL,
    function_group VARCHAR(30),
    short_text TEXT,
    is_rfc_enabled BOOLEAN DEFAULT FALSE,
    metadata JSONB,
    synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(system_id, function_name)
);

CREATE TABLE sap_function_parameters (
    id SERIAL PRIMARY KEY,
    function_id INTEGER REFERENCES sap_function_modules(id) ON DELETE CASCADE,
    parameter_name VARCHAR(30) NOT NULL,
    parameter_type VARCHAR(10),
    data_type VARCHAR(30),
    description TEXT,
    metadata JSONB,
    UNIQUE(function_id, parameter_name, parameter_type)
);

CREATE TABLE sap_custom_code (
    id SERIAL PRIMARY KEY,
    system_id INTEGER REFERENCES sap_systems(id) ON DELETE CASCADE,
    object_type VARCHAR(10),
    object_name VARCHAR(40) NOT NULL,
    description TEXT,
    metadata JSONB,
    synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(system_id, object_type, object_name)
);

CREATE TABLE sap_sync_jobs (
    id SERIAL PRIMARY KEY,
    system_id INTEGER REFERENCES sap_systems(id) ON DELETE CASCADE,
    job_type VARCHAR(50),
    status VARCHAR(20),
    items_discovered INTEGER DEFAULT 0,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    error_message TEXT,
    metadata JSONB
);

CREATE INDEX idx_tables_module ON sap_tables(module);
CREATE INDEX idx_tables_type ON sap_tables(table_type);
CREATE INDEX idx_services_active ON sap_odata_services(is_active);
CREATE INDEX idx_functions_rfc ON sap_function_modules(is_rfc_enabled);

SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = 'public';
'@

Write-Host "Executing SQL..." -ForegroundColor Yellow

$schema | docker exec -i sapsage-postgres psql -U sapsage -d sapsage

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "SUCCESS! Schema installed." -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. pgAdmin: http://localhost:5050 (admin@sapsage.com / admin2024)" -ForegroundColor White
    Write-Host "  2. n8n: http://localhost:5678 (admin / sapsage2024)" -ForegroundColor White
}
else {
    Write-Host ""
    Write-Host "ERROR: Schema installation failed" -ForegroundColor Red
}