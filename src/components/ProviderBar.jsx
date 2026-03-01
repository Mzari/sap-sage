import { useState } from 'react';
import { PROVIDERS } from '../ai.js';
import { useTheme } from '../theme.jsx';

export default function ProviderBar({ provider, setProvider, model, setModel, apiKeys, setApiKeys }) {
  const { C } = useTheme();
  const [showKey, setShowKey] = useState(false);
  const prov   = PROVIDERS[provider];
  const hasKey = !!(apiKeys[provider] || prov?.apiKey || provider === 'ollama');

  return (
    <div style={{
      background:C.bgCard, border:`1px solid ${C.borderMid}`,
      borderRadius:10, padding:'10px 14px', marginBottom:14, flexShrink:0,
    }}>
      {/* Row 1 */}
      <div style={{ display:'flex', gap:6, alignItems:'center', flexWrap:'wrap' }}>

        <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
          {Object.entries(PROVIDERS).map(([key, p]) => {
            const isActive = provider === key;
            return (
              <button key={key} onClick={() => { setProvider(key); setModel(p.model); setShowKey(false); }} style={{
                padding:'4px 11px', borderRadius:6,
                border:`1px solid ${isActive ? p.color : C.border}`,
                background: isActive ? `${p.color}14` : C.bgInput,
                cursor:'pointer', display:'flex', alignItems:'center', gap:6,
              }}>
                <span style={{ fontFamily:"'Inter',sans-serif", fontSize:11.5, color: isActive ? p.color : C.textSub, fontWeight: isActive?600:400 }}>{p.name}</span>
                <span style={{ fontSize:7.5, fontFamily:"'JetBrains Mono',monospace", padding:'1px 5px', borderRadius:3, background:`${p.color}18`, color:p.color, border:`1px solid ${p.color}28`, fontWeight:700 }}>{p.badge}</span>
              </button>
            );
          })}
        </div>

        <div style={{ flex:1, minWidth:8 }} />

        {/* Model selector */}
        <select value={model} onChange={e => setModel(e.target.value)} style={{
          background:C.bgInput, border:`1px solid ${C.border}`, borderRadius:6,
          padding:'4px 9px', color:C.text, fontFamily:"'JetBrains Mono',monospace",
          fontSize:10.5, cursor:'pointer', minWidth:220,
        }}>
          <option value={prov.model}>{prov.model}</option>
          {prov.altModels.map(m => <option key={m} value={m}>{m}</option>)}
        </select>

        {/* Status */}
        <div style={{ display:'flex', alignItems:'center', gap:5, padding:'4px 10px', borderRadius:6, background:C.bgInput, border:`1px solid ${C.border}` }}>
          <div style={{ width:6, height:6, borderRadius:'50%', background: hasKey ? C.green : C.amber, animation: hasKey?'none':'pulse-dot 2s infinite' }} />
          <span style={{ fontSize:10, fontFamily:"'JetBrains Mono',monospace", color: hasKey ? C.green : C.amber }}>
            {provider === 'ollama' ? 'local' : hasKey ? 'ready' : 'no key'}
          </span>
        </div>

        {provider !== 'ollama' && (
          <button onClick={() => setShowKey(p => !p)} style={{
            padding:'4px 10px', borderRadius:6,
            border:`1px solid ${showKey ? prov.color+'50' : C.border}`,
            background: showKey ? `${prov.color}10` : C.bgInput,
            cursor:'pointer', color: showKey ? prov.color : C.textSub,
            fontSize:10.5, fontFamily:"'Inter',sans-serif",
          }}>
            {showKey ? '▲ Hide Key' : '🔑 API Key'}
          </button>
        )}
      </div>

      {/* Key input */}
      {showKey && provider !== 'ollama' && (
        <div style={{ marginTop:10, display:'flex', gap:8, alignItems:'center' }}>
          <input
            type="password"
            value={apiKeys[provider] || ''}
            onChange={e => setApiKeys(prev => ({ ...prev, [provider]: e.target.value }))}
            placeholder={`${prov.name} API key…`}
            style={{
              flex:1, background:C.bgInput, border:`1px solid ${prov.color}40`,
              borderRadius:6, padding:'7px 11px', color:C.text,
              fontFamily:"'JetBrains Mono',monospace", fontSize:12,
            }}
          />
          <div style={{ fontSize:10.5, color:C.textSub, fontFamily:"'Inter',sans-serif", whiteSpace:'nowrap' }}>{prov.keyHint}</div>
        </div>
      )}

      {/* Ollama */}
      {provider === 'ollama' && (
        <div style={{ marginTop:10, padding:'8px 12px', background:C.bgInput, borderRadius:6, border:`1px solid ${C.border}` }}>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10.5, color:C.textSub, lineHeight:1.7 }}>
            Run locally: <span style={{ color:C.cyan }}>OLLAMA_ORIGINS="*" ollama serve</span>
            &nbsp;·&nbsp;
            Pull model: <span style={{ color:C.cyan }}>ollama pull {prov.model}</span>
          </div>
        </div>
      )}
    </div>
  );
}
