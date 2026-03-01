import { useState } from 'react';
import { NAV, C, SECTION_COLOR, DOC_META } from './constants.js';
import { PROVIDERS } from './ai.js';
import Sidebar     from './components/Sidebar.jsx';
import Dashboard   from './components/Dashboard.jsx';
import SageChat    from './components/SageChat.jsx';
import CodeGen     from './components/CodeGen.jsx';
import DocGen      from './components/DocGen.jsx';
import TxFinder    from './components/TxFinder.jsx';
import ProviderBar from './components/ProviderBar.jsx';
import { SectionHead } from './components/Primitives.jsx';

// ─── Flatten nav for lookups ──────────────────────────────────────────────────
const ALL_ITEMS = NAV.flatMap(n => [n, ...(n.children || [])]);
const getItem = (id) => ALL_ITEMS.find(n => n.id === id);
const getParent = (id) => NAV.find(n => n.children?.some(c => c.id === id));

// ─── Initial expand state ─────────────────────────────────────────────────────
const INITIAL_EXPANDED = Object.fromEntries(
  NAV.filter(n => n.children).map(n => [n.id, false])
);

// ─── Sections that show the ProviderBar ───────────────────────────────────────
const SHOW_PROVIDER_BAR = new Set(['chat','codegen','wizard','apiref','cap','ext','spa','wf','btp']);

