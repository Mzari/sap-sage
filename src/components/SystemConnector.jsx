import { useState, useEffect } from 'react';
import { useTheme } from '../theme.jsx';

// ─── Storage key ───────────────────────────────────────────────────────────────
const STORAGE_KEY = 'sap-sage-connections';

const loadConnections = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
};
const saveConnections = (c) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(c)); } catch {}
};

// ─── System type definitions ───────────────────────────────────────────────────
const SYSTEM_TYPES = [
  {
    id: 'cpi',
    label: 'SAP Cloud Integration (CPI)',
    icon: '⬡',
    color: '#00D68F',
    badge: 'CPI',
    fields: [
      { key: 'host',  label: 'CPI Host URL',  placeholder: 'https://your-tenant.it-cpi.cfapps.eu10.hana.ondemand.com', type: 'text' },
      { key: 'user',  label: 'Service User',  placeholder: 'sap_sage_svc', type: 'text' },
      { key: 'pass',  label: 'Password',      placeholder: '••••••••', type: 'password' },
    ],
    testEndpoint: (cfg) => `${cfg.host}/api/v1/IntegrationRuntimeArtifacts?$top=1`,
    testAuth: (cfg) => 'Basic ' + btoa(`${cfg.user}:${cfg.pass}`),
    description: 'Access iFlow list, message processing logs, error diagnosis',
  },
  {
    id: 's4op',
    label: 'S/4HANA On-Premise',
    icon: '▣',
    color: '#00C8FF',
    badge: 'S/4OP',
    fields: [
      { key: 'host',    label: 'SAP Host URL', placeholder: 'https://your-sap-host:44300', type: 'text' },
      { key: 'client',  label: 'Client',       placeholder: '100', type: 'text' },
      { key: 'user',    label: 'RFC User',     placeholder: 'BASIS_RFC', type: 'text' },
      { key: 'pass',    label: 'Password',     placeholder: '••••••••', type: 'password' },
    ],
    testEndpoint: (cfg) => `${cfg.host}/sap/opu/odata/sap/API_BUSINESS_PARTNER/A_BusinessPartner?$top=1&sap-client=${cfg.client || '100'}&$format=json`,
    testAuth: (cfg) => 'Basic ' + btoa(`${cfg.user}:${cfg.pass}`),
    description: 'Live OData queries, BAPI verification, transport viewer',
  },
  {
    id: 'ecc',
    label: 'SAP ECC 6.0',
    icon: '▣',
    color: '#3B82F6',
    badge: 'ECC',
    fields: [
      { key: 'host',    label: 'SAP Host URL', placeholder: 'https://your-ecc-host:8000', type: 'text' },
      { key: 'client',  label: 'Client',       placeholder: '800', type: 'text' },
      { key: 'user',    label: 'RFC User',     placeholder: 'BASIS_RFC', type: 'text' },
      { key: 'pass',    label: 'Password',     placeholder: '••••••••', type: 'password' },
    ],
    testEndpoint: (cfg) => `${cfg.host}/sap/opu/odata/sap/ZGWSAMPLE_BASIC/BusinessPartnerSet?$top=1&sap-client=${cfg.client || '800'}&$format=json`,
    testAuth: (cfg) => 'Basic ' + btoa(`${cfg.user}:${cfg.pass}`),
    description: 'ECC OData services, IDoc status, PM/MM/FI module queries',
  },
  {
    id: 's4pub',
    label: 'S/4HANA Public Cloud',
    icon: '▣',
    color: '#00D68F',
    badge: 'S/4PUB',
    fields: [
      { key: 'host',         label: 'API Host',      placeholder: 'https://my-tenant.s4hana.cloud.sap', type: 'text' },
      { key: 'clientId',     label: 'OAuth Client ID', placeholder: 'sb-xxxx', type: 'text' },
      { key: 'clientSecret', label: 'OAuth Secret',   placeholder: '••••••••', type: 'password' },
      { key: 'tokenUrl',     label: 'Token URL',      placeholder: 'https://tenant.authentication.eu10.hana.ondemand.com/oauth/token', type: 'text' },
    ],
    testEndpoint: (cfg) => `${cfg.host}/sap/opu/odata4/sap/api_purchaseorder_2/srvd_a2x/sap/purchaseorder/0001/PurchaseOrder?$top=1`,
    testAuth: () => 'OAuth — configure token URL',
    description: 'Released OData V4 APIs only — clean core, no custom RFC',
  },
  {
    id: 'sf',
    label: 'SAP SuccessFactors',
    icon: '◆',
    color: '#FF9500',
    badge: 'SF',
    fields: [
      { key: 'host',         label: 'API Host',     placeholder: 'https://api4.successfactors.com', type: 'text' },
      { key: 'companyId',    label: 'Company ID',   placeholder: 'your-company-id', type: 'text' },
      { key: 'clientId',     label: 'OAuth Client', placeholder: 'your-client-id', type: 'text' },
      { key: 'clientSecret', label: 'OAuth Secret', placeholder: '••••••••', type: 'password' },
    ],
    testEndpoint: (cfg) => `${cfg.host}/odata/v2/User?$top=1&$format=json`,
    testAuth: () => 'OAuth — configure client credentials',
    description: 'Employee Central, Recruiting, Learning, Performance APIs',
  },
  {
    id: 'btp',
    label: 'SAP BTP Subaccount',
    icon: '⬡',
    color: '#A855F7',
    badge: 'BTP',
    fields: [
      { key: 'host',         label: 'BTP API URL',  placeholder: 'https://api.cf.eu10.hana.ondemand.com', type: 'text' },
      { key: 'clientId',     label: 'Client ID',    placeholder: 'sb-xxxx', type: 'text' },
      { key: 'clientSecret', label: 'Client Secret',placeholder: '••••••••', type: 'password' },
      { key: 'tokenUrl',     label: 'Token URL',    placeholder: 'https://tenant.authentication.eu10.hana.ondemand.com/oauth/token', type: 'text' },
    ],
    testEndpoint: (cfg) => `${cfg.host}/v3/info`,
    testAuth: () => 'OAuth — configure token URL',
    description: 'BTP service catalog, subaccount services, quota management',
  },
];

