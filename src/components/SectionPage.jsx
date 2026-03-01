import { SECTION_INFO } from '../constants.js';
import { useTheme } from '../theme.jsx';
import SageChat from './SageChat.jsx';

function StatCard({ label, val, color }) {
  const { C } = useTheme();
  return (
    <div style={{
      background:C.bgInput, border:`1px solid ${color}22`,
      borderTop:`2px solid ${color}60`, borderRadius:8, padding:'9px 14px',
      flex:'1 1 150px', minWidth:0,
    }}>
      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:8.5, color:C.textMute, textTransform:'uppercase', letterSpacing:'.08em', marginBottom:5 }}>{label}</div>
      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10.5, color, fontWeight:600, lineHeight:1.5 }}>{val}</div>
    </div>
  );
}

export default function SectionPage({ id, label, parentLabel, color, provider, model, apiKeys }) {
  const { C } = useTheme();
  const info    = SECTION_INFO[id];
  const sColor  = color || C.cyan;
  const context = parentLabel ? `${parentLabel} — ${label}` : label;

  return (
    <div style={{ display:'flex', flexDirection:'column', flex:1, minHeight:0 }}>

      {/* Info card */}
      <div style={{
        background:`linear-gradient(135deg, ${sColor}07 0%, transparent 60%)`,
        border:`1px solid ${sColor}22`, borderRadius:10,
        padding:'14px 18px', marginBottom:12, flexShrink:0,
        position:'relative', overflow:'hidden',
      }}>
        <div style={{ position:'absolute', top:-24, right:-24, width:140, height:140, borderRadius:'50%', background:`radial-gradient(circle, ${sColor}08 0%, transparent 70%)`, pointerEvents:'none' }} />
        <div style={{ display:'flex', alignItems:'flex-start', gap:12, position:'relative' }}>
          <div style={{
            width:38, height:38, borderRadius:9, flexShrink:0,
            background:`${sColor}14`, border:`1px solid ${sColor}30`,
            display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, color:sColor,
          }}>◈</div>
          <div style={{ flex:1, minWidth:0 }}>
            {parentLabel && (
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9.5, color:C.textMute, marginBottom:3 }}>
                {parentLabel} <span style={{ margin:'0 3px' }}>▸</span>
              </div>
            )}
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:16, color:C.white, letterSpacing:'-.015em', marginBottom:4 }}>
              {info?.title || label}
            </div>
            {info?.desc && (
              <div style={{ fontFamily:"'Inter',sans-serif", fontSize:12, color:C.textSub, lineHeight:1.65, maxWidth:620 }}>{info.desc}</div>
            )}
          </div>
        </div>
        {info?.tags?.length > 0 && (
          <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginTop:11 }}>
            {info.tags.map(t => (
              <span key={t} style={{ display:'inline-block', fontSize:10, fontFamily:"'JetBrains Mono',monospace", padding:'2px 9px', borderRadius:20, fontWeight:600, letterSpacing:'.03em', background:`${sColor}12`, color:sColor, border:`1px solid ${sColor}28` }}>{t}</span>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      {info?.stats?.length > 0 && (
        <div style={{ display:'flex', gap:8, marginBottom:12, flexShrink:0, flexWrap:'wrap' }}>
          {info.stats.map((s, i) => <StatCard key={i} label={s.label} val={s.val} color={sColor} />)}
        </div>
      )}

      {/* Divider */}
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10, flexShrink:0 }}>
        <div style={{ height:1, flex:1, background:C.border }} />
        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:C.textMute, textTransform:'uppercase', letterSpacing:'.1em' }}>AI ASSISTANT</span>
        <div style={{ height:1, flex:1, background:C.border }} />
      </div>

      <SageChat provider={provider} model={model} apiKeys={apiKeys} context={context} sectionId={id} />
    </div>
  );
}
