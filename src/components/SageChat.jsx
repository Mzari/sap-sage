import { useState, useEffect, useRef, useCallback } from 'react';
import { SYSTEM_PROMPT, QUICK_PROMPTS } from '../constants.js';
import { useAI } from '../hooks.js';
import { PROVIDERS } from '../ai.js';
import { useTheme } from '../theme.jsx';
import MarkdownRenderer from './MarkdownRenderer.jsx';
import { sendMessage, getMessages } from '../api.js';

// ─── Tool chip mapping ────────────────────────────────────────────────────────
const TOOL_LABELS = {
  sap_help_search: { icon: '🔍', label: 'SAP Help' },
  cpi_logs_fetch: { icon: '📊', label: 'CPI Logs' },
  odata_query: { icon: '🔗', label: 'OData Query' },
  knowledge_lookup: { icon: '🧠', label: 'Knowledge' },
};

function ToolChips({ toolCalls, C }) {
  if (!toolCalls?.length) return null;
  const unique = [...new Set(toolCalls.map(t => t.tool))];
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 5 }}>
      {unique.map(name => {
        const info = TOOL_LABELS[name] || { icon: '⚙', label: name };
        return (
          <span key={name} style={{
            display: 'inline-flex', alignItems: 'center', gap: 3,
            padding: '2px 7px', borderRadius: 20,
            background: `${C.cyan}12`, border: `1px solid ${C.cyan}28`,
            fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: C.cyan,
          }}>
            {info.icon} {info.label}
          </span>
        );
      })}
    </div>
  );
}

function Citations({ items, C }) {
  if (!items?.length) return null;
  return (
    <div style={{ marginTop: 6, paddingTop: 5, borderTop: `1px solid ${C.border}` }}>
      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8.5, color: C.textMute, marginBottom: 3, textTransform: 'uppercase', letterSpacing: '.07em' }}>Sources</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map((c, i) => (
          <a key={i} href={c.url} target="_blank" rel="noopener noreferrer" style={{
            fontFamily: "'Inter',sans-serif", fontSize: 10.5, color: C.cyan,
            textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}
            onMouseEnter={e => e.target.style.textDecoration = 'underline'}
            onMouseLeave={e => e.target.style.textDecoration = 'none'}
          >
            ↗ {c.title || c.url}
          </a>
        ))}
      </div>
    </div>
  );
}

function CopyBtn({ text }) {
  const { C } = useTheme();
  const [ok, setOk] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard?.writeText(text).catch(() => { }); setOk(true); setTimeout(() => setOk(false), 1800); }}
      style={{
        background: 'none', border: `1px solid ${ok ? C.green : C.border}`, cursor: 'pointer',
        padding: '2px 8px', borderRadius: 4, color: ok ? C.green : C.textMute,
        fontSize: 9.5, fontFamily: "'JetBrains Mono',monospace",
      }}>{ok ? '✓ copied' : '⎘ copy'}</button>
  );
}

function TypingDots({ color }) {
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '6px 2px' }}>
      {[0, 1, 2].map(d => (
        <div key={d} style={{
          width: 5, height: 5, borderRadius: '50%', background: color,
          animation: 'typing 1.2s ease-in-out infinite', animationDelay: `${d * .18}s`, opacity: .4
        }} />
      ))}
    </div>
  );
}

const HISTORY_CACHE = {};

