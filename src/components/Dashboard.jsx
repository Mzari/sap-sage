import { useTheme } from '../theme.jsx';

const QUICK_CARDS = [
  { id:'chat',    icon:'◈', label:'SAP Sage AI',           sub:'Full-domain SAP intelligence',   color:'#FF9500', tag:'AI' },
  { id:'codegen', icon:'⌨', label:'Code Generator',        sub:'ABAP · CDS · RAP · Groovy · UI5', color:'#00C8FF', tag:'CODE' },
  { id:'txfinder',icon:'⊞', label:'Transaction Finder',    sub:'150+ transactions indexed',       color:'#00D68F', tag:'TOOLS' },
  { id:'doc-intg',icon:'▫', label:'Integration Design Doc',sub:'Auto-generate full IDD',          color:'#A855F7', tag:'DOCS' },
  { id:'is-cpi',  icon:'⬡', label:'Cloud Integration',     sub:'CPI · Groovy · Adapters · Auth',  color:'#14B8A6', tag:'CPI' },
  { id:'rap-bdef',icon:'◉', label:'RAP / OData V4',        sub:'CDS · BDEF · Behavior Impl',     color:'#F59E0B', tag:'ABAP' },
];

const LANDSCAPES = [
  { id:'ecc',      label:'SAP ECC 6.0',             tag:'EhP1–8 · All Modules',          color:'#00C8FF' },
  { id:'s4op',     label:'S/4HANA On-Premise',       tag:'1511–2023 · RAP · Fiori',       color:'#00C8FF' },
  { id:'s4pub',    label:'S/4HANA Public Cloud',     tag:'Released APIs · Clean Core',    color:'#00D68F' },
  { id:'s4pc',     label:'S/4HANA Private Cloud',    tag:'Managed · BTP Extension',       color:'#00D68F' },
  { id:'sf',       label:'SuccessFactors',           tag:'EC · RCM · LMS · PM',           color:'#FF9500' },
  { id:'ariba',    label:'SAP Ariba',               tag:'Procurement · Network API',      color:'#FF9500' },
  { id:'intgsuite',label:'Integration Suite',        tag:'CPI · APIM · Event Mesh',       color:'#A855F7' },
  { id:'btpdata',  label:'Data & AI',               tag:'HANA · SAC · AI Core',          color:'#F59E0B' },
  { id:'others',   label:'Other Landscapes',         tag:'Concur · MDI · IBP · GRC',      color:'#14B8A6' },
];

const COVERAGE = ['ECC','S/4HANA','BTP','SuccessFactors','Ariba','CPI','ABAP','RAP','Fiori','CAP','SPA','MDI'];

export default function Dashboard({ setActive }) {
  const { C, isDark } = useTheme();
  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div style={{
        position:'relative', overflow:'hidden',
        background:`linear-gradient(135deg, ${C.bgCard} 0%, ${C.bgInput} 100%)`,
        border:`1px solid ${C.borderMid}`, borderRadius:12,
        padding:'26px 28px', marginBottom:20,
      }}>
        {/* Glows */}
        <div style={{ position:'absolute', top:-60, left:-40, width:260, height:260, borderRadius:'50%', background:'radial-gradient(circle, rgba(0,200,255,.06) 0%, transparent 70%)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', bottom:-40, right:60, width:180, height:180, borderRadius:'50%', background:'radial-gradient(circle, rgba(255,149,0,.05) 0%, transparent 70%)', pointerEvents:'none' }}/>

        <div style={{ position:'relative' }}>
          <div style={{ display:'flex', alignItems:'center', gap:13, marginBottom:14 }}>
            <div style={{ width:48, height:48, borderRadius:12, background:`linear-gradient(135deg, ${C.cyan}22 0%, ${C.cyan}08 100%)`, border:`1px solid ${C.cyan}35`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, color:C.cyan, flexShrink:0 }}>⬡</div>
            <div>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:800, fontSize:26, color:C.white, letterSpacing:'-.03em', lineHeight:1.1 }}>SAP Sage</div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:C.textMute, textTransform:'uppercase', letterSpacing:'.1em', marginTop:3 }}>Full Spectrum SAP Intelligence Platform</div>
            </div>
          </div>

          <div style={{ fontFamily:"'Inter',sans-serif", fontSize:13.5, color:C.text, maxWidth:580, lineHeight:1.7, marginBottom:16 }}>
            One unified AI assistant for every SAP landscape, all functional modules, and full technical stack — with multi-backend AI support.
          </div>

          <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
            {COVERAGE.map(t => (
              <div key={t} style={{ padding:'3px 11px', borderRadius:20, background:'rgba(0,200,255,.06)', border:'1px solid rgba(0,200,255,.15)', fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:C.cyan, fontWeight:600 }}>{t}</div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Quick Launch ─────────────────────────────────────────────────── */}
      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:C.textMute, textTransform:'uppercase', letterSpacing:'.12em', marginBottom:10 }}>QUICK LAUNCH</div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:9, marginBottom:20 }}>
        {QUICK_CARDS.map(card => (
          <button key={card.id} onClick={() => setActive(card.id)} className="hover-lift" style={{
            background:C.bgCard, border:`1px solid ${C.borderMid}`, borderRadius:10,
            padding:'14px 15px', cursor:'pointer', textAlign:'left', transition:'all .18s',
            display:'flex', gap:11, alignItems:'flex-start',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor=card.color+'60'; e.currentTarget.style.background=`${card.color}07`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor=C.borderMid; e.currentTarget.style.background=C.bgCard; }}>
            <div style={{ fontSize:18, color:card.color, flexShrink:0, marginTop:1 }}>{card.icon}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:4 }}>
                <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:13.5, color:C.white }}>{card.label}</div>
                <span style={{ fontSize:8, fontFamily:"'JetBrains Mono',monospace", padding:'1px 6px', borderRadius:3, background:`${card.color}18`, color:card.color, border:`1px solid ${card.color}28`, fontWeight:700, flexShrink:0 }}>{card.tag}</span>
              </div>
              <div style={{ fontFamily:"'Inter',sans-serif", fontSize:11.5, color:C.textSub, lineHeight:1.4 }}>{card.sub}</div>
            </div>
          </button>
        ))}
      </div>

      {/* ── Landscapes ────────────────────────────────────────────────────── */}
      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:C.textMute, textTransform:'uppercase', letterSpacing:'.12em', marginBottom:10 }}>SAP LANDSCAPES &amp; PLATFORMS</div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:7 }}>
        {LANDSCAPES.map(l => (
          <button key={l.id} onClick={() => setActive(l.id)} style={{
            background:C.bgCard, border:`1px solid ${C.border}`, borderRadius:8,
            padding:'11px 14px', cursor:'pointer', textAlign:'left', transition:'all .15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor=`${l.color}40`; e.currentTarget.style.background=`${l.color}05`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.background=C.bgCard; }}>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:600, fontSize:12.5, color:C.text, marginBottom:3 }}>{l.label}</div>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9.5, color:C.textMute }}>{l.tag}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
