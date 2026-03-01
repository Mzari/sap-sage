import { useState } from 'react';
import { C } from '../constants.js';
import { PROVIDERS } from '../ai.js';

export default function ProviderBar({ provider, setProvider, model, setModel, apiKeys, setApiKeys }) {
  const [showKey, setShowKey] = useState(false);
  const prov = PROVIDERS[provider];

  return (
    <div style={{
      background: C.bgCard, border: `1px solid ${C.border}`,
      borderRadius: 10, padding: '12px 16px', marginBottom: 16,
    }}>
      {/* Provider tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
        {Object.entries(PROVIDERS).map(([key, p]) => (
          <button key={key} onClick={() => { setProvider(key); setModel(p.model); setShowKey(false); }} style={{
            padding: '4px 12px', borderRadius: 5,
            border: `1px solid ${provider === key ? p.color : C.border}`,
            background: provider === key ? `${p.color}14` : C.bgInput,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'all .15s',
          }}>
            <span style={{ fontFamily: 'Sora', fontSize: 11.5, color: provider === key ? p.color : C.textSub, fontWeight: provider === key ? 600 : 400 }}>{p.name}</span>
            <span style={{ fontSize: 8, fontFamily: 'IBM Plex Mono', padding: '1px 5px', borderRadius: 3, background: `${p.color}20`, color: p.color, border: `1px solid ${p.color}30`, fontWeight: 700 }}>{p.badge}</span>
          </button>
        ))}
      </div>

      {/* Model + Key row */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <select value={model} onChange={e => setModel(e.target.value)} style={{
          flex: 1, minWidth: 220, background: C.bgInput, border: `1px solid ${C.border}`,
          borderRadius: 5, padding: '5px 9px', color: C.text,
          fontFamily: 'IBM Plex Mono', fontSize: 11, outline: 'none',
        }}>
          <option value={prov.model}>{prov.model} (default)</option>
          {prov.altModels.map(m => <option key={m} value={m}>{m}</option>)}
        </select>

        {provider !== 'ollama' && (
          <button onClick={() => setShowKey(p => !p)} style={{
            padding: '5px 11px', borderRadius: 5, border: `1px solid ${C.border}`,
            background: C.bgInput, cursor: 'pointer', color: C.textSub,
            fontSize: 11, fontFamily: 'IBM Plex Mono',
          }}>{showKey ? '▲ Hide' : '▼ API Key'}</button>
        )}

        {/* Status dot */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: (apiKeys[provider] || provider === 'ollama') ? C.green : C.amber }} />
          <span style={{ fontSize: 10, fontFamily: 'IBM Plex Mono', color: C.textMute }}>
            {provider === 'ollama' ? 'local' : apiKeys[provider] ? 'ready' : 'no key'}
          </span>
        </div>
      </div>

      {/* API Key input */}
      {showKey && provider !== 'ollama' && (
        <div style={{ marginTop: 10 }}>
          <input
            type="password"
            value={apiKeys[provider] || ''}
            onChange={e => setApiKeys(prev => ({ ...prev, [provider]: e.target.value }))}
            placeholder={`Paste ${prov.name} API key...`}
            style={{
              width: '100%', background: C.bgInput, border: `1px solid ${prov.color}40`,
              borderRadius: 5, padding: '7px 11px', color: C.text,
              fontFamily: 'IBM Plex Mono', fontSize: 12, outline: 'none',
            }}
          />
          <div style={{ fontSize: 10, color: C.textMute, fontFamily: 'Sora', marginTop: 4 }}>
            Get key: {prov.keyHint} — stored in memory only, never persisted
          </div>
        </div>
      )}
    </div>
  );
}