function SuggestionsPanel({ prompts, onSelect, provColor, sectionId }) {
  const { C } = useTheme();
  const [filter, setFilter] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => { setFilter(''); }, [sectionId]);

  const filtered = filter
    ? prompts.filter(p => p.toLowerCase().includes(filter.toLowerCase()))
    : prompts;

  if (collapsed) return (
    <div style={{ width: 28, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 4, gap: 4 }}>
      <button onClick={() => setCollapsed(false)} title="Show suggestions" style={{
        width: 24, height: 24, borderRadius: 5, border: `1px solid ${provColor}40`,
        background: `${provColor}10`, cursor: 'pointer', color: provColor, fontSize: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>◀</button>
      <div style={{ fontSize: 8, fontFamily: "'JetBrains Mono',monospace", color: C.textMute, writingMode: 'vertical-lr', marginTop: 4, letterSpacing: '.08em', textTransform: 'uppercase' }}>suggestions</div>
    </div>
  );

  return (
    <div style={{ width: 230, flexShrink: 0, display: 'flex', flexDirection: 'column', borderLeft: `1px solid ${C.border}`, paddingLeft: 10, minHeight: 0 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, flexShrink: 0 }}>
        <div style={{ flex: 1, fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: C.textMute, textTransform: 'uppercase', letterSpacing: '.1em' }}>
          Suggestions
          <span style={{ marginLeft: 5, padding: '1px 5px', borderRadius: 3, background: `${provColor}14`, color: provColor, fontSize: 8, fontWeight: 700 }}>{filtered.length}</span>
        </div>
        <button onClick={() => setCollapsed(true)} style={{
          width: 22, height: 22, borderRadius: 4, border: `1px solid ${C.border}`,
          background: 'none', cursor: 'pointer', color: C.textMute, fontSize: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
          onMouseEnter={e => { e.currentTarget.style.color = C.text; e.currentTarget.style.borderColor = C.borderMid; }}
          onMouseLeave={e => { e.currentTarget.style.color = C.textMute; e.currentTarget.style.borderColor = C.border; }}>▶
        </button>
      </div>

      {/* Filter */}
      <div style={{ position: 'relative', marginBottom: 7, flexShrink: 0 }}>
        <span style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 9, color: C.textMute, pointerEvents: 'none' }}>⌕</span>
        <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Filter…"
          style={{
            width: '100%', background: C.bgInput, border: `1px solid ${C.border}`,
            borderRadius: 5, padding: '5px 8px 5px 22px', color: C.text,
            fontFamily: "'Inter',sans-serif", fontSize: 11,
          }}
          onFocus={e => e.target.style.borderColor = provColor + '50'}
          onBlur={e => e.target.style.borderColor = C.border}
        />
        {filter && (
          <button onClick={() => setFilter('')} style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: C.textMute, fontSize: 10 }}>✕</button>
        )}
      </div>

      {/* Prompt list */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 5 }}>
        {filtered.length === 0 ? (
          <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: C.textMute, textAlign: 'center', paddingTop: 20 }}>No matches</div>
        ) : filtered.map((prompt, i) => (
          <button key={i} onClick={() => onSelect(prompt)} style={{
            background: C.bgInput, border: `1px solid ${C.border}`, borderLeft: `2px solid transparent`,
            borderRadius: 7, padding: '8px 10px', cursor: 'pointer', textAlign: 'left',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = provColor + '50'; e.currentTarget.style.borderLeftColor = provColor; e.currentTarget.style.background = `${provColor}07`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.borderLeftColor = 'transparent'; e.currentTarget.style.background = C.bgInput; }}>
            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: C.text, lineHeight: 1.5 }}>{prompt}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main SageChat ────────────────────────────────────────────────────────────