export default function App() {
  const [active,   setActive]   = useState('home');
  const [expanded, setExpanded] = useState(INITIAL_EXPANDED);
  const [collapsed,setCollapsed]= useState(false);

  // AI Provider state
  const [provider, setProvider] = useState('groq');
  const [model,    setModel]    = useState(PROVIDERS.groq.model);
  const [apiKeys,  setApiKeys]  = useState({});

  const toggleExpand = (id) => setExpanded(p => ({ ...p, [id]: !p[id] }));

  // Auto-expand parent when child selected
  const handleSetActive = (id) => {
    setActive(id);
    const parent = getParent(id);
    if (parent) setExpanded(p => ({ ...p, [parent.id]: true }));
  };

  // ─ Breadcrumb ───────────────────────────────────────────────────────────────
  const breadcrumb = () => {
    const item   = getItem(active);
    const parent = getParent(active);
    if (parent) return (
      <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: C.textSub }}>
        <span style={{ color: C.textMute }}>{parent.label}</span>
        <span style={{ color: C.textMute, margin: '0 6px' }}>▸</span>
        <span style={{ color: item?.color || C.cyan }}>{item?.label}</span>
      </span>
    );
    return <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: C.textSub }}>{item?.label || active}</span>;
  };

  // ─ Context string for AI ────────────────────────────────────────────────────
  const contextFor = (id) => {
    const item   = getItem(id);
    const parent = getParent(id);
    if (parent) return `${parent.label} — ${item?.label}`;
    return item?.label || id;
  };

  // ─ Determine if provider bar should show ────────────────────────────────────
  const showBar = SHOW_PROVIDER_BAR.has(active) || active.startsWith('doc-')
    || (getItem(active) && !['home','txfinder'].includes(active));

  // ─ Render main content ──────────────────────────────────────────────────────
  const renderContent = () => {
    // Core
    if (active === 'home')     return <Dashboard setActive={handleSetActive} />;
    if (active === 'txfinder') return <TxFinder />;
    if (active === 'codegen')  return <CodeGen provider={provider} model={model} apiKeys={apiKeys} />;

    // Doc generator
    if (active.startsWith('doc-')) return (
      <DocGen docType={active} provider={provider} model={model} apiKeys={apiKeys} />
    );

    // Main chat page
    if (active === 'chat') return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <SectionHead title="SAP Sage AI" sub="Full-domain SAP intelligence — ask anything across all landscapes" icon="◈" color={C.amber} />
        <SageChat provider={provider} model={model} apiKeys={apiKeys} context="Full SAP Domain" sectionId="default" />
      </div>
    );

    // BTP catalog
    if (active === 'btp') return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <SectionHead title="BTP Platform" sub="All SAP Business Technology Platform services" icon="⬡" color={C.green} />
        <SageChat provider={provider} model={model} apiKeys={apiKeys} context="SAP BTP Platform — All Services" sectionId="default" />
      </div>
    );

    // Dedicated tool pages
    const toolContexts = {
      cap:    { title: 'CAP Full Stack', sub: 'CDS models, Node.js/Java services, HANA Cloud, Fiori integration', icon: '◉', color: C.blue },
      ext:    { title: 'SAP Extensibility', sub: 'Key User, In-App, Side-by-Side, Classic — all 4 models', icon: '◉', color: C.pink },
      spa:    { title: 'SAP Build Process Automation', sub: 'Workflow forms, RPA bots, decisions, business rules', icon: '◉', color: C.amber },
      wf:     { title: 'SAP Workflow', sub: 'BTP Workflow, SPA, iFlow orchestration, S/4 Flexible Workflow', icon: '◉', color: C.yellow },
      wizard: { title: 'Configuration Wizards', sub: 'Guided step-by-step SAP configuration', icon: '⟡', color: C.cyan },
      apiref: { title: 'SAP API Reference', sub: 'OData, REST, SOAP, Event APIs across all landscapes', icon: '⟡', color: C.amber },
    };

    if (toolContexts[active]) {
      const tc = toolContexts[active];
      return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <SectionHead title={tc.title} sub={tc.sub} icon={tc.icon} color={tc.color} />
          <SageChat provider={provider} model={model} apiKeys={apiKeys} context={tc.title} sectionId={active} />
        </div>
      );
    }

    // All landscape / module / BTP sections → context-aware chat
    const item   = getItem(active);
    const parent = getParent(active);
    const col    = item?.color || parent?.children?.find(c => c.id === active)?.color || C.cyan;
    const ctx    = contextFor(active);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ marginBottom: 14, paddingBottom: 12, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: col, flexShrink: 0 }} />
          <div>
            <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 16, color: C.white }}>{item?.label || active}</div>
            {parent && <div style={{ fontSize: 11, color: C.textSub, fontFamily: 'Sora' }}>{parent.label}</div>}
          </div>
        </div>
        <SageChat provider={provider} model={model} apiKeys={apiKeys} context={ctx} sectionId={active} />
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: C.bg, overflow: 'hidden' }}>
      {/* Sidebar */}
      {!collapsed && (
        <div style={{ width: 234, background: C.bgPanel, borderRight: `1px solid ${C.border}`, flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
          <Sidebar active={active} setActive={handleSetActive} expanded={expanded} toggleExpand={toggleExpand} />
        </div>
      )}

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Topbar */}
        <div style={{
          height: 46, display: 'flex', alignItems: 'center', gap: 10, padding: '0 20px',
          borderBottom: `1px solid ${C.border}`, background: C.bgPanel, flexShrink: 0,
        }}>
          <button onClick={() => setCollapsed(p => !p)} style={{
            background: 'none', border: 'none', cursor: 'pointer', color: C.textMute, fontSize: 14, padding: '2px 4px',
          }}>{collapsed ? '▷' : '◁'}</button>

          {breadcrumb()}

          {/* Quick nav */}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
            {[['chat','◈','AI',C.amber],['codegen','⌨','CODE',C.cyan],['doc-intg','▪','DOCS',C.green],['txfinder','⊞','TX',C.purple]].map(([id,icon,tag,col]) => (
              <button key={id} onClick={() => handleSetActive(id)} style={{
                padding: '3px 10px', borderRadius: 4,
                border: `1px solid ${active === id ? col : C.border}`,
                background: active === id ? `${col}12` : 'none',
                cursor: 'pointer', color: active === id ? col : C.textMute,
                fontSize: 10, fontFamily: 'IBM Plex Mono', transition: 'all .12s',
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                <span>{icon}</span><span style={{ fontSize: 9 }}>{tag}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column' }}>
          {showBar && active !== 'home' && active !== 'txfinder' && (
            <ProviderBar
              provider={provider} setProvider={setProvider}
              model={model} setModel={setModel}
              apiKeys={apiKeys} setApiKeys={setApiKeys}
            />
          )}
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
