import { useState } from 'react';
import { DOC_META, SYSTEM_PROMPT } from '../constants.js';
import { useTheme } from '../theme.jsx';
import { useAI } from '../hooks.js';
import { CopyButton, Tag } from './Primitives.jsx';

export default function DocGen({ docType, provider, model, apiKeys }) {
  const { C } = useTheme();
  const meta = DOC_META[docType] || { title:'Document', short:'DOC', color:C.cyan, icon:'▫', desc:'' };
  const [input, setInput]   = useState('');
  const [output, setOutput] = useState('');
  const { call, loading }   = useAI(provider, model, apiKeys);

  const generate = async () => {
    if (!input.trim()) return;
    setOutput('');
    const sys = `${SYSTEM_PROMPT}\n\nTASK: Generate a complete, professional SAP "${meta.title}".\nFORMAT RULES:\n- Use Markdown: ## for sections, ### for subsections, tables with | pipes |, code blocks with \`\`\`\n- Every section must have real, SAP-specific technical content\n- Include exact transaction codes, table names, SPRO paths, FMs, API endpoints where relevant\n- No placeholder text like "[Insert here]" — generate actual content based on context\n- Minimum 800 words, comprehensive coverage\nReturn ONLY the Markdown document, no preamble.`;
    try {
      const doc = await call([{ role:'user', content: input }], sys);
      setOutput(doc);
    } catch(e) {
      setOutput(`Error: ${e.message}`);
    }
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      {/* Header */}
      <div style={{
        background:`${meta.color}08`, border:`1px solid ${meta.color}20`,
        borderRadius:10, padding:'16px 20px',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
          <div style={{ fontSize:20, color:meta.color }}>{meta.icon}</div>
          <div>
            <div style={{ fontFamily:"'Space Grotesk', sans-serif", fontWeight:700, fontSize:16, color:C.white }}>{meta.title}</div>
            <div style={{ fontFamily:"'Inter', sans-serif", fontSize:11.5, color:C.textSub, marginTop:2 }}>{meta.desc}</div>
          </div>
          <Tag color={meta.color} size={9}>{meta.short}</Tag>
        </div>
      </div>

      {/* Input */}
      <div>
        <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:9, color:C.textMute, textTransform:'uppercase', letterSpacing:'.12em', marginBottom:8 }}>DESCRIBE YOUR SCENARIO</div>
        <textarea value={input} onChange={e=>setInput(e.target.value)} rows={6} style={{
          width:'100%', background:C.bgInput,
          border:`1px solid ${input ? C.borderMid : C.border}`,
          borderRadius:8, padding:'12px 14px', color:C.text,
          fontFamily:"'Inter', sans-serif", fontSize:13, resize:'vertical', lineHeight:1.65,
          transition:'border-color .15s',
        }} placeholder='e.g. "Integration of SAP ECC PM Notifications (BUS2080/QMEL) to SAP BTP Event Mesh using ASANWEE add-on. Notifications consumed by a CPI iFlow and posted to S/4HANA via API_MAINTENANCEORDER_0001. Include full architecture, CPI configuration, error handling strategy, and monitoring."' />
      </div>

      <button onClick={generate} disabled={loading||!input.trim()} style={{
        padding:'9px 22px', borderRadius:7, border:'none', alignSelf:'flex-start',
        background: loading||!input.trim() ? C.bgCard : meta.color,
        color: loading||!input.trim() ? C.textSub : C.bg,
        fontFamily:"'Space Grotesk', sans-serif", fontWeight:700, fontSize:12.5,
        cursor: loading||!input.trim() ? 'not-allowed' : 'pointer', transition:'all .2s',
        display:'flex', alignItems:'center', gap:7,
      }}>
        {loading ? <><span style={{ animation:'spin 1s linear infinite', display:'inline-block' }}>⟳</span> Generating document…</> : `▫ Generate ${meta.short}`}
      </button>

      {/* Output */}
      {output && (
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 14px', background:C.bgCard, borderRadius:'8px 8px 0 0', border:`1px solid ${C.border}`, borderBottom:'none' }}>
            <Tag color={meta.color}>{meta.short}</Tag>
            <span style={{ fontFamily:"'Inter', sans-serif", fontSize:11, color:C.textSub }}>{meta.title}</span>
            <div style={{ flex:1 }} />
            <CopyButton text={output} id="doc-out" />
          </div>
          <pre style={{
            background:C.bgInput, border:`1px solid ${C.border}`, borderRadius:'0 0 8px 8px',
            padding:20, overflowX:'auto', fontFamily:"'Inter', sans-serif", fontSize:12.5,
            color:C.text, lineHeight:1.8, whiteSpace:'pre-wrap', wordBreak:'break-word', margin:0,
          }}>{output}</pre>
        </div>
      )}
    </div>
  );
}