export default function SageChat({ provider, model, apiKeys, context, sectionId, sessionId: sessionIdProp }) {
  const { C } = useTheme();
  const qp = QUICK_PROMPTS[sectionId] || QUICK_PROMPTS.default || [];
  const prov = PROVIDERS[provider];
  const pCol = prov?.color || C.cyan;
  const cacheKey = sectionId || 'default';

  const [activeSessionId, setActiveSessionId] = useState(sessionIdProp || null);
  const [backendOnline, setBackendOnline] = useState(true);

  const makeWelcome = useCallback(() => ({
    role: 'assistant',
    content: `Ready — **${prov?.name || 'AI'}**\nContext: *${context || 'Full SAP Domain'}*\n\nSelect a suggestion on the right or ask anything — config, code, architecture, troubleshooting.`,
    ts: Date.now(),
  }), [provider, context]);

  const [msgs, setMsgs] = useState(() => HISTORY_CACHE[cacheKey] || [makeWelcome()]);
  const [input, setInput] = useState('');
  const endRef = useRef(null);
  const { call, loading: aiLoading, timing } = useAI(provider, model, apiKeys);
  const [loading, setLoading] = useState(false);

  // ─── Load from backend when sessionIdProp changes ─────────────────────────
  useEffect(() => {
    if (sessionIdProp) {
      setActiveSessionId(sessionIdProp);
      (async () => {
        setLoading(true);
        const data = await getMessages(sessionIdProp);
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map(m => ({
            role: m.role,
            content: m.content,
            tool_calls: m.tool_calls,
            citations: m.citations,
            ts: new Date(m.created_at).getTime(),
          }));
          setMsgs(mapped);
        } else {
          setMsgs([makeWelcome()]);
        }
        setLoading(false);
      })();
    }
  }, [sessionIdProp]);

  // ─── Local cache sync ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!sessionIdProp) {
      const cached = HISTORY_CACHE[cacheKey];
      setMsgs(cached?.length ? cached : [makeWelcome()]);
    }
  }, [cacheKey]);

  useEffect(() => {
    if (!sessionIdProp) HISTORY_CACHE[cacheKey] = msgs;
  }, [msgs, cacheKey, sessionIdProp]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [msgs, loading, aiLoading]);

  // ─── Send ─────────────────────────────────────────────────────────────────
  const send = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading || aiLoading) return;
    setInput('');
    const updated = [...msgs, { role: 'user', content: userText, ts: Date.now() }];
    setMsgs(updated);
    setLoading(true);

    // Try backend first
    const result = await sendMessage({
      sessionId: activeSessionId,
      message: userText,
      provider,
      model,
      apiKey: apiKeys[provider],
      sectionId,
    });

    setLoading(false);

    if (result && result.reply && !result.error) {
      setBackendOnline(true);
      if (result.sessionId && !activeSessionId) setActiveSessionId(result.sessionId);
      setMsgs(p => [...p, {
        role: 'assistant',
        content: result.reply,
        tool_calls: result.toolCallsMade || [],
        citations: result.citations || [],
        ts: Date.now(),
      }]);
      return;
    }

    // Fallback: direct AI call
    setBackendOnline(false);
    const sysCtx = context
      ? `${SYSTEM_PROMPT}\n\nCURRENT CONTEXT: User is in "${context}". Focus on this area unless asked otherwise.`
      : SYSTEM_PROMPT;
    try {
      setLoading(true);
      const reply = await call(
        updated.filter(m => m.role !== 'system').map(m => ({ role: m.role, content: m.content })),
        sysCtx
      );
      setMsgs(p => [...p, { role: 'assistant', content: reply, ts: Date.now() }]);
    } catch (e) {
      setMsgs(p => [...p, { role: 'assistant', content: `**Error:** ${e.message}\n\nCheck your API key in the provider bar above.`, ts: Date.now() }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    const w = makeWelcome();
    HISTORY_CACHE[cacheKey] = [w];
    setMsgs([w]);
    setActiveSessionId(null);
  };

  const isLoading = loading || aiLoading;

  return (
    <div style={{ display: 'flex', flex: 1, minHeight: 0, gap: 10, flexDirection: 'column' }}>

      {/* Offline banner */}
      {!backendOnline && (
        <div style={{
          padding: '5px 12px', borderRadius: 6, background: `${C.amber}12`,
          border: `1px solid ${C.amber}30`, flexShrink: 0,
          display: 'flex', alignItems: 'center', gap: 7,
        }}>
          <span style={{ fontSize: 11 }}>⚠️</span>
          <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: C.amber }}>
            Backend offline — history disabled. Using direct AI call.
          </span>
        </div>
      )}

      <div style={{ display: 'flex', flex: 1, minHeight: 0, gap: 10 }}>

        {/* Chat column */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, minWidth: 0 }}>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, paddingRight: 2, paddingBottom: 4 }}>
            {msgs.map((m, i) => {
              const isUser = m.role === 'user';
              return (
                <div key={i} className="msg-in" style={{ display: 'flex', gap: 9, flexDirection: isUser ? 'row-reverse' : 'row', alignItems: 'flex-start' }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 6, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isUser ? `${C.cyan}14` : `${pCol}14`,
                    border: `1px solid ${isUser ? C.cyan : pCol}28`,
                    fontSize: 9.5, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700,
                    color: isUser ? C.cyan : pCol,
                  }}>{isUser ? 'YOU' : 'SAP'}</div>

                  <div style={{
                    maxWidth: '86%', borderRadius: 9, overflow: 'hidden',
                    background: isUser ? `${C.cyan}0A` : C.bgCard,
                    border: `1px solid ${isUser ? `${C.cyan}20` : C.borderMid}`,
                  }}>
                    <div style={{ padding: '9px 12px 7px' }}>
                      {isUser
                        ? <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 12.5, color: C.text, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{m.content}</div>
                        : <MarkdownRenderer content={m.content} />
                      }
                      {/* Tool chips & citations for assistant messages */}
                      {!isUser && <ToolChips toolCalls={m.tool_calls} C={C} />}
                      {!isUser && <Citations items={m.citations} C={C} />}
                    </div>
                    {!isUser && (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 12px 6px', borderTop: `1px solid ${C.border}` }}>
                        <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono',monospace", color: C.textMute }}>
                          {m.ts ? new Date(m.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </div>
                        <CopyBtn text={m.content} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="msg-in" style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: `${pCol}14`, border: `1px solid ${pCol}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9.5, color: pCol, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, flexShrink: 0 }}>SAP</div>
                <div style={{ padding: '8px 12px', background: C.bgCard, border: `1px solid ${C.borderMid}`, borderRadius: 9 }}>
                  <TypingDots color={pCol} />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div style={{ marginTop: 10, flexShrink: 0 }}>
            {timing && !loading && (
              <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono',monospace", color: C.textMute, marginBottom: 4, textAlign: 'right' }}>
                ⏱ {timing}s · {prov?.name?.split(' ')[0]}
              </div>
            )}
            <div style={{ display: 'flex', gap: 7, alignItems: 'flex-end' }}>
              <textarea value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder="Ask anything SAP… (↵ send  ⇧↵ newline)" rows={2}
                style={{
                  flex: 1, background: C.bgInput, border: `1px solid ${C.borderMid}`,
                  borderRadius: 8, padding: '8px 12px', color: C.text,
                  fontFamily: "'Inter',sans-serif", fontSize: 12.5, resize: 'none', lineHeight: 1.55,
                }}
                onFocus={e => { e.target.style.borderColor = pCol + '60'; e.target.style.boxShadow = `0 0 0 2px ${pCol}08`; }}
                onBlur={e => { e.target.style.borderColor = C.borderMid; e.target.style.boxShadow = 'none'; }}
              />
              <button onClick={clearChat} title="Clear chat" style={{
                width: 34, height: 34, borderRadius: 7, border: `1px solid ${C.border}`,
                background: 'none', cursor: 'pointer', color: C.textMute, fontSize: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.red; e.currentTarget.style.color = C.red; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMute; }}>⊘
              </button>
              <button onClick={() => send()} disabled={isLoading || !input.trim()} style={{
                width: 38, height: 38, borderRadius: 8, border: 'none', flexShrink: 0,
                background: isLoading || !input.trim() ? C.bgCard : pCol,
                cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
                color: isLoading || !input.trim() ? C.textMute : '#000',
                fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>▶</button>
            </div>
          </div>
        </div>

        {/* Suggestions panel */}
        {qp.length > 0 && (
          <SuggestionsPanel prompts={qp} onSelect={send} provColor={pCol} sectionId={sectionId} />
        )}
      </div>
    </div>
  );
}
