import { useState, useMemo } from 'react';
import { NAV, SC, DOC_META } from './constants.js';
import { PROVIDERS } from './ai.js';
import { useTheme } from './theme.jsx';
import Sidebar      from './components/Sidebar.jsx';
import Dashboard    from './components/Dashboard.jsx';
import SageChat     from './components/SageChat.jsx';
import SectionPage  from './components/SectionPage.jsx';
import CodeGen      from './components/CodeGen.jsx';
import DocGen       from './components/DocGen.jsx';
import TxFinder     from './components/TxFinder.jsx';
import ProviderBar      from './components/ProviderBar.jsx';
import SystemConnector  from './components/SystemConnector.jsx';

const ALL    = NAV.flatMap(n => [n, ...(n.children||[])]).filter(n => !n.separator);
const findItem   = id => ALL.find(n => n.id === id);
const findParent = id => NAV.find(n => n.children?.some(c => c.id === id));
const INIT_EXP   = Object.fromEntries(NAV.filter(n => n.children).map(n => [n.id, false]));
const NO_BAR     = new Set(['home','txfinder']);

const GENERIC_META = {
  btp:       { title:'SAP BTP Overview',          sub:'Full Business Technology Platform — 40+ services, cloud-native development, integration, data & AI', icon:'⬡', colorKey:'green' },
  cap:       { title:'CAP Full Stack',             sub:'CDS data models · Node.js/Java services · HANA Cloud · Fiori · MTX multitenancy', icon:'◉', colorKey:'blue' },
  ext:       { title:'SAP Extensibility',          sub:'Key User (in-app) · BAdI · Side-by-Side BTP · Classic ECC exits — all tiers explained', icon:'◉', colorKey:'pink' },
  wf:        { title:'SAP Workflow & SPA',         sub:'BTP Workflow · Build Process Automation · S/4HANA Flexible Workflow · iFlow Orchestration', icon:'◉', colorKey:'yellow' },
  wizard:    { title:'Configuration Wizard',       sub:'Guided SAP configuration walkthrough — step-by-step SPRO paths and setup procedures', icon:'⟡', colorKey:'cyan' },
  apiref:    { title:'SAP API Reference',          sub:'OData V2/V4, REST, SOAP, Event APIs across all SAP landscapes and BTP services', icon:'⊙', colorKey:'amber' },
  ecc:       { title:'SAP ECC 6.0',               sub:'Enterprise Central Component — all modules across EhP1–EhP8 with full customizability', icon:'▣', colorKey:'cyan' },
  s4op:      { title:'S/4HANA On-Premise',         sub:'Simplified data model (ACDOCA) · Fiori UX · RAP · CDS Views · Embedded Analytics', icon:'▣', colorKey:'cyan' },
  s4pub:     { title:'S/4HANA Public Cloud',       sub:'Clean core strict mode · Released APIs only · Key User Extensions · Business Events', icon:'▣', colorKey:'green' },
  s4pc:      { title:'S/4HANA Private Cloud',      sub:'SAP-managed Basis · Restricted ABAP · BTP extensions · Cloud Control Center access', icon:'▣', colorKey:'cyan' },
  sf:        { title:'SAP SuccessFactors',         sub:'Employee Central · Recruiting · Learning · Performance · Compensation · API integration', icon:'◆', colorKey:'amber' },
  ariba:     { title:'SAP Ariba',                  sub:'Procurement · Contracts · Supplier Management · Ariba Network · Open API', icon:'◆', colorKey:'amber' },
  others:    { title:'Other SAP Landscapes',       sub:'Concur · MDI · MDG · DMS · IBP · BW/4HANA · GRC — integrations and configurations', icon:'◆', colorKey:'teal' },
  intgsuite: { title:'SAP Integration Suite',      sub:'CPI iFlows · API Management · Event Mesh · Integration Advisor · Open Connectors · TPM', icon:'⬡', colorKey:'green' },
  btpdev:    { title:'SAP BTP Dev / Runtime',      sub:'ABAP Environment · Cloud Foundry · Kyma · BAS — development runtimes and tooling', icon:'⬡', colorKey:'green' },
  btpbuild:  { title:'SAP Build Platform',         sub:'Build Process Automation · Build Apps · Build Work Zone — low-code tools', icon:'⬡', colorKey:'green' },
  btpdata:   { title:'Data & AI on BTP',           sub:'HANA Cloud · SAP Analytics Cloud · AI Core · Datasphere — data platform and ML', icon:'⬡', colorKey:'yellow' },
  abap:      { title:'ABAP Development',           sub:'Classic ABAP · ABAP Cloud (clean core) · HANA push-down · Enhancements · Adobe Forms', icon:'◉', colorKey:'cyan' },
  rap:       { title:'RAP / OData',                sub:'CDS Views · Behavior Definitions · Behavior Implementation · OData V4 · Draft handling', icon:'◉', colorKey:'purple' },
  fiori:     { title:'Fiori / UI5',                sub:'Fiori Elements · SAPUI5 Custom apps · CDS Annotations · Launchpad configuration', icon:'◉', colorKey:'cyan' },
  spa:       { title:'Build Process Automation',   sub:'Workflow forms · RPA bots · Business rules · Decisions · API triggers · Monitoring', icon:'◉', colorKey:'amber' },
};

