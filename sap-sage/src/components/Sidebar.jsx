import { C, NAV, SECTION_COLOR } from '../constants.js';

export default function Sidebar({ active, setActive, expanded, toggleExpand }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <div style={{ padding: '15px 14px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 9 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 7, fontSize: 14, color: C.cyan, flexShrink: 0,
          background: `${C.cyan}18`, border: `1px solid ${C.cyan}35`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>⬡</div>
        <div>
          <div style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 14, color: C.white }}>SAP Sage</div>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 8, color: C.textMute, textTransform: 'uppercase', letterSpacing: '.08em', marginTop: 1 }}>Intelligence Platform</div>
        </div>
      </div>

      {/* Nav Items */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 6px' }}>
        {NAV.map((item, idx) => {
          if (item.separator) return (
            <div key={idx} style={{ padding: '12px 8px 4px', fontFamily: 'IBM Plex Mono', fontSize: 8, color: C.textMute, textTransform: 'uppercase', letterSpacing: '.12em' }}>
              {item.label}
            </div>
          );

          const isActive  = active === item.id;
          const isExp     = expanded[item.id];
          const secColor  = SECTION_COLOR[item.section] || C.textSub;

          return (
            <div key={item.id}>
              <button
                onClick={() => { if (item.children) toggleExpand(item.id); else setActive(item.id); }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 7,
                  padding: '6px 8px', borderRadius: 6, border: 'none', cursor: 'pointer', textAlign: 'left',
                  background: isActive ? `${secColor}14` : 'transparent',
                  borderLeft: `2px solid ${isActive ? secColor : 'transparent'}`,
                  marginBottom: 1, transition: 'all .12s',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = `${C.border}50`; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}>
                <span style={{ fontSize: 11, color: isActive ? secColor : C.textSub, flexShrink: 0 }}>{item.icon}</span>
                <span style={{
                  flex: 1, fontSize: 11.5, fontFamily: 'Sora',
                  fontWeight: isActive ? 600 : 400, color: isActive ? C.white : C.textSub,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>{item.label}</span>
                {item.badge && (
                  <span style={{ fontSize: 8, fontFamily: 'IBM Plex Mono', padding: '1px 5px', borderRadius: 3, background: `${secColor}20`, color: secColor, border: `1px solid ${secColor}30`, fontWeight: 700 }}>{item.badge}</span>
                )}
                {item.children && (
                  <span style={{ fontSize: 9, color: C.textMute, flexShrink: 0 }}>{isExp ? '▾' : '▸'}</span>
                )}
              </button>

              {item.children && isExp && (
                <div style={{ paddingLeft: 4, marginBottom: 2 }}>
                  {item.children.map(child => (
                    <button key={child.id} onClick={() => setActive(child.id)} style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 6,
                      padding: '5px 8px 5px 18px', borderRadius: 5, border: 'none', cursor: 'pointer', textAlign: 'left',
                      background: active === child.id ? `${child.color || C.cyan}12` : 'transparent',
                      borderLeft: `1px solid ${active === child.id ? (child.color || C.cyan) : C.border}`,
                      marginBottom: 1, transition: 'all .12s',
                    }}
                      onMouseEnter={e => { if (active !== child.id) e.currentTarget.style.background = `${C.border}40`; }}
                      onMouseLeave={e => { if (active !== child.id) e.currentTarget.style.background = 'transparent'; }}>
                      <div style={{ width: 4, height: 4, borderRadius: '50%', background: child.color || C.cyan, flexShrink: 0 }} />
                      <span style={{ fontSize: 11, fontFamily: 'Sora', color: active === child.id ? C.text : C.textSub, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{child.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ padding: '10px 12px', borderTop: `1px solid ${C.border}` }}>
        <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, color: C.textMute }}>SAP Sage v3.0  ·  Multi-Backend AI</div>
        <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, color: C.textMute, marginTop: 2 }}>Groq · Anthropic · Ollama · Together</div>
      </div>
    </div>
  );
}
