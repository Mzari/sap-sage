import { useState } from 'react';
import { TRANSACTIONS } from '../constants.js';
import { useTheme } from '../theme.jsx';
import { SectionHead, Tag, CopyButton } from './Primitives.jsx';

const MOD_COLOR = {
  BASIS:'#607D8B', ABAP:'#00C8FF', ALE:'#14B8A6', EEM:'#00D68F',
  FI:'#00D68F', CO:'#00D68F', MM:'#FF9500', SD:'#00C8FF',
  PM:'#A855F7', QM:'#FF4466', PP:'#F59E0B', HCM:'#EC4899', PS:'#3B82F6',
};

export default function TxFinder() {
  const { C } = useTheme();
  const [q,   setQ]   = useState('');
  const [mod, setMod] = useState('ALL');
  const mods = ['ALL', ...new Set(TRANSACTIONS.map(t => t[1]))];

  const filtered = TRANSACTIONS.filter(([code, module, desc, cat]) => {
    const s = q.toLowerCase();
    return (!s || code.toLowerCase().includes(s) || desc.toLowerCase().includes(s) || cat.toLowerCase().includes(s))
      && (mod === 'ALL' || module === mod);
  });

  return (
    <div>
      <SectionHead title="Transaction Finder" sub={`${TRANSACTIONS.length} SAP transactions indexed — search by code, description, or category`} icon="⊞" color={C.teal} />

      <div style={{ background:C.bgCard, border:`1px solid ${C.border}`, borderRadius:10, padding:16, marginBottom:16 }}>
        <div style={{ position:'relative', marginBottom:12 }}>
          <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:C.textSub, fontSize:13 }}>⊕</span>
          <input value={q} onChange={e=>setQ(e.target.value)}
            placeholder="Search transaction code, description, category…"
            style={{
              width:'100%', background:C.bgInput,
              border:`1px solid ${q ? C.borderMid : C.border}`,
              borderRadius:7, padding:'9px 12px 9px 34px',
              color:C.text, fontFamily:"'Inter',sans-serif", fontSize:13,
            }}
            onFocus={e=>e.target.style.borderColor=C.cyan+'50'}
            onBlur={e=>e.target.style.borderColor=q?C.borderMid:C.border}
          />
        </div>
        <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
          {mods.map(m => (
            <button key={m} onClick={() => setMod(m)} style={{
              padding:'4px 11px', borderRadius:5,
              border:`1px solid ${mod===m ? (MOD_COLOR[m]||C.cyan) : C.border}`,
              background: mod===m ? `${MOD_COLOR[m]||C.cyan}12` : C.bgInput,
              color: mod===m ? (MOD_COLOR[m]||C.cyan) : C.textSub,
              fontSize:10, cursor:'pointer', fontFamily:"'JetBrains Mono',monospace", fontWeight:600,
            }}>{m}</button>
          ))}
        </div>
      </div>

      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:C.textMute, marginBottom:10 }}>
        {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        {q && <span> for "<span style={{ color:C.cyan }}>{q}</span>"</span>}
        {mod !== 'ALL' && <span> in <span style={{ color:MOD_COLOR[mod]||C.cyan }}>{mod}</span></span>}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px,1fr))', gap:7 }}>
        {filtered.map((tx, i) => {
          const col = MOD_COLOR[tx[1]] || C.cyan;
          return (
            <div key={i} style={{
              background:C.bgCard, border:`1px solid ${C.border}`, borderRadius:8,
              padding:'10px 13px', display:'flex', alignItems:'center', gap:10, cursor:'default',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=col+'50'; e.currentTarget.style.background=`${col}06`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.background=C.bgCard; }}>
              <code style={{ fontFamily:"'JetBrains Mono',monospace", fontWeight:700, fontSize:11.5, color:col, minWidth:105, flexShrink:0 }}>{tx[0]}</code>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:"'Inter',sans-serif", fontSize:11.5, color:C.text, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{tx[2]}</div>
                <div style={{ display:'flex', gap:4, marginTop:4 }}>
                  <Tag color={col}>{tx[1]}</Tag>
                  <Tag color={C.textSub}>{tx[3]}</Tag>
                </div>
              </div>
              <CopyButton text={tx[0]} id={`tx-${i}`} />
            </div>
          );
        })}
      </div>

      {!filtered.length && (
        <div style={{ textAlign:'center', padding:'50px 20px', color:C.textSub }}>
          <div style={{ fontSize:32, marginBottom:12 }}>⊘</div>
          <div style={{ fontFamily:"'Inter',sans-serif", fontSize:14 }}>No transactions found for "{q}"</div>
        </div>
      )}
    </div>
  );
}
