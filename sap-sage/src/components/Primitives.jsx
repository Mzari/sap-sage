import { C } from '../constants.js';
import { useCopy } from '../hooks.js';

export function Tag({ children, color }) {
  return (
    <span style={{
      fontSize: 9, fontFamily: 'IBM Plex Mono', padding: '2px 7px',
      borderRadius: 3, fontWeight: 600, letterSpacing: '.05em',
      background: `${color || C.cyan}18`,
      color: color || C.cyan,
      border: `1px solid ${color || C.cyan}30`,
    }}>{children}</span>
  );
}

export function SectionHead({ title, sub, color, icon }) {
  return (
    <div style={{ marginBottom: 20, paddingBottom: 14, borderBottom: `1px solid ${C.border}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {icon && <span style={{ fontSize: 18, color: color || C.cyan }}>{icon}</span>}
        <div>
          <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 18, color: C.white }}>{title}</div>
          {sub && <div style={{ fontFamily: 'Sora', fontSize: 12, color: C.textSub, marginTop: 2 }}>{sub}</div>}
        </div>
      </div>
    </div>
  );
}

export function InfoBox({ type = 'info', children }) {
  const cfg = {
    info:  { c: C.cyan,   sym: 'ℹ' },
    warn:  { c: C.amber,  sym: '⚠' },
    ok:    { c: C.green,  sym: '✓' },
    err:   { c: C.red,    sym: '✗' },
  }[type] || { c: C.cyan, sym: 'ℹ' };
  return (
    <div style={{
      display: 'flex', gap: 10, padding: '9px 14px', borderRadius: 6, margin: '10px 0',
      background: `${cfg.c}09`, border: `1px solid ${cfg.c}28`,
    }}>
      <span style={{ color: cfg.c, fontSize: 12, fontFamily: 'IBM Plex Mono', flexShrink: 0, marginTop: 1 }}>{cfg.sym}</span>
      <div style={{ fontSize: 12, color: C.text, lineHeight: 1.65, fontFamily: 'Sora' }}>{children}</div>
    </div>
  );
}

export function CopyButton({ text, id }) {
  const [copiedId, copy] = useCopy();
  const ok = copiedId === id;
  return (
    <button onClick={() => copy(text, id)} style={{
      background: 'none', border: `1px solid ${ok ? C.green : C.border}`, cursor: 'pointer',
      padding: '2px 8px', borderRadius: 3, color: ok ? C.green : C.textSub,
      fontSize: 10, fontFamily: 'IBM Plex Mono', transition: 'all .15s', flexShrink: 0,
    }}>{ok ? '✓ copied' : '⎘ copy'}</button>
  );
}

export function Card({ children, style = {} }) {
  return (
    <div style={{
      background: C.bgCard, border: `1px solid ${C.border}`,
      borderRadius: 10, padding: 18, ...style,
    }}>{children}</div>
  );
}
