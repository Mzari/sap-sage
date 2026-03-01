import { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../theme.jsx';
import { getSessions, deleteSession, createSession } from '../api.js';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  if (d < 7)  return `${d}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

function groupSessions(sessions) {
  const now   = Date.now();
  const today = new Date(); today.setHours(0,0,0,0);
  const yest  = new Date(today); yest.setDate(yest.getDate()-1);
  const week  = new Date(today); week.setDate(week.getDate()-7);

  const groups = { Today: [], Yesterday: [], 'This Week': [], Older: [] };
  sessions.forEach(s => {
    const d = new Date(s.created_at);
    if (d >= today)      groups['Today'].push(s);
    else if (d >= yest)  groups['Yesterday'].push(s);
    else if (d >= week)  groups['This Week'].push(s);
    else                 groups['Older'].push(s);
  });
  return groups;
}

export default function HistoryPanel({ onSelectSession, activeSessionId, onNewChat }) {
  const { C, isDark } = useTheme();
  const [sessions,   setSessions]   = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [collapsed,  setCollapsed]  = useState(false);
  const [search,     setSearch]     = useState('');
  const [confirmDel, setConfirmDel] = useState(null);
  const [backendOk,  setBackendOk]  = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const r = await getSessions();
    setBackendOk(Array.isArray(r));
    setSessions(Array.isArray(r) ? r : []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (confirmDel === id) {
      await deleteSession(id);
      setSessions(p => p.filter(s => s.id !== id));
      if (activeSessionId === id) onNewChat?.();
      setConfirmDel(null);
    } else {
      setConfirmDel(id);
      setTimeout(() => setConfirmDel(null), 3000);
    }
  };

  const handleNew = async () => {
    onNewChat?.();
    await load();
  };

  if (!backendOk && backendOk !== null) return null; // backend offline — hide panel

  const filtered = sessions.filter(s =>
    !search || (s.title || '').toLowerCase().includes(search.toLowerCase())
  );
  const groups = groupSessions(filtered);

  return (
    <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 8 }}>

      {/* Header */}
      <div
        onClick={() => setCollapsed(p => !p)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 14px', cursor: 'pointer',
          userSelect: 'none',
        }}
        onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,.03)' : 'rgba(0,0,0,.03)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: C.textMute, letterSpacing: '.1em' }}>HISTORY</span>
          {sessions.length > 0 && (
            <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 3, background: `${C.cyan}18`, color: C.cyan, fontFamily: "'JetBrains Mono',monospace" }}>
              {sessions.length}
            </span>
          )}
        </div>
        <span style={{ fontSize: 9, color: C.textMute }}>{collapsed ? '▸' : '▾'}</span>
      </div>

      {!collapsed && (
        <div style={{ padding: '0 10px 10px' }}>

          {/* Search + New */}
          <div style={{ display: 'flex', gap: 5, marginBottom: 8 }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search…"
              style={{
                flex: 1, background: C.bgInput, border: `1px solid ${C.border}`,
                borderRadius: 5, padding: '4px 8px', color: C.text,
                fontFamily: "'Inter',sans-serif", fontSize: 11,
              }}
            />
            <button
              onClick={handleNew}
              title="New chat"
              style={{
                width: 26, height: 26, borderRadius: 5, border: `1px solid ${C.border}`,
                background: 'none', cursor: 'pointer', color: C.cyan, fontSize: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = `${C.cyan}14`; e.currentTarget.style.borderColor = `${C.cyan}50`; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = C.border; }}
            >+</button>
          </div>

          {/* Session list */}
          <div style={{ maxHeight: 260, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {loading && (
              <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: C.textMute, textAlign: 'center', padding: 12 }}>
                Loading…
              </div>
            )}
            {!loading && filtered.length === 0 && (
              <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: C.textMute, textAlign: 'center', padding: 12 }}>
                {search ? 'No results' : 'No conversations yet'}
              </div>
            )}

            {Object.entries(groups).map(([group, items]) => {
              if (!items.length) return null;
              return (
                <div key={group}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8.5, color: C.textMute, padding: '5px 4px 3px', letterSpacing: '.06em' }}>
                    {group.toUpperCase()}
                  </div>
                  {items.map(s => (
                    <div
                      key={s.id}
                      onClick={() => onSelectSession?.(s.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '5px 7px', borderRadius: 6, cursor: 'pointer',
                        background: activeSessionId === s.id ? `${C.cyan}14` : 'transparent',
                        border: `1px solid ${activeSessionId === s.id ? C.cyan + '30' : 'transparent'}`,
                        transition: 'all .1s',
                        position: 'relative',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = activeSessionId === s.id ? `${C.cyan}14` : (isDark ? 'rgba(255,255,255,.04)' : 'rgba(0,0,0,.04)');
                        e.currentTarget.querySelector('.del-btn').style.opacity = '1';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = activeSessionId === s.id ? `${C.cyan}14` : 'transparent';
                        e.currentTarget.querySelector('.del-btn').style.opacity = '0';
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontFamily: "'Inter',sans-serif", fontSize: 11.5, color: activeSessionId === s.id ? C.cyan : C.text,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: activeSessionId === s.id ? 600 : 400,
                        }}>
                          {s.title || 'New conversation'}
                        </div>
                        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: C.textMute, marginTop: 1 }}>
                          {timeAgo(s.created_at)}
                        </div>
                      </div>
                      <button
                        className="del-btn"
                        onClick={e => handleDelete(s.id, e)}
                        title={confirmDel === s.id ? 'Click again to confirm delete' : 'Delete'}
                        style={{
                          opacity: 0, width: 18, height: 18, borderRadius: 4, border: 'none',
                          background: confirmDel === s.id ? C.red : 'transparent',
                          cursor: 'pointer', color: confirmDel === s.id ? '#fff' : C.red,
                          fontSize: 10, flexShrink: 0, transition: 'all .15s',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        {confirmDel === s.id ? '✓' : '✕'}
                      </button>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