// ─── Status dot ────────────────────────────────────────────────────────────────
function StatusDot({ status, C }) {
  const cfg = {
    ok:      { color: C.green,  label: 'Connected',    pulse: false },
    error:   { color: C.red,    label: 'Error',        pulse: true },
    testing: { color: C.amber,  label: 'Testing...',   pulse: true },
    saved:   { color: C.textSub,label: 'Saved',        pulse: false },
    none:    { color: C.textMute,label: 'Not connected',pulse: false },
  }[status] || { color: C.textMute, label: '', pulse: false };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <div style={{
        width: 7, height: 7, borderRadius: '50%', background: cfg.color, flexShrink: 0,
        animation: cfg.pulse ? 'pulse-dot 1.4s ease-in-out infinite' : 'none',
      }} />
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9.5, color: cfg.color }}>{cfg.label}</span>
    </div>
  );
}

// ─── Single system card ────────────────────────────────────────────────────────
function SystemCard({ sys, C, isDark }) {
  const stored = loadConnections()[sys.id] || {};
  const [cfg,      setCfg]      = useState(stored.config || {});
  const [expanded, setExpanded] = useState(false);
  const [status,   setStatus]   = useState(stored.config ? 'saved' : 'none');
  const [errMsg,   setErrMsg]   = useState('');
  const [showPass, setShowPass] = useState({});

  const hasConfig = Object.keys(cfg).some(k => cfg[k]);

  const save = () => {
    const all = loadConnections();
    all[sys.id] = { config: cfg, savedAt: Date.now() };
    saveConnections(all);
    setStatus('saved');
    setExpanded(false);
  };

  const clear = () => {
    const all = loadConnections();
    delete all[sys.id];
    saveConnections(all);
    setCfg({});
    setStatus('none');
    setErrMsg('');
  };

  const test = async () => {
    setStatus('testing');
    setErrMsg('');
    try {
      const url  = sys.testEndpoint(cfg);
      const auth = sys.testAuth(cfg);
      const res  = await fetch(url, {
        method: 'GET',
        headers: { Authorization: auth, Accept: 'application/json' },
      });
      if (res.ok || res.status === 401) {
        // 401 means we reached the system (auth may need adjustment)
        setStatus(res.ok ? 'ok' : 'error');
        setErrMsg(res.ok ? '' : `HTTP ${res.status} — check credentials`);
      } else {
        setStatus('error');
        setErrMsg(`HTTP ${res.status}`);
      }
    } catch (e) {
      setStatus('error');
      setErrMsg(e.message.includes('fetch') ? 'Cannot reach host — check URL or network' : e.message.slice(0, 80));
    }
  };

  return (
    <div style={{
      border: `1px solid ${expanded ? sys.color + '50' : C.border}`,
      borderLeft: `3px solid ${hasConfig ? sys.color : C.border}`,
      borderRadius: 9, background: C.bgCard, overflow: 'hidden',
      transition: 'border-color .2s',
    }}>
      {/* Header row */}
      <div
        onClick={() => setExpanded(p => !p)}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 14px', cursor: 'pointer',
          background: expanded ? `${sys.color}08` : 'transparent',
        }}
      >
        <div style={{
          width: 30, height: 30, borderRadius: 7, flexShrink: 0,
          background: `${sys.color}${isDark ? '16' : '14'}`,
          border: `1px solid ${sys.color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, color: sys.color,
        }}>{sys.icon}</div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 13, color: C.white }}>{sys.label}</span>
            <span style={{ fontSize: 8, fontFamily: "'JetBrains Mono',monospace", padding: '1px 6px', borderRadius: 3, background: `${sys.color}18`, color: sys.color, border: `1px solid ${sys.color}28`, fontWeight: 700 }}>{sys.badge}</span>
          </div>
          <div style={{ fontSize: 11, fontFamily: "'Inter',sans-serif", color: C.textSub, marginTop: 2 }}>{sys.description}</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <StatusDot status={status} C={C} />
          <span style={{ fontSize: 10, color: C.textMute }}>{expanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {/* Expanded config form */}
      {expanded && (
        <div style={{ padding: '0 14px 14px', borderTop: `1px solid ${C.border}` }}>
          <div style={{ paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 9 }}>

            {sys.fields.map(field => (
              <div key={field.key}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: C.textMute, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>
                  {field.label}
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type={field.type === 'password' && !showPass[field.key] ? 'password' : 'text'}
                    value={cfg[field.key] || ''}
                    onChange={e => setCfg(p => ({ ...p, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    autoComplete="off"
                    style={{
                      width: '100%', background: C.bgInput,
                      border: `1px solid ${C.borderMid}`, borderRadius: 6,
                      padding: field.type === 'password' ? '7px 36px 7px 11px' : '7px 11px',
                      color: C.text, fontFamily: "'JetBrains Mono',monospace", fontSize: 11.5,
                      boxSizing: 'border-box',
                    }}
                    onFocus={e => e.target.style.borderColor = sys.color + '60'}
                    onBlur={e => e.target.style.borderColor = C.borderMid}
                  />
                  {field.type === 'password' && (
                    <button onClick={() => setShowPass(p => ({ ...p, [field.key]: !p[field.key] }))}
                      style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: C.textSub, fontSize: 12 }}>
                      {showPass[field.key] ? '🙈' : '👁'}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {errMsg && (
              <div style={{ padding: '6px 10px', background: `${C.red}0C`, border: `1px solid ${C.red}30`, borderRadius: 5, fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: C.red }}>
                ✗ {errMsg}
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 7, marginTop: 4, flexWrap: 'wrap' }}>
              <button onClick={save} style={{
                padding: '6px 16px', borderRadius: 6, border: 'none', cursor: 'pointer',
                background: sys.color, color: '#000',
                fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 11.5,
              }}>💾 Save</button>

              <button onClick={test} disabled={status === 'testing' || !cfg.host} style={{
                padding: '6px 16px', borderRadius: 6, cursor: cfg.host ? 'pointer' : 'not-allowed',
                border: `1px solid ${sys.color}50`, background: `${sys.color}10`,
                color: cfg.host ? sys.color : C.textMute,
                fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: 11.5,
              }}>
                {status === 'testing' ? '⟳ Testing…' : '⚡ Test Connection'}
              </button>

              {hasConfig && (
                <button onClick={clear} style={{
                  padding: '6px 14px', borderRadius: 6, cursor: 'pointer',
                  border: `1px solid ${C.border}`, background: 'none',
                  color: C.red, fontFamily: "'Inter',sans-serif", fontSize: 11,
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.red; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; }}>
                  ✕ Clear
                </button>
              )}
            </div>

            {/* BTP / Cloud connector note */}
            {(sys.id === 's4op' || sys.id === 'ecc') && (
              <div style={{ marginTop: 6, padding: '8px 11px', background: `${C.amber}0C`, border: `1px solid ${C.amber}28`, borderRadius: 6 }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9.5, color: C.amber, marginBottom: 3, fontWeight: 700 }}>ON-PREMISE CONNECTIVITY NOTE</div>
                <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: C.textSub, lineHeight: 1.6 }}>
                  For on-premise systems, either: (a) expose OData services via SAP Cloud Connector + BTP Destination Service, or (b) run the SAP Sage backend inside your corporate network where the SAP host is directly reachable.
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Export helper for other components to read connections ───────────────────
export function getConnection(systemId) {
  const all = loadConnections();
  return all[systemId]?.config || null;
}

export function getAllConnections() {
  return loadConnections();
}

// ─── Main SystemConnector panel ───────────────────────────────────────────────
export default function SystemConnector({ onClose }) {
  const { C, isDark } = useTheme();
  const connections   = loadConnections();
  const connectedCount = Object.keys(connections).length;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>

      <div style={{
        width: '100%', maxWidth: 680, maxHeight: '88vh',
        background: C.bgPanel, border: `1px solid ${C.borderMid}`,
        borderRadius: 14, display: 'flex', flexDirection: 'column',
        overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,.5)',
      }}>

        {/* Modal header */}
        <div style={{
          padding: '16px 20px', borderBottom: `1px solid ${C.border}`,
          display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0,
          background: `linear-gradient(135deg, ${C.cyan}06 0%, transparent 100%)`,
        }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: `${C.cyan}16`, border: `1px solid ${C.cyan}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: C.cyan }}>⊙</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 16, color: C.white }}>SAP System Connections</div>
            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11.5, color: C.textSub, marginTop: 2 }}>
              {connectedCount > 0
                ? `${connectedCount} system${connectedCount > 1 ? 's' : ''} configured — credentials stored locally in browser`
                : 'Optional — connect SAP systems for live data in AI responses'}
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 30, height: 30, borderRadius: 6, border: `1px solid ${C.border}`,
            background: 'none', cursor: 'pointer', color: C.textSub, fontSize: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.red; e.currentTarget.style.color = C.red; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textSub; }}>✕</button>
        </div>

        {/* Security note */}
        <div style={{ padding: '10px 20px', borderBottom: `1px solid ${C.border}`, flexShrink: 0, background: `${C.amber}08` }}>
          <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: C.amber, lineHeight: 1.6 }}>
            🔒 <strong>Security:</strong> Credentials are stored only in your browser's localStorage — never sent to any server except directly to your SAP systems. Use read-only service accounts. For on-premise systems, ensure the SAP host is reachable from your browser or via Cloud Connector.
          </div>
        </div>

        {/* System cards — scrollable */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {SYSTEM_TYPES.map(sys => (
            <SystemCard key={sys.id} sys={sys} C={C} isDark={isDark} />
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 20px', borderTop: `1px solid ${C.border}`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9.5, color: C.textMute }}>
            {connectedCount} / {SYSTEM_TYPES.length} systems configured
          </div>
          <button onClick={onClose} style={{
            padding: '7px 20px', borderRadius: 7, border: 'none', cursor: 'pointer',
            background: C.cyan, color: '#000',
            fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 12,
          }}>Done</button>
        </div>
      </div>
    </div>
  );
}
