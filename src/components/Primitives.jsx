import { useState } from 'react';
import { useTheme } from '../theme.jsx';

export function Tag({ children, color }) {
  const { C } = useTheme();
  const col = color || C.cyan;
  return (
    <span style={{
      display:'inline-block', fontSize:9.5, fontFamily:"'JetBrains Mono',monospace",
      padding:'2px 8px', borderRadius:3, fontWeight:600, letterSpacing:'.04em',
      background:`${col}12`, color:col, border:`1px solid ${col}28`,
    }}>{children}</span>
  );
}

export function StatCard({ label, val, color }) {
  const { C } = useTheme();
  const col = color || C.cyan;
  return (
    <div style={{
      background:C.bgInput, border:`1px solid ${col}22`,
      borderTop:`2px solid ${col}60`, borderRadius:8, padding:'10px 14px',
      flex:'1 1 160px', minWidth:0,
    }}>
      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:8.5, color:C.textMute, textTransform:'uppercase', letterSpacing:'.08em', marginBottom:5 }}>{label}</div>
      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10.5, color:col, fontWeight:600, lineHeight:1.5 }}>{val}</div>
    </div>
  );
}

export function SectionHead({ title, sub, icon, color }) {
  const { C } = useTheme();
  const col = color || C.cyan;
  return (
    <div style={{ marginBottom:16, paddingBottom:14, borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
      <div style={{ display:'flex', alignItems:'center', gap:11 }}>
        {icon && <span style={{ fontSize:18, color:col }}>{icon}</span>}
        <div>
          <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:18, color:C.white, letterSpacing:'-.015em' }}>{title}</div>
          {sub && <div style={{ fontFamily:"'Inter',sans-serif", fontSize:12, color:C.textSub, marginTop:2, lineHeight:1.5 }}>{sub}</div>}
        </div>
      </div>
    </div>
  );
}

export function InfoBox({ type = 'info', children }) {
  const { C } = useTheme();
  const cfg = { info:{c:C.cyan,s:'ℹ'}, warn:{c:C.amber,s:'⚠'}, ok:{c:C.green,s:'✓'}, err:{c:C.red,s:'✗'} }[type] || {c:C.cyan,s:'ℹ'};
  return (
    <div style={{ display:'flex', gap:9, padding:'9px 13px', borderRadius:6, margin:'8px 0', background:`${cfg.c}08`, border:`1px solid ${cfg.c}25` }}>
      <span style={{ color:cfg.c, fontSize:11, fontFamily:"'JetBrains Mono',monospace", flexShrink:0, marginTop:1 }}>{cfg.s}</span>
      <div style={{ fontSize:12, color:C.text, lineHeight:1.65, fontFamily:"'Inter',sans-serif" }}>{children}</div>
    </div>
  );
}

export function CopyButton({ text, id }) {
  const { C } = useTheme();
  const [ok, setOk] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard?.writeText(text).catch(()=>{}); setOk(true); setTimeout(()=>setOk(false),1800); }} style={{
      background:'none', border:`1px solid ${ok?C.green:C.border}`,
      cursor:'pointer', padding:'2px 9px', borderRadius:4,
      color:ok?C.green:C.textSub, fontSize:9.5,
      fontFamily:"'JetBrains Mono',monospace", flexShrink:0,
    }}>{ok?'✓ copied':'⎘ copy'}</button>
  );
}

export function Card({ children, style = {}, color }) {
  const { C } = useTheme();
  return (
    <div style={{
      background:C.bgCard, border:`1px solid ${color ? `${color}22` : C.border}`,
      borderRadius:10, padding:18,
      borderTop: color ? `2px solid ${color}50` : undefined,
      ...style,
    }}>{children}</div>
  );
}
