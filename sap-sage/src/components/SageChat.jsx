import { useState, useEffect, useRef } from 'react';
import { C, SYSTEM_PROMPT, QUICK_PROMPTS } from '../constants.js';
import { useAI } from '../hooks.js';
import { CopyButton } from './Primitives.jsx';
import { PROVIDERS } from '../ai.js';

export default function SageChat({ provider, model, apiKeys, context, sectionId }) {
  const qp = QUICK_PROMPTS[sectionId] || QUICK_PROMPTS.default;
  const prov = PROVIDERS[provider];
  const [msgs, setMsgs] = useState([{
    role: 'assistant',
    content: `SAP Sage ready — ${prov?.name || 'AI'}\nContext: ${context || 'Full SAP Domain'}\n\nAsk anything — configuration, code, architecture, troubleshooting, or documentation.`,
  }]);
  const [input, setInput] = useState('');
  const endRef = useRef(null);
  const { call, loading, timing } = useAI(provider, model, apiKeys);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  // Re-init on provider change
  useEffect(() => {
    setMsgs([{ role: 'assistant', content: `SAP Sage ready — ${PROVIDERS[provider]?.name}\nContext: ${context || 'Full SAP Domain'}\n\nAsk anything.` }]);
  }, [provider]);

  const send = async (text) => {
    const userText = text || input.trim();
    if (!userText) return;
    setInput('');
    const history = msgs.filter(m => m.role !== 'system');
    const updated = [...history, { role: 'user', content: userText }];
    setMsgs(updated);

    const sysWithCtx = context
      ? `${SYSTEM_PROMPT}\n\nCURRENT CONTEXT: User is working in "${context}". Focus on this area unless asked otherwise.`
      : SYSTEM_PROMPT;

    try {
      const reply = await call(
        updated.map(m => ({ role: m.role, content: m.content })),
        sysWithCtx
      );
      setMsgs(p => [...p, { role: 'assistant', content: reply }]);
    } catch (e) {
      setMsgs(p => [...p, { role: 'assistant', content: `⚠ ${e.message}\n\nCheck API key in the provider bar above.` }]);
    }
  };

  const pCol = prov?.color || C.cyan;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Quick prompts */}
      {msgs.length <= 2 && qp.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
          {qp.map((q, i) => (
            <button key={i} onClick={() => send(q)} style={{
              background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 5,
              padding: '5px 11px', cursor: 'pointer', fontFamily: 'Sora',
              fontSize: 11, color: C.textSub, transition: 'all .15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = pCol; e.currentTarget.style.color = C.text; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textSub; }}>
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, paddingRight: 4 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, flexDirection: m.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-start' }}>
            <div style={{
              width: 26, height: 26, borderRadius: 5, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: m.role === 'user' ? `${C.cyan}15` : `${pCol}15`,
              border: `1px solid ${m.role === 'user' ? C.cyan : pCol}35`,
              fontSize: 10, fontFamily: 'IBM Plex Mono', fontWeight: 700,
              color: m.role === 'user' ? C.cyan : pCol,
            }}>{m.role === 'user' ? 'U' : 'S'}</div>

            <div style={{
              maxWidth: '82%', padding: '10px 13px', borderRadius: 8, position: 'relative',
              background: m.role === 'user' ? `${C.cyan}0A` : C.bgCard,
              border: `1px solid ${m.role === 'user' ? `${C.cyan}20` : C.border}`,
              fontFamily: 'Sora', fontSize: 12.5, color: C.text, lineHeight: 1.75, whiteSpace: 'pre-wrap',
            }}>
              {m.content}
              {m.role === 'assistant' && (
                <div style={{ position: 'absolute', top: 6, right: 8 }}>
                  <CopyButton text={m.content} id={`msg-${i}`} />
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ width: 26, height: 26, borderRadius: 5, background: `${pCol}15`, border: `1px solid ${pCol}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: pCol, fontFamily: 'IBM Plex Mono' }}>S</div>
            <div style={{ padding: '10px 13px', background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 8, display: 'flex', gap: 5, alignItems: 'center' }}>
              {[0, 1, 2].map(d => (
                <div key={d} style={{ width: 5, height: 5, borderRadius: '50%', background: pCol, opacity: .7, animation: 'bounce 1.2s ease-in-out infinite', animationDelay: `${d * .2}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'flex-end' }}>
        {timing && <div style={{ fontSize: 9, fontFamily: 'IBM Plex Mono', color: C.textMute, marginBottom: 8, flexShrink: 0 }}>{timing}s</div>}
        <textarea value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Ask anything SAP... (Enter to send)"
          rows={2} style={{
            flex: 1, background: C.bgInput, border: `1px solid ${C.border}`,
            borderRadius: 7, padding: '9px 13px', color: C.text,
            fontFamily: 'Sora', fontSize: 12.5, resize: 'none', outline: 'none', lineHeight: 1.5,
          }} />
        <button onClick={() => send()} disabled={loading || !input.trim()} style={{
          width: 38, height: 38, borderRadius: 7, border: 'none', flexShrink: 0,
          background: loading || !input.trim() ? C.bgCard : pCol,
          cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
          color: C.bg, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all .2s',
        }}>▶</button>
      </div>
    </div>
  );
}
