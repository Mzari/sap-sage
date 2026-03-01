import { useState } from 'react';
import { SYSTEM_PROMPT } from '../constants.js';
import { useTheme } from '../theme.jsx';
import { useAI } from '../hooks.js';
import { SectionHead, CopyButton } from './Primitives.jsx';
import { PROVIDERS } from '../ai.js';

const LANGS = [
  { id:'abap',       label:'ABAP',         color:'#00C8FF' },
  { id:'abap-cloud', label:'ABAP Cloud',   color:'#00D68F' },
  { id:'cds',        label:'CDS View',     color:'#FF9500' },
  { id:'bdef',       label:'RAP BDEF',     color:'#A855F7' },
  { id:'groovy',     label:'CPI Groovy',   color:'#EC4899' },
  { id:'xslt',       label:'XSLT',         color:'#F59E0B' },
  { id:'cap',        label:'CAP CDS',      color:'#3B82F6' },
  { id:'ui5',        label:'SAPUI5',       color:'#FF4466' },
];

const EXAMPLES = {
  abap:       ['Read QMEL for plant + return as internal table', 'Call BAPI_GOODSMVT_CREATE for goods receipt 101', 'ALV report with F4 help on MATNR + filter by plant', 'BAdI implementation ES_MIGO_BADI for MIGO enhancement'],
  'abap-cloud':['Read POs via released API cl_api_purchaseorder_2', 'Consume OData V4 from ABAP Cloud using http_client', 'Clean core check: replace SE16N with CDS view'],
  cds:        ['CDS joining EKKO+EKPO with list report annotations', 'CDS view for PM notification KPIs with measures', 'Projection view with @OData.publish:true'],
  bdef:       ['Managed RAP BO with draft + submit action', 'Determination: derive plant from equipment', 'Validation: mandatory fields before status Activate'],
  groovy:     ['Parse CloudEvent IDoc XML, extract QMNUM, set property', 'OData POST with CSRF token + error handling retry', 'Split ORDERS05 batch into individual messages'],
  xslt:       ['Map IDoc ORDERS05 to custom JSON structure', 'SuccessFactors EC XML → S/4HANA HR OData format'],
  cap:        ['CAP CDS model + OData service with @restrict authorization', 'Remote S/4HANA service consumption in CAP Node.js', 'MTX multitenancy setup for CAP app on BTP'],
  ui5:        ['SAPUI5 list with OData V4 model + filters + search', 'Custom Fiori tile with navigation to object page', 'OData V4 batch request with error handling'],
};

export default function CodeGen({ provider, model, apiKeys }) {
  const { C } = useTheme();
  const [lang, setLang]      = useState('abap');
  const [prompt, setPrompt]  = useState('');
  const [code, setCode]      = useState('');
  const { call, loading }    = useAI(provider, model, apiKeys);
  const prov   = PROVIDERS[provider];
  const pCol   = prov?.color || C.green;
  const curLang = LANGS.find(l => l.id === lang);

  const generate = async () => {
    if (!prompt.trim()) return;
    setCode('');
    const sys = `${SYSTEM_PROMPT}\n\nGenerate ${lang.toUpperCase()} code. Return ONLY the code — no explanation text before or after the code. Add brief inline comments. Include error/exception handling. For ABAP Cloud, follow clean core rules and use only released APIs.`;
    try {
      const reply = await call([{ role:'user', content:prompt }], sys);
      // Strip markdown wrapper if model wrapped in ```
      const stripped = reply.replace(/^```[\w-]*\n?/, '').replace(/\n?```$/, '');
      setCode(stripped);
    } catch(e) {
      setCode(`* Error: ${e.message}\n* Check your API key in the provider bar.`);
    }
  };

  return (
    <div>
      <SectionHead title="SAP Code Generator" sub="ABAP · ABAP Cloud · CDS · RAP BDEF · CPI Groovy · XSLT · CAP · SAPUI5 — production-ready" icon="⌨" color={C.cyan} />

      {/* Language tabs */}
      <div style={{ display:'flex', gap:6, marginBottom:14, flexWrap:'wrap' }}>
        {LANGS.map(l => (
          <button key={l.id} onClick={() => { setLang(l.id); setCode(''); }} style={{
            padding:'5px 13px', borderRadius:6, cursor:'pointer', transition:'all .15s',
            border:`1px solid ${lang===l.id ? l.color : C.border}`,
            background: lang===l.id ? `${l.color}14` : C.bgCard,
            color: lang===l.id ? l.color : C.textSub,
            fontFamily:"'JetBrains Mono',monospace", fontSize:10.5, fontWeight:600,
          }}>
            {l.label}
          </button>
        ))}
      </div>

      {/* Example chips */}
      {(EXAMPLES[lang]||[]).length > 0 && (
        <div style={{ marginBottom:12 }}>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:C.textMute, textTransform:'uppercase', letterSpacing:'.08em', marginBottom:7 }}>Examples</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
            {EXAMPLES[lang].map((ex, i) => (
              <button key={i} onClick={() => setPrompt(ex)} style={{
                background:C.bgInput, border:`1px solid ${C.border}`, borderRadius:5,
                padding:'5px 11px', cursor:'pointer', fontFamily:"'Inter',sans-serif",
                fontSize:11.5, color:C.textSub, transition:'all .15s', textAlign:'left',
              }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=`${curLang?.color}50`;e.currentTarget.style.color=C.text;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textSub;}}>
                {ex}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Prompt */}
      <textarea value={prompt} onChange={e=>setPrompt(e.target.value)}
        onKeyDown={e=>{ if(e.key==='Enter'&&e.ctrlKey){e.preventDefault();generate();}}}
        rows={4} placeholder={`Describe the ${curLang?.label} code you need in plain English…\n(Ctrl+Enter to generate)`}
        style={{
          width:'100%', background:C.bgInput, border:`1px solid ${C.borderMid}`,
          borderRadius:8, padding:'11px 13px', color:C.text,
          fontFamily:"'Inter',sans-serif", fontSize:12.5, resize:'vertical', lineHeight:1.6,
          marginBottom:11,
        }}
        onFocus={e=>e.target.style.borderColor=`${curLang?.color}50`}
        onBlur={e=>e.target.style.borderColor=C.borderMid}
      />

      <button onClick={generate} disabled={loading || !prompt.trim()} style={{
        padding:'8px 22px', borderRadius:7, border:'none', marginBottom:16, cursor: loading||!prompt.trim()?'not-allowed':'pointer',
        background: loading||!prompt.trim() ? C.bgCard : curLang?.color||C.green,
        color: loading||!prompt.trim() ? C.textSub : '#000',
        fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:12.5, transition:'all .2s',
      }}>{loading ? '⋯ Generating…' : `⌨ Generate ${curLang?.label}`}</button>

      {/* Output */}
      {code && (
        <div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'6px 12px', background:C.bgInput, border:`1px solid ${C.border}`, borderBottom:'none', borderRadius:'8px 8px 0 0' }}>
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9.5, color:C.textMute, textTransform:'uppercase', letterSpacing:'.07em' }}>{curLang?.label}</span>
            <CopyButton text={code} id="code-out" />
          </div>
          <pre style={{
            background:C.bgInput, border:`1px solid ${C.border}`,
            borderRadius:'0 0 8px 8px', padding:'14px 16px', overflowX:'auto',
            fontFamily:"'JetBrains Mono',monospace", fontSize:11.5,
            color:C.text, lineHeight:1.65, whiteSpace:'pre', margin:0,
          }}>{code}</pre>
        </div>
      )}
    </div>
  );
}