export default function App() {
  const { C, isDark, toggleTheme } = useTheme();
  const [active,    setActive]    = useState('home');
  const [expanded,  setExpanded]  = useState(INIT_EXP);
  const [collapsed, setCollapsed] = useState(false);
  const [provider,  setProvider]  = useState('groq');
  const [model,     setModel]     = useState(PROVIDERS.groq.model);
  const [apiKeys,        setApiKeys]        = useState({});
  const [showConnector,  setShowConnector]  = useState(false);
  const [activeSessionId, setActiveSessionId] = useState(null);

  const toggleExpand = id => setExpanded(p => ({ ...p, [id]: !p[id] }));

  const handleSelectSession = (id) => { setActiveSessionId(id); setActive('chat'); };
  const handleNewChat = () => { setActiveSessionId(null); };

  const handleSetActive = id => {
    setActive(id);
    const parent = findParent(id);
    if (parent) setExpanded(p => ({ ...p, [parent.id]: true }));
    NAV.forEach(n => {
      if (n.children?.some(c => c.children?.some(cc => cc.id === id)))
        setExpanded(p => ({ ...p, [n.id]: true }));
    });
  };

  const breadcrumb = useMemo(() => {
    const item   = findItem(active);
    const parent = findParent(active);
    const secColor = item?.color || C[SC[item?.section]?.replace('#','')] || C.cyan;
    return (
      <div style={{ display:'flex', alignItems:'center', gap:5 }}>
        {parent && <>
          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:C.textMute }}>{parent.label}</span>
          <span style={{ color:C.textMute, fontSize:9 }}>▸</span>
        </>}
        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:C.cyan }}>
          {item?.label || active}
        </span>
      </div>
    );
  }, [active, C]);

  const renderContent = () => {
    if (active === 'home')    return <Dashboard setActive={handleSetActive} />;
    if (active === 'txfinder') return <TxFinder />;
    if (active === 'codegen') return <CodeGen provider={provider} model={model} apiKeys={apiKeys} />;
    if (active.startsWith('doc-')) return <DocGen docType={active} provider={provider} model={model} apiKeys={apiKeys} />;

    if (active === 'chat') return (
      <div style={{ display:'flex', flexDirection:'column', flex:1, minHeight:0 }}>
        <div style={{ marginBottom:14, flexShrink:0 }}>
          <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:18, color:C.white, letterSpacing:'-.015em' }}>SAP Sage AI</div>
          <div style={{ fontFamily:"'Inter',sans-serif", fontSize:12, color:C.textSub, marginTop:2 }}>Full-domain SAP intelligence — ask anything across all landscapes, modules, and BTP services</div>
        </div>
        <SageChat provider={provider} model={model} apiKeys={apiKeys} context="Full SAP Domain" sectionId="default" sessionId={activeSessionId} onSessionCreated={setActiveSessionId} />
      </div>
    );

    const item   = findItem(active);
    const parent = findParent(active);
    const meta   = GENERIC_META[active];

    if (meta) {
      const color = C[meta.colorKey] || C.cyan;
      return (
        <div style={{ display:'flex', flexDirection:'column', flex:1, minHeight:0 }}>
          <div style={{
            background:`${color}${isDark?'0A':'0D'}`, border:`1px solid ${color}${isDark?'22':'30'}`,
            borderRadius:10, padding:'14px 18px', marginBottom:12, flexShrink:0,
            position:'relative', overflow:'hidden',
          }}>
            <div style={{ position:'absolute', top:-20, right:-20, width:120, height:120, borderRadius:'50%', background:`radial-gradient(circle, ${color}0A 0%, transparent 70%)`, pointerEvents:'none' }} />
            <div style={{ display:'flex', alignItems:'center', gap:12, position:'relative' }}>
              <div style={{ width:38, height:38, borderRadius:9, background:`${color}${isDark?'16':'14'}`, border:`1px solid ${color}30`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, color, flexShrink:0 }}>{meta.icon}</div>
              <div>
                <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:16, color:C.white, letterSpacing:'-.015em' }}>{meta.title}</div>
                <div style={{ fontFamily:"'Inter',sans-serif", fontSize:12, color:C.textSub, marginTop:3, lineHeight:1.5 }}>{meta.sub}</div>
              </div>
            </div>
            {item?.children && (
              <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginTop:12, position:'relative' }}>
                {item.children.map(ch => (
                  <button key={ch.id} onClick={() => handleSetActive(ch.id)} style={{
                    padding:'5px 13px', borderRadius:6, cursor:'pointer',
                    border:`1px solid ${ch.color||color}30`, background:`${ch.color||color}0C`,
                    fontFamily:"'Inter',sans-serif", fontSize:11.5, color:ch.color||color,
                    fontWeight:500, transition:'all .15s',
                  }}
                    onMouseEnter={e=>{e.currentTarget.style.background=`${ch.color||color}1C`;e.currentTarget.style.borderColor=`${ch.color||color}60`;}}
                    onMouseLeave={e=>{e.currentTarget.style.background=`${ch.color||color}0C`;e.currentTarget.style.borderColor=`${ch.color||color}30`;}}>
                    {ch.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10, flexShrink:0 }}>
            <div style={{ height:1, flex:1, background:C.border }} />
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:C.textMute, textTransform:'uppercase', letterSpacing:'.1em' }}>AI ASSISTANT</span>
            <div style={{ height:1, flex:1, background:C.border }} />
          </div>
          <SageChat provider={provider} model={model} apiKeys={apiKeys} context={meta.title} sectionId={active} />
        </div>
      );
    }

    const secColor = item?.color || C.cyan;
    return (
      <SectionPage id={active} label={item?.label||active} parentLabel={parent?.label}
        color={secColor} provider={provider} model={model} apiKeys={apiKeys} />
    );
  };

  const showBar = !NO_BAR.has(active);
  const prov    = PROVIDERS[provider];

  return (
    <div style={{ display:'flex', height:'100vh', background:C.bg, overflow:'hidden', fontFamily:"'Inter',sans-serif" }}>

      {/* Sidebar */}
      <div style={{
        width:collapsed?0:240, background:C.bgPanel, borderRight:`1px solid ${C.border}`,
        flexShrink:0, overflow:'hidden', transition:'width .2s ease', display:'flex', flexDirection:'column',
      }}>
        {!collapsed && <Sidebar active={active} setActive={handleSetActive} expanded={expanded} toggleExpand={toggleExpand} onSelectSession={handleSelectSession} activeSessionId={activeSessionId} onNewChat={handleNewChat} />}
      </div>

      {/* Main */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', minWidth:0 }}>

        {/* Topbar */}
        <div style={{ height:48, display:'flex', alignItems:'center', gap:9, padding:'0 16px', borderBottom:`1px solid ${C.border}`, background:C.bgPanel, flexShrink:0 }}>

          {/* Sidebar toggle */}
          <button onClick={() => setCollapsed(p => !p)} style={{
            width:28, height:28, borderRadius:5, border:`1px solid ${C.border}`,
            background:'none', cursor:'pointer', color:C.textSub, fontSize:10,
            display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
          }}
            onMouseEnter={e=>{e.currentTarget.style.background=C.bgCard;e.currentTarget.style.color=C.text;}}
            onMouseLeave={e=>{e.currentTarget.style.background='none';e.currentTarget.style.color=C.textSub;}}>
            {collapsed?'▷':'◁'}
          </button>

          {breadcrumb}

          <div style={{ marginLeft:'auto', display:'flex', gap:5, alignItems:'center' }}>
            {[['chat','◈','AI',C.amber],['codegen','⌨','CODE',C.cyan],['doc-intg','▫','DOCS',C.purple],['txfinder','⊞','TX',C.teal]].map(([id,icon,tag,col]) => (
              <button key={id} onClick={() => handleSetActive(id)} style={{
                height:26, padding:'0 9px', borderRadius:4,
                border:`1px solid ${active===id?col:C.border}`,
                background:active===id?`${col}14`:'none',
                cursor:'pointer', color:active===id?col:C.textSub,
                fontFamily:"'JetBrains Mono',monospace", fontSize:9.5,
                display:'flex', alignItems:'center', gap:4,
              }}
                onMouseEnter={e=>{if(active!==id){e.currentTarget.style.borderColor=col+'50';e.currentTarget.style.color=col;}}}
                onMouseLeave={e=>{if(active!==id){e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textSub;}}}>
                <span>{icon}</span><span style={{fontSize:8}}>{tag}</span>
              </button>
            ))}

            {/* Provider chip */}
            <div style={{ height:26, padding:'0 9px', borderRadius:4, border:`1px solid ${prov?.color}28`, background:`${prov?.color}0A`, display:'flex', alignItems:'center', gap:5, marginLeft:3 }}>
              <div style={{ width:5, height:5, borderRadius:'50%', background:apiKeys[provider]||provider==='ollama'?C.green:C.amber, animation:apiKeys[provider]||provider==='ollama'?'none':'pulse-dot 2s infinite' }} />
              <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:prov?.color }}>{prov?.name?.split(' ')[0]}</span>
            </div>

            {/* ── SAP Connect button ── */}
            <button onClick={() => setShowConnector(true)} title="Connect SAP Systems" style={{
              height:26, padding:'0 10px', borderRadius:4, marginLeft:2,
              border:`1px solid ${C.green}30`,
              background:`${C.green}0A`,
              cursor:'pointer', color:C.green,
              fontFamily:"'JetBrains Mono',monospace", fontSize:9,
              display:'flex', alignItems:'center', gap:5, flexShrink:0,
            }}
              onMouseEnter={e=>{e.currentTarget.style.background=`${C.green}18`;e.currentTarget.style.borderColor=`${C.green}60`;}}
              onMouseLeave={e=>{e.currentTarget.style.background=`${C.green}0A`;e.currentTarget.style.borderColor=`${C.green}30`;}}>
              <span>⊙</span><span style={{fontSize:8}}>SAP</span>
            </button>

            {/* ── Theme toggle ── */}
            <button onClick={toggleTheme} title={isDark ? 'Switch to Light' : 'Switch to Dark'} style={{
              width:28, height:28, borderRadius:5, marginLeft:2,
              border:`1px solid ${isDark ? C.borderMid : C.borderBright}`,
              background: isDark ? C.bgCard : C.bgActive,
              cursor:'pointer', color:C.text, fontSize:14,
              display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
            }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=C.cyan;e.currentTarget.style.color=C.cyan;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=isDark?C.borderMid:C.borderBright;e.currentTarget.style.color=C.text;}}>
              {isDark ? '☀' : '🌙'}
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex:1, overflowY:'auto', padding:'18px 22px', display:'flex', flexDirection:'column', background:C.bg }}>
          {showBar && <ProviderBar provider={provider} setProvider={setProvider} model={model} setModel={setModel} apiKeys={apiKeys} setApiKeys={setApiKeys} />}
          {renderContent()}
        </div>
      </div>
      {/* SAP System Connector Modal */}
      {showConnector && <SystemConnector onClose={() => setShowConnector(false)} />}
    </div>
  );
}
