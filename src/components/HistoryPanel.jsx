import { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../theme.jsx';
import { getSessions, createSession, deleteSession } from '../api.js';

// ─── Relative time helper ─────────────────────────────────────────────────────
function relativeTime(dateStr) {
    const now = Date.now();
    const then = new Date(dateStr).getTime();
    const diff = Math.floor((now - then) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 172800) return 'yesterday';
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return new Date(dateStr).toLocaleDateString([], { month: 'short', day: 'numeric' });
}

// ─── Group sessions by date ───────────────────────────────────────────────────
function groupSessions(sessions) {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterdayStart = todayStart - 86400000;
    const weekStart = todayStart - 6 * 86400000;

    const groups = { Today: [], Yesterday: [], 'This Week': [], Older: [] };
    for (const s of sessions) {
        const t = new Date(s.created_at).getTime();
        if (t >= todayStart) groups.Today.push(s);
        else if (t >= yesterdayStart) groups.Yesterday.push(s);
        else if (t >= weekStart) groups['This Week'].push(s);
        else groups.Older.push(s);
    }
    return groups;
}

// ─── Single session row ───────────────────────────────────────────────────────
function SessionItem({ session, isActive, onClick, onDelete, C }) {
    const [hovered, setHovered] = useState(false);
    const [confirming, setConfirming] = useState(false);

    const handleDelete = (e) => {
        e.stopPropagation();
        if (confirming) {
            onDelete(session.id);
            setConfirming(false);
        } else {
            setConfirming(true);
        }
    };

    const cancelDelete = (e) => {
        e.stopPropagation();
        setConfirming(false);
    };

    return (
        <div
            onClick={() => onClick(session.id)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => { setHovered(false); setConfirming(false); }}
            style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '5px 8px', borderRadius: 6, cursor: 'pointer',
                background: isActive ? `${C.cyan}14` : hovered ? (C.isDark ? 'rgba(255,255,255,.035)' : 'rgba(0,0,0,.045)') : 'transparent',
                borderLeft: `2px solid ${isActive ? C.cyan : 'transparent'}`,
                transition: 'all .12s',
                minWidth: 0,
            }}
        >
            {/* Title + time */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                    fontFamily: "'Inter',sans-serif", fontSize: 11.5,
                    color: isActive ? C.textBright : C.text,
                    fontWeight: isActive ? 600 : 400,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                    {session.title || 'Untitled'}
                </div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: C.textMute, marginTop: 1 }}>
                    {relativeTime(session.created_at)}
                </div>
            </div>

            {/* Delete / confirm */}
            {(hovered || confirming) && (
                confirming ? (
                    <div style={{ display: 'flex', gap: 3, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                        <button onClick={handleDelete} style={{
                            padding: '2px 6px', borderRadius: 4, border: 'none', cursor: 'pointer',
                            background: C.red, color: '#fff', fontSize: 9, fontFamily: "'JetBrains Mono',monospace",
                        }}>Yes</button>
                        <button onClick={cancelDelete} style={{
                            padding: '2px 6px', borderRadius: 4, border: `1px solid ${C.border}`, cursor: 'pointer',
                            background: 'none', color: C.textMute, fontSize: 9, fontFamily: "'JetBrains Mono',monospace",
                        }}>Cancel</button>
                    </div>
                ) : (
                    <button onClick={handleDelete} title="Delete conversation" style={{
                        width: 18, height: 18, borderRadius: 4, border: 'none', cursor: 'pointer',
                        background: `${C.red}18`, color: C.red, fontSize: 9, flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>✕</button>
                )
            )}
        </div>
    );
}

// ─── Main HistoryPanel ────────────────────────────────────────────────────────
export default function HistoryPanel({ onSelectSession, activeSessionId, onNewChat }) {
    const { C, isDark } = useTheme();
    const [sessions, setSessions] = useState([]);
    const [search, setSearch] = useState('');
    const [collapsed, setCollapsed] = useState(false);
    const [loading, setLoading] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        const data = await getSessions();
        setSessions(Array.isArray(data) ? data : []);
        setLoading(false);
    }, []);

    useEffect(() => { load(); }, [load]);

    const handleNewChat = async () => {
        onNewChat();
        // Refresh list after a brief delay so new session shows up
        setTimeout(load, 500);
    };

    const handleDelete = async (id) => {
        await deleteSession(id);
        setSessions(prev => prev.filter(s => s.id !== id));
        if (activeSessionId === id) onNewChat();
    };

    const filtered = search
        ? sessions.filter(s => (s.title || '').toLowerCase().includes(search.toLowerCase()))
        : sessions;

    const groups = groupSessions(filtered);

    // ─── Collapsed view ───────────────────────────────────────────────────────
    if (collapsed) {
        return (
            <div style={{ padding: '6px 8px', borderTop: `1px solid ${C.border}` }}>
                <button
                    onClick={() => setCollapsed(false)}
                    style={{
                        width: '100%', padding: '5px 8px', borderRadius: 6,
                        border: `1px solid ${C.border}`, background: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        color: C.textMute,
                    }}
                >
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, textTransform: 'uppercase', letterSpacing: '.1em' }}>
                        HISTORY
                    </span>
                    <span style={{ fontSize: 9 }}>▼</span>
                </button>
            </div>
        );
    }

    // ─── Expanded view ────────────────────────────────────────────────────────
    return (
        <div style={{ borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>

            {/* Section header */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 10px 5px',
            }}>
                <span style={{
                    flex: 1, fontFamily: "'JetBrains Mono',monospace", fontSize: 9,
                    color: C.textMute, textTransform: 'uppercase', letterSpacing: '.1em',
                }}>
                    HISTORY
                    <span style={{
                        marginLeft: 5, padding: '1px 5px', borderRadius: 3,
                        background: `${C.cyan}14`, color: C.cyan, fontSize: 8, fontWeight: 700,
                    }}>
                        {sessions.length}
                    </span>
                </span>

                {/* New Chat button */}
                <button
                    onClick={handleNewChat}
                    title="New Chat"
                    style={{
                        padding: '2px 7px', borderRadius: 4, border: `1px solid ${C.cyan}30`,
                        background: `${C.cyan}0C`, cursor: 'pointer', color: C.cyan,
                        fontFamily: "'JetBrains Mono',monospace", fontSize: 9,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = `${C.cyan}1C`; }}
                    onMouseLeave={e => { e.currentTarget.style.background = `${C.cyan}0C`; }}
                >
                    + New
                </button>

                {/* Collapse toggle */}
                <button
                    onClick={() => setCollapsed(true)}
                    style={{
                        width: 20, height: 20, borderRadius: 4, border: `1px solid ${C.border}`,
                        background: 'none', cursor: 'pointer', color: C.textMute, fontSize: 9,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = C.text; }}
                    onMouseLeave={e => { e.currentTarget.style.color = C.textMute; }}
                >▲</button>
            </div>

            {/* Search box */}
            <div style={{ padding: '0 8px 5px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 10, color: C.textMute, pointerEvents: 'none' }}>⌕</span>
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search sessions…"
                    style={{
                        width: '100%', background: C.bgInput, border: `1px solid ${C.border}`,
                        borderRadius: 5, padding: '4px 8px 4px 22px', color: C.text,
                        fontFamily: "'Inter',sans-serif", fontSize: 10.5, boxSizing: 'border-box',
                    }}
                    onFocus={e => e.target.style.borderColor = `${C.cyan}50`}
                    onBlur={e => e.target.style.borderColor = C.border}
                />
                {search && (
                    <button onClick={() => setSearch('')} style={{
                        position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                        background: 'none', border: 'none', cursor: 'pointer', color: C.textMute, fontSize: 9,
                    }}>✕</button>
                )}
            </div>

            {/* Session list */}
            <div style={{ maxHeight: 280, overflowY: 'auto', padding: '0 6px 8px' }}>

                {loading && (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 0' }}>
                        <div style={{ width: 16, height: 16, borderRadius: '50%', border: `2px solid ${C.cyan}30`, borderTopColor: C.cyan, animation: 'spin 0.8s linear infinite' }} />
                    </div>
                )}

                {!loading && filtered.length === 0 && (
                    <div style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        padding: '16px 0', gap: 6,
                    }}>
                        <span style={{ fontSize: 18, opacity: 0.3 }}>+</span>
                        <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: C.textMute }}>
                            No conversations yet
                        </span>
                    </div>
                )}

                {!loading && Object.entries(groups).map(([label, items]) => {
                    if (!items.length) return null;
                    return (
                        <div key={label}>
                            <div style={{
                                fontFamily: "'JetBrains Mono',monospace", fontSize: 8.5,
                                color: C.textMute, textTransform: 'uppercase', letterSpacing: '.08em',
                                padding: '6px 4px 3px',
                            }}>{label}</div>
                            {items.map(s => (
                                <SessionItem
                                    key={s.id}
                                    session={s}
                                    isActive={s.id === activeSessionId}
                                    onClick={onSelectSession}
                                    onDelete={handleDelete}
                                    C={{ ...C, isDark }}
                                />
                            ))}
                        </div>
                    );
                })}
            </div>

            {/* Spin keyframe */}
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
