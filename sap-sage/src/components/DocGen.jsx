import { useState } from 'react';
import { C, DOC_META, SYSTEM_PROMPT } from '../constants.js';
import { useAI } from '../hooks.js';
import { SectionHead, CopyButton } from './Primitives.jsx';

export default function DocGen({ docType, provider, model, apiKeys }) {
  const meta = DOC_META[docType] || { title: 'Document', color: C.cyan, desc: 'Generate SAP document.' };
  const [input, setInput]   = useState('');
  const [output, setOutput] = useState('');
  const { call, loading }   = useAI(provider, model, apiKeys);

  const generate = async () => {
    if (!input.trim()) return;
    setOutput('');
    const sys = `${SYSTEM_PROMPT}\n\nYou are generating a professional SAP "${meta.title}".\nFormat: Well-structured Markdown with ##/### headings, tables, numbered steps, and code blocks.\nBe exhaustive — every section must have real technical content. Include SAP transaction codes, table names, SPRO paths, and config values where relevant.\nReturn only the Markdown document — no preamble or closing remarks.`;
    try {
      const doc = await call([{ role: 'user', content: input }], sys);
      setOutput(doc);
    } catch (e) {
      setOutput(`Error: ${e.message}`);
    }
  };

  return (
    <div>
      <SectionHead title={meta.title} sub={meta.desc} icon="▪" color={meta.color} />

      <div style={{ fontFamily: 'Sora', fontSize: 12, color: C.textSub, marginBottom: 8 }}>
        Describe what you need — be specific about systems, objects, process scope, and any special requirements.
      </div>

      <textarea value={input} onChange={e => setInput(e.target.value)} rows={6} style={{
        width: '100%', background: C.bgInput, border: `1px solid ${C.border}`, borderRadius: 7,
        padding: 12, color: C.text, fontFamily: 'Sora', fontSize: 12.5, resize: 'vertical', outline: 'none',
        lineHeight: 1.6, marginBottom: 12,
      }} placeholder={`e.g. "Integration between SAP ECC PM Notifications (BUS2080/QMEL) and SAP BTP Event Mesh using ASANWEE add-on. The notification events should be consumed by a CPI iFlow and posted to S/4HANA via OData API_MAINTENANCEORDER_0001. Include full architecture, config phases, error handling strategy, and monitoring approach."`} />

      <button onClick={generate} disabled={loading || !input.trim()} style={{
        padding: '8px 22px', borderRadius: 6, border: 'none',
        background: loading || !input.trim() ? C.bgCard : meta.color,
        color: loading || !input.trim() ? C.textSub : C.bg,
        fontFamily: 'Sora', fontWeight: 700, fontSize: 12,
        cursor: loading || !input.trim() ? 'not-allowed' : 'pointer', marginBottom: 16,
      }}>{loading ? '⋯ Generating document...' : '⌨ Generate Document'}</button>

      {output && (
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', top: 10, right: 12, zIndex: 1 }}>
            <CopyButton text={output} id="doc-output" />
          </div>
          <pre style={{
            background: C.bgInput, border: `1px solid ${C.border}`, borderRadius: 8,
            padding: 18, overflowX: 'auto', fontFamily: 'Sora', fontSize: 12,
            color: C.text, lineHeight: 1.75, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
          }}>{output}</pre>
        </div>
      )}
    </div>
  );
}
