import { C } from '../constants.js';
import { Tag } from './Primitives.jsx';

const QUICK_CARDS = [
  { id:'chat',    icon:'◈', label:'SAP Sage AI',         sub:'Full-domain SAP intelligence',   color:'#FF8B00', tag:'AI CHAT' },
  { id:'codegen', icon:'⌨', label:'Code Generator',      sub:'ABAP, CDS, RAP, Groovy, UI5',    color:'#00D4FF', tag:'CODE' },
  { id:'txfinder',icon:'⊞', label:'Transaction Finder',  sub:'150+ transactions indexed',      color:'#00E8A2', tag:'TOOLS' },
  { id:'doc-intg',icon:'▪', label:'Integration Design Doc',sub:'Auto-generate IDD documents', color:'#9D6FFF', tag:'DOCS' },
  { id:'is-cpi',  icon:'⬡', label:'Cloud Integration',   sub:'CPI iFlows, Groovy, adapters',   color:'#FF6FD8', tag:'CPI' },
  { id:'rap-bdef',icon:'◉', label:'RAP Development',     sub:'CDS, BDEF, OData V4',            color:'#FFD100', tag:'ABAP' },
];

const LANDSCAPES = [
  { id:'ecc',     label:'SAP ECC 6.0',             desc:'EhP1–EhP8 · All modules' },
  { id:'s4op',    label:'S/4HANA On-Premise',       desc:'1511–2023 · RAP · Fiori' },
  { id:'s4pub',   label:'S/4HANA Public Cloud',     desc:'Released APIs · Clean Core' },
  { id:'s4pc',    label:'S/4HANA Private Cloud',    desc:'Managed · BTP Extension' },
  { id:'sf',      label:'SuccessFactors',           desc:'EC · RCM · LMS · PMgmt' },
  { id:'ariba',   label:'SAP Ariba',               desc:'Procurement · Network API' },
  { id:'others',  label:'Other Landscapes',         desc:'Concur · MDI · IBP · GRC' },
  { id:'intgsuite',label:'Integration Suite',       desc:'CPI · APIM · Event Mesh' },
  { id:'btp',     label:'BTP Platform',            desc:'All 40+ BTP services' },
];

const COVERAGE_TAGS = [
  ['ECC','▣','#00D4FF'],['S/4HANA','▣','#00E8A2'],['BTP','⬡','#FF8B00'],
  ['SuccessFactors','◆','#9D6FFF'],['Ariba','◆','#FF6FD8'],['CPI','⬡','#00D4FF'],
  ['ABAP','◉','#FF8B00'],['RAP','◉','#00E8A2'],['Fiori','◉','#00D4FF'],
  ['CAP','◉','#3B82F6'],['SPA','◉','#FF8B00'],['MDI','◆','#FFD100'],
];

export default function Dashboard({ setActive }) {
  return (
    <div>
      {/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, ${C.bgCard} 0%, #050D20 100%)`,
        border: `1px solid ${C.border}`, borderRadius: 12,
        padding: '28px 32px', marginBottom: 22, position: 'relative', overflow: 'hidden',
      }}>
        {/* Background glows */}
        {[['#00D4FF',300,90,15],['#FF8B00',200,10,85]].map(([col,size,x,y],i) => (
          <div key={i} style={{
            position: 'absolute', width: size, height: size, borderRadius: '50%', pointerEvents: 'none',
            background: `radial-gradient(circle, ${col}08 0%, transparent 70%)`,
            left: `${x}%`, top: `${y}%`, transform: 'translate(-50%,-50%)',
          }}/>
        ))}

        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{
              width: 46, height: 46, borderRadius: 10, fontSize: 22, color: C.cyan,
              background: `${C.cyan}15`, border: `1px solid ${C.cyan}35`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>⬡</div>
            <div>
              <div style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 24, color: C.white, letterSpacing: '-.02em' }}>SAP Sage</div>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, color: C.textMute, textTransform: 'uppercase', letterSpacing: '.1em' }}>Full Spectrum SAP Intelligence Platform</div>
            </div>
          </div>
          <div style={{ fontFamily: 'Sora', fontSize: 13.5, color: C.text, maxWidth: 600, lineHeight: 1.7, marginBottom: 14 }}>
            One unified assistant covering every SAP landscape, all functional modules, full technical stack — AI-powered with multi-backend support (Anthropic, Groq, Ollama, Together AI).
          </div>
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
            {COVERAGE_TAGS.map(([label, icon, color]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20, background: `${color}12`, border: `1px solid ${color}30` }}>
                <span style={{ fontSize: 9, color }}>{icon}</span>
                <span style={{ fontSize: 10, fontFamily: 'IBM Plex Mono', color, fontWeight: 600 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Launch */}
      <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: C.textMute, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '.1em' }}>QUICK LAUNCH</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 22 }}>
        {QUICK_CARDS.map(card => (
          <button key={card.id} onClick={() => setActive(card.id)} style={{
            background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 9,
            padding: '14px 15px', cursor: 'pointer', textAlign: 'left',
            transition: 'all .18s', display: 'flex', gap: 11, alignItems: 'flex-start',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = card.color; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = 'none'; }}>
            <div style={{ fontSize: 18, color: card.color, flexShrink: 0, marginTop: 1 }}>{card.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
                <div style={{ fontFamily: 'Sora', fontWeight: 600, fontSize: 13, color: C.white }}>{card.label}</div>
                <Tag color={card.color}>{card.tag}</Tag>
              </div>
              <div style={{ fontFamily: 'Sora', fontSize: 11.5, color: C.textSub }}>{card.sub}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Landscapes */}
      <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: C.textMute, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '.1em' }}>SAP LANDSCAPES & SERVICES</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {LANDSCAPES.map(l => (
          <button key={l.id} onClick={() => setActive(l.id)} style={{
            background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 7,
            padding: '11px 14px', cursor: 'pointer', textAlign: 'left', transition: 'border-color .15s',
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = C.borderBright}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
            <div style={{ fontFamily: 'Sora', fontWeight: 600, fontSize: 12.5, color: C.text, marginBottom: 2 }}>{l.label}</div>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: C.textSub }}>{l.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
