import { useState } from 'react';
import { C, SYSTEM_PROMPT } from '../constants.js';
import { useAI } from '../hooks.js';
import { SectionHead, CopyButton } from './Primitives.jsx';
import { PROVIDERS } from '../ai.js';

const LANGS = [
  { id: 'abap',       label: 'ABAP',        color: '#00D4FF' },
  { id: 'abap-cloud', label: 'ABAP Cloud',  color: '#00E8A2' },
  { id: 'cds',        label: 'CDS View',    color: '#FF8B00' },
  { id: 'bdef',       label: 'RAP BDEF',    color: '#9D6FFF' },
  { id: 'groovy',     label: 'CPI Groovy',  color: '#FF6FD8' },
  { id: 'xslt',       label: 'XSLT',        color: '#FFD100' },
  { id: 'cap',        label: 'CAP CDS',     color: '#3B82F6' },
  { id: 'ui5',        label: 'SAPUI5 / JS', color: '#FF3D5A' },
];

const EXAMPLES = {
  abap:       ['Read QMEL for plant + return as structured table', 'Call BAPI_GOODSMVT_CREATE for goods receipt', 'ALV report with F4 help on MATNR field', 'BAdI implementation for MIGO enhancement'],
  'abap-cloud':['Read purchase orders via released API cl_api_purchaseorder_2', 'Call OData V4 API from ABAP Cloud using http_client', 'Clean core extension using key user custom logic'],
  cds:        ['CDS joining EKKO+EKPO with Fiori list report annotations', 'Analytical CDS for PM notification KPIs with measures', 'CDS view with association to BUS2080 business object'],
  bdef:       ['Managed RAP BO for Z table with draft + submit action', 'Determination to derive equipment from functional location', 'Validation: mandatory fields before Activate'],
  groovy:     ['Parse CloudEvent JSON and extract QMNUM into properties', 'Call ECC OData with OAuth token + CSRF handling', 'Split IDoc batch payload into individual messages'],
  xslt:       ['Map SAP IDoc ORDERS05 to custom JSON structure', 'Transform SuccessFactors employee XML to S/4HANA format'],
  cap:        ['CAP CDS model + OData service with @restrict authorization', 'Remote service consumption from S/4HANA OData', 'CAP Node.js custom handler for complex business logic'],
  ui5:        ['SAPUI5 List binding with OData V4 model and filters', 'Custom Fiori tile with navigation to List Report', 'OData V4 batch request with error handling'],
};

export default function CodeGen({ provider, model, apiKeys }) {
  const [lang, setLang]     = useState('abap');
  const [prompt, setPrompt] = useState('');
  const [code, setCode]     = useState('');
  const { call, loading }   = useAI(provider, model, apiKeys);
  const prov = PROVIDERS[provider];
  const pCol = prov?.color || C.green;
  const curLang = LANGS.find(l => l.id === lang);

  const generate = async () => {
    if (!prompt.trim()) return;
    setCode('');
    const sys = `${SYSTEM_PROMPT}\n\nYou are generating ${lang.toUpperCase()} code for SAP. Return ONLY the code — no explanations before or after. Add brief inline comments. Handle exceptions. Follow clean core rules for ABAP Cloud.`;
    try {
      const reply = await call([{ role: 'user', content: prompt }], sys);
      setCode(reply);
    } catch (e) {
      setCode(`// Error: ${e.message}`);
    }
  };

  return (
    <div>
      <SectionHead title="SAP Code Generator" sub="ABAP · CDS · RAP · CPI Groovy · XSLT · CAP · UI5 — production-ready" icon="⌨" color={C.green} />

      {/* Language tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {LANGS.map(l => (
          <button key={l.id} onClick={() => setLang(l.id)} style={{
            padding: '4px 12px', borderRadius: 4,
            border: `1px solid ${lang === l.id ? l.color : C.border}`,
            background: lang === l.id ? `${l.color}14` : C.bgInput,
            color: lang === l.id ? l.color : C.textSub,
            fontSize: 10, cursor: 'pointer', fontFamily: 'IBM Plex Mono', fontWeight: 600, transition: 'all .15s',
          }}>{l.label}</button>
        ))}
      </div>

      {/* Examples */}
      {(EXAMPLES[lang] || []).length > 0 && (
        <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
          {EXAMPLES[lang].map((ex, i) => (
            <button key={i} onClick={() => setPrompt(ex)} style={{
              background: C.bgInput, border: `1px solid ${C.border}`, borderRadius: 4,
              padding: '4px 10px', cursor: 'pointer', fontFamily: 'Sora', fontSize: 11, color: C.textSub, transition: 'border-color .15s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = curLang?.color || C.green}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
              {ex}
            </button>
          ))}
        </div>
      )}

      <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={4} style={{
        width: '100%', background: C.bgInput, border: `1px solid ${C.border}`, borderRadius: 7,
        padding: 11, color: C.text, fontFamily: 'Sora', fontSize: 12.5, resize: 'vertical', outline: 'none', marginBottom: 10,
      }} placeholder={`Describe the ${lang.toUpperCase()} code you need in plain English...`} />

      <button onClick={generate} disabled={loading || !prompt.trim()} style={{
        padding: '7px 20px', borderRadius: 5, border: 'none', marginBottom: 14,
        background: loading || !prompt.trim() ? C.bgCard : curLang?.color || C.green,
        color: loading || !prompt.trim() ? C.textSub : C.bg,
        fontFamily: 'Sora', fontWeight: 700, fontSize: 12,
        cursor: loading || !prompt.trim() ? 'not-allowed' : 'pointer',
      }}>{loading ? '⋯ Generating...' : `⌨ Generate ${lang.toUpperCase()}`}</button>

      {code && (
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', top: 10, right: 12, zIndex: 1 }}>
            <CopyButton text={code} id="code-output" />
          </div>
          <pre style={{
            background: C.bgInput, border: `1px solid ${C.border}`, borderRadius: 8,
            padding: 16, overflowX: 'auto', fontFamily: 'IBM Plex Mono', fontSize: 11.5,
            color: C.text, lineHeight: 1.65, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
          }}>{code}</pre>
        </div>
      )}
    </div>
  );
}
