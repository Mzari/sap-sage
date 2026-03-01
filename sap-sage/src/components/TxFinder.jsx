import { useState } from 'react';
import { C, TRANSACTIONS } from '../constants.js';
import { SectionHead, Tag, CopyButton } from './Primitives.jsx';

const MOD_COLOR = {
  BASIS: C.textSub, ABAP: C.cyan, ALE: C.purple, FI: C.green, CO: C.green,
  MM: C.amber, SD: C.cyan, PM: C.purple, QM: C.red, PP: C.yellow,
  HCM: C.pink, PS: C.blue, EEM: C.green, CPI: C.green, APIM: C.amber, EM: C.purple,
};

export default function TxFinder() {
  const [q, setQ]     = useState('');
  const [mod, setMod] = useState('ALL');
  const mods = ['ALL', ...new Set(TRANSACTIONS.map(t => t[1]))];

  const filtered = TRANSACTIONS.filter(t => {
    const s = q.toLowerCase();
    const match = !s || t[0].toLowerCase().includes(s) || t[2].toLowerCase().includes(s) || t[3].toLowerCase().includes(s);
    return match && (mod === 'ALL' || t[1] === mod);
  });

  return (
    <div>
      <SectionHead title="Transaction Finder" sub={`${TRANSACTIONS.length} transactions indexed across all SAP modules`} icon="⊞" color={C.amber} />

      <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: C.textSub, fontSize: 12 }}>⊕</span>
          <input value={q} onChange={e => setQ(e.target.value)}
            placeholder="Search transaction code, description, category..."
            style={{
              width: '100%', background: C.bgInput, border: `1px solid ${C.border}`,
              borderRadius: 6, padding: '8px 11px 8px 30px',
              color: C.text, fontFamily: 'Sora', fontSize: 12, outline: 'none',
            }} />
        </div>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {mods.map(m => (
            <button key={m} onClick={() => setMod(m)} style={{
              padding: '4px 10px', borderRadius: 4,
              border: `1px solid ${mod === m ? (MOD_COLOR[m] || C.cyan) : C.border}`,
              background: mod === m ? `${MOD_COLOR[m] || C.cyan}12` : C.bgInput,
              color: mod === m ? (MOD_COLOR[m] || C.cyan) : C.textSub,
              fontSize: 10, cursor: 'pointer', fontFamily: 'IBM Plex Mono', fontWeight: 600, transition: 'all .15s',
            }}>{m}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 8 }}>
        {filtered.map((tx, i) => (
          <div key={i} style={{
            background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 7,
            padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10,
            transition: 'border-color .15s',
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = MOD_COLOR[tx[1]] || C.cyan}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
            <div style={{ fontFamily: 'IBM Plex Mono', fontWeight: 600, fontSize: 12, color: MOD_COLOR[tx[1]] || C.cyan, minWidth: 95, flexShrink: 0 }}>{tx[0]}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Sora', fontSize: 11.5, color: C.text }}>{tx[2]}</div>
              <div style={{ display: 'flex', gap: 5, marginTop: 4 }}>
                <Tag color={MOD_COLOR[tx[1]] || C.cyan}>{tx[1]}</Tag>
                <Tag color={C.textSub}>{tx[3]}</Tag>
              </div>
            </div>
            <CopyButton text={tx[0]} id={`tx-${i}`} />
          </div>
        ))}
      </div>

      {!filtered.length && (
        <div style={{ textAlign: 'center', padding: 40, color: C.textSub, fontFamily: 'Sora' }}>
          No transactions found for "{q}"
        </div>
      )}
    </div>
  );
}
