import { NAV, SC } from '../constants.js';
import { useTheme } from '../theme.jsx';
import HistoryPanel from './HistoryPanel.jsx';

export default function Sidebar({ active, setActive, expanded, toggleExpand, onSelectSession, activeSessionId, onNewChat }) {
  const { C, isDark } = useTheme();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Logo */}
      <div style={{
        padding: '14px 16px', borderBottom: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
        background: `linear-gradient(180deg, ${C.cyan}06 0%, transparent 100%)`,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8, flexShrink: 0,
          background: `linear-gradient(135deg, ${C.cyan}28 0%, ${C.cyan}08 100%)`,
          border: `1px solid ${C.cyan}35`, display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 15, color: C.cyan,
        }}>⬡</div>
        <div>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: 15, color: C.white, letterSpacing: '-.02em' }}>SAP Sage</div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: C.textMute, textTransform: 'uppercase', letterSpacing: '.1em' }}>Intelligence Platform</div>
        </div>
      </div>

      {/* Nav — scrollable */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '6px 6px 10px' }}>
        {NAV.map((item, idx) => {

          if (item.separator) return (
            <div key={idx} style={{ padding: '12px 10px 4px', display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ height: 1, flex: 1, background: C.border }} />
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: C.textMute, textTransform: 'uppercase', letterSpacing: '.12em', flexShrink: 0 }}>{item.label}</span>
              <div style={{ height: 1, flex: 1, background: C.border }} />
            </div>
          );

          const isActive = active === item.id;
          const isExp = expanded[item.id];
          const secColor = SC[item.section] || C.textSub;

          return (
            <div key={item.id}>
              <button
                onClick={() => item.children ? toggleExpand(item.id) : setActive(item.id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 7,
                  padding: '6px 8px', borderRadius: 6, border: 'none', cursor: 'pointer',
                  textAlign: 'left', marginBottom: 1,
                  background: isActive ? `${secColor}12` : 'transparent',
                  borderLeft: `2px solid ${isActive ? secColor : 'transparent'}`,
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = isDark ? 'rgba(255,255,255,.028)' : 'rgba(0,0,0,.04)'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}>

                <span style={{ fontSize: 11, color: isActive ? secColor : C.textMute, flexShrink: 0, width: 14, textAlign: 'center' }}>{item.icon}</span>
                <span style={{
                  flex: 1, fontSize: 11.5, fontFamily: "'Inter',sans-serif",
                  fontWeight: isActive ? 600 : 400, color: isActive ? C.textBright : C.text,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>{item.label}</span>

                {item.badge && (
                  <span style={{ fontSize: 8, fontFamily: "'JetBrains Mono',monospace", padding: '1px 5px', borderRadius: 3, background: `${secColor}18`, color: secColor, border: `1px solid ${secColor}28`, fontWeight: 700, flexShrink: 0 }}>{item.badge}</span>
                )}
                {item.children && (
                  <span style={{ fontSize: 8, color: C.textMute, flexShrink: 0, transform: isExp ? 'rotate(90deg)' : 'none', transition: 'transform .15s', display: 'inline-block' }}>▶</span>
                )}
              </button>

              {item.children && isExp && (
                <div style={{ paddingLeft: 6, marginBottom: 2 }}>
                  {item.children.map(child => {
                    const isCA = active === child.id;
                    const cc = child.color || C.cyan;
                    return (
                      <button key={child.id} onClick={() => setActive(child.id)} style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 7,
                        padding: '5px 8px 5px 16px', borderRadius: 5, border: 'none',
                        cursor: 'pointer', textAlign: 'left', marginBottom: 1,
                        background: isCA ? `${cc}10` : 'transparent',
                        borderLeft: `2px solid ${isCA ? cc : C.border}`,
                      }}
                        onMouseEnter={e => { if (!isCA) { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,.02)' : 'rgba(0,0,0,.03)'; e.currentTarget.style.borderLeftColor = `${cc}50`; } }}
                        onMouseLeave={e => { if (!isCA) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderLeftColor = C.border; } }}>
                        <div style={{ width: 5, height: 5, borderRadius: '50%', flexShrink: 0, background: isCA ? cc : C.borderMid }} />
                        <span style={{
                          flex: 1, fontSize: 11, fontFamily: "'Inter',sans-serif",
                          fontWeight: isCA ? 600 : 400, color: isCA ? C.textBright : C.textSub,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>{child.label}</span>
                        {isCA && <div style={{ width: 4, height: 4, borderRadius: '50%', background: cc, flexShrink: 0 }} />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* History Panel — above footer */}
      <HistoryPanel
        onSelectSession={onSelectSession}
        activeSessionId={activeSessionId}
        onNewChat={onNewChat}
      />

      {/* Footer */}
      <div style={{ padding: '10px 14px', borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8.5, color: C.textMute, lineHeight: 1.7 }}>
          SAP Sage v3.0 · Multi-Backend AI<br />
          Groq · Anthropic · Ollama · Together
        </div>
      </div>
    </div>
  );
}
