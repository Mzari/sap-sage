// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
export const C = {
  bg:          '#020912',
  bgPanel:     '#050E1C',
  bgCard:      '#081422',
  bgCardHover: '#0C1A2C',
  bgInput:     '#040C18',
  bgActive:    '#0A1830',
  border:      '#0D1E35',
  borderMid:   '#142840',
  borderBright:'#1E3D60',
  borderHover: '#264A75',

  cyan:    '#00C8FF',
  cyanDim: '#003D55',
  cyanGlow:'rgba(0,200,255,0.08)',

  amber:    '#FF9500',
  amberDim: '#3D2200',

  green:    '#00D68F',
  greenDim: '#003D28',

  red:    '#FF4466',
  redDim: '#3D0015',

  purple: '#A855F7',
  purpleDim: '#2A1060',

  blue:    '#3B82F6',
  blueDim: '#0D2060',

  yellow:  '#F59E0B',
  yellowDim:'#3D2800',

  pink:    '#EC4899',
  pinkDim: '#3D0025',

  teal:    '#14B8A6',
  tealDim: '#003D38',

  text:       '#B8CCE0',
  textSub:    '#3D5A78',
  textMute:   '#1A2E46',
  textBright: '#DCE8F8',
  white:      '#EEF5FF',
};

// ─── SECTION COLORS ────────────────────────────────────────────────────────────
export const SC = {
  core:      C.amber,
  landscape: C.cyan,
  btp:       C.green,
  tech:      C.purple,
  docs:      C.blue,
  tools:     C.teal,
};


// ─── SECTION INFO (info card shown at top of each section page) ───────────────
export const SECTION_INFO = {

  // ── ECC ─────────────────────────────────────────────────────────────────────
  'ecc': {
    title:'SAP ECC 6.0', color:'#00C8FF',
    desc:'Enterprise Central Component — on-premise ERP backbone. All EhP1–EhP8. Classic modifiable architecture. Full ALE/IDoc, BAPIs, user exits, BAdIs.',
    stats:[{label:'Enhancement Packages',val:'EhP1–EhP8'},{label:'Extension Model',val:'BAdI, User Exit, Customer Exit'},{label:'Integration',val:'ALE/IDoc, BAPI, RFC, SOAP, REST'}],
    tags:['FI','CO','MM','SD','PM','PP','QM','PS','HCM','ALE','IDoc','BAdI','RFC'],
  },
  'ecc-fi': {
    title:'FI / CO — Financial Accounting & Controlling', color:'#00D68F',
    desc:'General Ledger, AP, AR, Asset Accounting, New G/L, Document Splitting, Bank Accounting. CO: Cost Centers, Profit Centers, Internal Orders, CO-PA, Product Costing.',
    stats:[{label:'Key Tables',val:'BKPF, BSEG, SKA1, LFA1, KNA1, ANLA'},{label:'Key Transactions',val:'FB01, FB50, F110, F-53, KE30, KSB1'},{label:'Key BAPI',val:'BAPI_ACC_DOCUMENT_POST'}],
    tags:['G/L','AP','AR','Asset Accounting','New G/L','Doc Splitting','CO-PA','Cost Centers','Profit Centers','F110'],
  },
  'ecc-mm': {
    title:'MM / WM — Materials Management & Warehouse', color:'#FF9500',
    desc:'Procurement (PR→PO→GR→LIV), Inventory Management, Valuation, Batch Management, Warehouse Management (WM), Material Master.',
    stats:[{label:'Key Tables',val:'EKKO, EKPO, MSEG, MARA, MARD, MKPF'},{label:'Key Transactions',val:'ME21N, MIGO, MMBE, MIRO, MB51'},{label:'Movement Types',val:'101 GR, 201 GI CostCtr, 261 GI ProdOrd, 601 GI SalesOrd'}],
    tags:['Purchasing','PR/PO','GR/GI','LIV','Inventory','WM','Batch','Valuation','Account Determination'],
  },
  'ecc-sd': {
    title:'SD — Sales & Distribution', color:'#00C8FF',
    desc:'Sales Orders, Deliveries, Billing, Pricing, Credit Management, Revenue Recognition, Customer Master, Route Determination.',
    stats:[{label:'Key Tables',val:'VBAK, VBAP, LIKP, VBRK, VBRP, KONV'},{label:'Key Transactions',val:'VA01, VL01N, VF01, VK11, XD01, VKM3'},{label:'Output Types',val:'RVORDER01, RVDELNOTE, RVINVOICE01'}],
    tags:['Sales Orders','Delivery','Billing','Pricing','Credit Mgmt','Copy Control','Partner Determination','Revenue Recog.'],
  },
  'ecc-pm': {
    title:'PM / EAM — Plant Maintenance', color:'#A855F7',
    desc:'Equipment master, Functional Locations, PM Notifications (QMEL), Work Orders (AUFK), Preventive Maintenance plans, Calibration, Measurement Points/Docs.',
    stats:[{label:'Key Tables',val:'QMEL, AUFK, EQUI, IFLOT, MPOS, QMUR'},{label:'Key Transactions',val:'IW21, IW31, IL01, IE01, IP01, IP10'},{label:'BUS Object',val:'BUS2080 (PM Notification)'}],
    tags:['Notifications','Work Orders','Equipment','FuncLoc','Preventive','Calibration','MeasPoints','ASANWEE','BUS2080'],
  },
  'ecc-qm': {
    title:'QM — Quality Management', color:'#FF4466',
    desc:'Inspection Lots, Inspection Plans, Usage Decision, Quality Notifications, Control Charts, Defect Recording, Certificate Profiles, Audit Management.',
    stats:[{label:'Key Tables',val:'QMEL, QMUR, QPAM, PRÜFLOS (VIQMEL)'},{label:'Key Transactions',val:'QM01, QE01, QA01, QS21, QP01'},{label:'Integration',val:'MM (GR inspection), PP (in-process), SD (customer returns)'}],
    tags:['Inspection Lots','Usage Decision','QM Notifications','Control Charts','Defect Recording','Certificates','Audit'],
  },
  'ecc-pp': {
    title:'PP / MRP — Production Planning', color:'#F59E0B',
    desc:'MRP (MD01/MD04), Production Orders, Routings, BOM, Capacity Planning, KANBAN, SFC (Shop Floor Control), Goods Issue/Receipt for orders.',
    stats:[{label:'Key Tables',val:'AUFK, AFKO, AFPO, MAST, MAPL, CRHD'},{label:'Key Transactions',val:'MD01, MD04, CO01, CA01, CS01, COOIS'},{label:'MRP Types',val:'MRP (MRP), Consumption-Based (VB), MPS (M0)'}],
    tags:['MRP','Production Orders','BOM','Routing','Capacity','KANBAN','SFC','Goods Movements','MD04'],
  },
  'ecc-hcm': {
    title:'HCM / HR — Human Capital Management', color:'#EC4899',
    desc:'Personnel Administration (PA), Organizational Management (OM), Time Management, Payroll, Recruitment, ESS/MSS, Learning.',
    stats:[{label:'Key Tables',val:'PA0000-PA9999 (Infotypes), T527X (Org Units), T528T'},{label:'Key Transactions',val:'PA30, PA40, PO10, PP01, PT60, PC00'},{label:'Integration',val:'FI (Payroll posting), SuccessFactors (Hybrid)'}],
    tags:['PA Infotypes','Org Management','Time Mgmt','Payroll','ESS/MSS','Recruitment','Concurrent Employment'],
  },
  'ecc-ps': {
    title:'PS — Project System', color:'#3B82F6',
    desc:'WBS Elements, Networks, Activities, Milestones, Resource Planning, Project Billing Plans, Cost Planning, Revenue Recognition.',
    stats:[{label:'Key Tables',val:'PRPS (WBS), AUFK (Orders), RPSCO (Cost)'},{label:'Key Transactions',val:'CJ01, CJ20N, CJ40, CJ88, CN01, CJI3'},{label:'Integration',val:'FI (Settlement), MM (Procurement), SD (Billing)'}],
    tags:['WBS','Networks','Milestones','Cost Planning','Revenue Recog.','Settlement','Project Builder','CJ20N'],
  },
  'ecc-ale': {
    title:'ALE / IDoc — Application Link Enabling', color:'#14B8A6',
    desc:'Distributed systems integration using IDocs. Change Pointers (BD50/BD52), Distribution Models (BD64), outbound/inbound processing, event linkages (SWE2), ASANWEE event enablement add-on.',
    stats:[{label:'Monitor Transactions',val:'WE05, BD87, WE09, WE19'},{label:'Config Transactions',val:'WE81, WE31, BD64, BD52, SWE2'},{label:'ASANWEE FM',val:'/ASADEV/ACI_EVENTS_SYNCH'}],
    tags:['IDocs','Change Pointers','BD64','SWE2','BD52','ASANWEE','BUS Objects','Event Linkages','RBDMIDOC'],
  },
  'ecc-basis': {
    title:'Basis / Security', color:'#607D8B',
    desc:'System administration, transport management, user/role management, RFC connections, SSL certificates, performance monitoring, system logs.',
    stats:[{label:'Key Transactions',val:'SM59, STRUST, PFCG, SU01, SM21, RZ10'},{label:'Transport',val:'STMS, SE09, SE10'},{label:'Performance',val:'SM50, SM37, ST05, SAT'}],
    tags:['RFC (SM59)','SSL (STRUST)','Roles (PFCG)','Users (SU01)','Transports','System Log','Profiles','Job Monitoring'],
  },

  // ── S/4HANA On-Premise ──────────────────────────────────────────────────────
  's4op': {
    title:'S/4HANA On-Premise', color:'#00C8FF',
    desc:'Simplified data model (Universal Journal ACDOCA), Fiori UX mandatory, CDS Views, RAP framework, embedded analytics, MRP Live, Central Finance option.',
    stats:[{label:'Releases',val:'1511 → 2023'},{label:'Universal Journal',val:'ACDOCA replaces BKPF/BSEG/COEP'},{label:'Extension Model',val:'RAP, BAdI, Key User Ext., Fiori'}],
    tags:['ACDOCA','Fiori','CDS','RAP','MRP Live','Embedded Analytics','Universal Journal','New GL','Merge'],
  },
  's4op-fi': {
    title:'FI / CO — S/4HANA Finance', color:'#00D68F',
    desc:'Universal Journal (ACDOCA). Real-time margin analysis, Central Finance, Group Reporting. No more reconciliation between FI and CO. Document splitting standard.',
    stats:[{label:'Key Table',val:'ACDOCA (Universal Journal — replaces BKPF/BSEG/COEP/FAGLFLEXA)'},{label:'Key API',val:'API_ORACCT_DOCUMENT_SRV (OData V4)'},{label:'New in S/4',val:'No separate CO-PA table, ACDOCA used for all'}],
    tags:['ACDOCA','Universal Journal','Central Finance','Group Reporting','Real-Time Margin','No Reconciliation','IFRS 16'],
  },
  's4op-mm': {
    title:'MM / EWM — S/4HANA Materials & Warehouse', color:'#FF9500',
    desc:'Simplified procurement, Material Ledger mandatory, Extended Warehouse Management (EWM) embedded in S/4, no classic WM for new implementations.',
    stats:[{label:'Material Ledger',val:'Mandatory in S/4HANA — actual costing enabled'},{label:'EWM',val:'Embedded EWM replaces classic WM (LE-WM)'},{label:'Key API',val:'API_PURCHASEORDER_PROCESS_SRV'}],
    tags:['EWM','Material Ledger','Actual Costing','Simplified Procurement','Stock Transport Order','Batch Classification'],
  },
  's4op-sd': {
    title:'SD / TM — S/4HANA Sales & Transportation', color:'#00C8FF',
    desc:'ACDOCA integration for revenue posting. Advanced ATP, Transportation Management embedded, Rebate Management simplified (BRF+).',
    stats:[{label:'Revenue',val:'VBRK/VBRP + ACDOCA (no COPA table split)'},{label:'Adv. ATP',val:'Product Availability Check using MATP'},{label:'Key API',val:'API_SALES_ORDER_SRV (OData V2/V4)'}],
    tags:['Advanced ATP','TM Embedded','Rebates BRF+','Credit Mgmt (FSCM)','S/4 Billing','Revenue Accounting','ACDOCA'],
  },
  's4op-pm': {
    title:'PM / EAM — S/4HANA Plant Maintenance', color:'#A855F7',
    desc:'Asset Intelligence Network integration, Equipment 360, Work Clearance Management, Predictive Maintenance via ML, BTP integration for IoT.',
    stats:[{label:'Key Tables',val:'Same: QMEL, AUFK, EQUI, IFLOT'},{label:'New Features',val:'WCM, AIN integration, Predictive Scenarios'},{label:'Event API',val:'BusinessEvents: MaintenanceNotification.Created'}],
    tags:['AIN','Equipment 360','WCM','Predictive Maintenance','BTP IoT','Business Events','EAM Analytics'],
  },
  's4op-pp': {
    title:'PP / MRP Live — S/4HANA Production', color:'#F59E0B',
    desc:'MRP Live (in-memory, real-time), Demand-Driven MRP (DDMRP), Extended MRP for large datasets, S/4HANA Cloud for Manufacturing.',
    stats:[{label:'MRP Live',val:'Parallel MRP on HANA — no batch, real-time'},{label:'DDMRP',val:'Demand-Driven Replenishment — buffer-based planning'},{label:'Key API',val:'API_PRODUCTION_ORDER_SRV'}],
    tags:['MRP Live','DDMRP','Parallel MRP','Predictive MRP','MRP Segments','S/4 BOM','Production Scheduling'],
  },
  's4op-rap': {
    title:'RAP / OData — RESTful Application Programming', color:'#00D68F',
    desc:'Modern S/4HANA development paradigm. CDS Views + Behavior Definition + OData V4 exposure. Replaces classical Dynpro development.',
    stats:[{label:'OData',val:'V4 (Managed), V2 (legacy adapters)'},{label:'Draft Support',val:'Managed + Unmanaged BO'},{label:'Key Annotation',val:'@OData.publish: true / @UI.facets'}],
    tags:['CDS Views','BDEF','Behavior Impl','Draft','Actions','Determinations','Validations','Feature Control','OData V4'],
  },
  's4op-fiori': {
    title:'Fiori / UI5 — S/4HANA UI', color:'#00C8FF',
    desc:'Fiori Launchpad, Fiori Elements (ListReport, ObjectPage), SAPUI5 Custom Apps, CDS Annotations-driven UI, Business Catalog / Role assignment.',
    stats:[{label:'App Types',val:'Fiori Elements, Freestyle UI5, Web Dynpro (legacy)'},{label:'Launchpad',val:'Business Roles → Business Catalogs → App Tiles'},{label:'Config',val:'SPRO → SAP Fiori → Launchpad → Configure'}],
    tags:['Launchpad','Fiori Elements','ListReport','ObjectPage','Business Roles','Business Catalogs','SAP BAS','Adapt UI'],
  },
  's4op-ext': {
    title:'S/4HANA On-Prem Extensibility', color:'#EC4899',
    desc:'4-tier extensibility model: Key User (in-app), BAdI (in-app ABAP), Side-by-Side (BTP), Classic modifications (restricted, affects upgrades).',
    stats:[{label:'Tier 1',val:'Key User Extensibility — no ABAP, business user'},{label:'Tier 2',val:'BAdI / Enhancement Spots — ABAP developer'},{label:'Tier 3-4',val:'Side-by-side BTP / Classic modification'}],
    tags:['Key User Ext.','BAdI','Enhancement Spots','Modification','Side-by-Side','Upgrade Safety','Clean Core Levels'],
  },

  // ── S/4HANA Public Cloud ──────────────────────────────────────────────────
  's4pub': {
    title:'S/4HANA Public Cloud', color:'#00C8FF',
    desc:'SaaS ERP. Clean core strictly enforced — no modifications, no classic ABAP. Extend via Key User Extensions (in-app) or Side-by-Side (BTP + Released APIs + Business Events).',
    stats:[{label:'Extension Rule',val:'Released APIs only — C1 classified interfaces'},{label:'In-App',val:'Adapt UI, Custom Fields/Logic/Apps, Key User Workflows'},{label:'Side-by-Side',val:'CAP/BTP + Released APIs + Business Events + CPI'}],
    tags:['Clean Core','No Modifications','Key User Ext.','Adapt UI','Business Events','Released APIs','Side-by-Side','BTP'],
  },
  's4pub-kue': {
    title:'Key User Extensions (KUE)', color:'#00D68F',
    desc:'Business user-level in-app customization. Custom Fields, Custom Logic (ABAP-like scripting), Custom Apps (App Builder), Adapt UI, Custom Analytical Queries.',
    stats:[{label:'Custom Fields',val:'Add fields to standard objects without ABAP dev'},{label:'Custom Logic',val:'BRF+-based expressions + key user scripting'},{label:'Custom Apps',val:'App Builder — drag & drop Fiori apps'}],
    tags:['Custom Fields','Custom Logic','App Builder','Adapt UI','Custom Workflows','KPIs','Custom Analytical Query'],
  },
  's4pub-side': {
    title:'Side-by-Side Extensions', color:'#FF9500',
    desc:'Build standalone apps on BTP (CAP, BTP ABAP) that consume Released APIs and subscribe to Business Events from S/4HANA Cloud. No direct DB access.',
    stats:[{label:'Pattern',val:'CAP App on BTP CF/Kyma → S/4 Released API + Events'},{label:'Auth',val:'OAuth 2.0 with XSUAA / SAP Identity Authentication'},{label:'Event Trigger',val:'Business Events via SAP Event Mesh / Advanced Event Mesh'}],
    tags:['CAP','BTP','Released APIs','Business Events','Event Mesh','XSUAA','OAuth 2.0','Principal Propagation'],
  },
  's4pub-api': {
    title:'S/4HANA Cloud Released APIs', color:'#00C8FF',
    desc:'C1-classified OData V2/V4 APIs officially released for external consumption. SAP API Business Hub for discovery. Versioned, stable interfaces.',
    stats:[{label:'API Hub',val:'api.sap.com → S/4HANA Cloud APIs'},{label:'Auth',val:'OAuth 2.0 Client Credentials (technical user)'},{label:'Pagination',val:'$skiptoken / $top / $skip / nextLink'}],
    tags:['API_PURCHASEORDER','API_SALES_ORDER','API_BUSINESS_PARTNER','API_MATERIAL_STOCK','OData V4','$skiptoken','SAP API Hub'],
  },
  's4pub-evts': {
    title:'S/4HANA Business Events', color:'#A855F7',
    desc:'Pre-delivered CloudEvents from S/4HANA Cloud to SAP Event Mesh / Advanced Event Mesh. Subscribe in CPI or BTP apps to react to business changes.',
    stats:[{label:'Format',val:'CloudEvents 1.0 JSON'},{label:'Channel',val:'SAP Event Mesh / Advanced Event Mesh'},{label:'Examples',val:'SalesOrder.Created, BusinessPartner.Changed, PurchaseOrder.Released'}],
    tags:['CloudEvents 1.0','Event Mesh','AMQP','SalesOrder.Created','BusinessPartner.Changed','Webhook','CPI AMQP Adapter'],
  },

  // ── S/4HANA Private Cloud ────────────────────────────────────────────────
  's4pc': {
    title:'S/4HANA Private Cloud', color:'#00C8FF',
    desc:'Dedicated managed cloud — SAP manages Basis, hardware, and upgrades. Customer manages functional config and custom ABAP (within clean core principles).',
    stats:[{label:'Deployment',val:'Dedicated tenant, SAP manages Basis layer'},{label:'ABAP Access',val:'Restricted — follow clean core Tier 1/2'},{label:'Upgrade',val:'SAP-managed quarterly/annual, customer must align'}],
    tags:['Managed Cloud','Restricted ABAP','Clean Core','BTP Integration','Quarterly Upgrade','SAP Enterprise Support'],
  },
  's4pc-ext': {
    title:'Private Cloud Extensibility Rules', color:'#FF9500',
    desc:'Cleaner than On-Prem but more flexible than Public Cloud. BAdI allowed, restricted modifications, no core table changes. Side-by-side BTP recommended for complex scenarios.',
    stats:[{label:'Allowed',val:'Key User Ext., BAdI, Enhancement Spots, Custom Z-Tables'},{label:'Restricted',val:'Core table modifications, standard program changes'},{label:'Recommended',val:'Side-by-side BTP for complex custom apps'}],
    tags:['BAdI Allowed','Key User Ext.','Z-Tables','No Core Mods','ATC Mandatory','Side-by-Side BTP','Upgrade Safety'],
  },
  's4pc-ops': {
    title:'Operations & Basis (Private Cloud)', color:'#607D8B',
    desc:'SAP manages OS, DB, Basis tasks. Customer accesses via Cloud Control Center. System Copy, client management, transport, monitoring via SAP for Me.',
    stats:[{label:'Access',val:'Cloud Control Center (CCC) — restricted Basis access'},{label:'Monitoring',val:'SAP for Me, Cloud Availability Center'},{label:'Transports',val:'gCTS (Git-based CTS) or classic STMS'}],
    tags:['Cloud Control Center','gCTS','SAP for Me','Monitoring','Alerts','Restricted Basis','System Copy'],
  },
  's4pc-intg': {
    title:'BTP Integration (Private Cloud)', color:'#3B82F6',
    desc:'Connect Private Cloud S/4HANA to BTP using Cloud Connector + Destination Service. CPI for integration, Event Mesh for events, CAP for extensions.',
    stats:[{label:'Connectivity',val:'Cloud Connector → BTP Destination Service → CPI/CAP'},{label:'Auth',val:'Principal Propagation or technical OAuth'},{label:'Scenarios',val:'CPI iFlows, CAP side-by-side, Event-driven with Event Mesh'}],
    tags:['Cloud Connector','Destination Service','Principal Propagation','CPI','CAP','Event Mesh','OAuth 2.0','XSUAA'],
  },

  // ── SuccessFactors ───────────────────────────────────────────────────────
  'sf': {
    title:'SAP SuccessFactors', color:'#FF9500',
    desc:'Cloud HCM suite. Employee Central, Recruiting, Learning, Performance & Goals, Compensation, Workforce Analytics. Integrates with S/4HANA via CPI.',
    stats:[{label:'API Types',val:'OData V2, OData V4, SFAPI (SOAP), Compound Employee'},{label:'Auth',val:'OAuth 2.0 SAML Bearer Assertion'},{label:'CPI Packages',val:'SAP Integration Suite Add-On packages'}],
    tags:['Employee Central','RCM','LMS','PMgmt','Compensation','WFA','MDF','Picklist','SFAPI','OData V2/V4'],
  },
  'sf-ec': {
    title:'Employee Central (EC)', color:'#FF9500',
    desc:'Core HCM system of record. Employment Details, Job Info, Personal Info, Compensation Info, Org Structure, Position Management, Time Off, MDF objects.',
    stats:[{label:'Key OData Entities',val:'PerPersonal, EmpEmployment, EmpJob, PerEmail, EmpPosition'},{label:'MDF',val:'Metadata Framework — custom objects in EC'},{label:'Integration',val:'Replicate to S/4HANA via MDI or CPI/IDoc'}],
    tags:['Employment Info','Job Info','Personal Data','Position Mgmt','MDF','Time Off','Org Chart','Foundation Objects'],
  },
  'sf-rcm': {
    title:'Recruiting (RCM)', color:'#00D68F',
    desc:'End-to-end recruiting: Job Requisitions, Job Postings (internal/external), Candidate Pipeline, Interview Scheduling, Offer Management, Onboarding hand-off.',
    stats:[{label:'Key Objects',val:'JobRequisition, Candidate, Application, JobOffer'},{label:'Integration',val:'RCM → Onboarding → EC (new hire)'},{label:'API',val:'OData V2 — JobRequisition, Candidate entities'}],
    tags:['Job Requisition','Candidate','Application','Offer Mgmt','Job Posting','Operator Roles','Onboarding Hand-off'],
  },
  'sf-lms': {
    title:'Learning (LMS)', color:'#A855F7',
    desc:'Learning Management System. Course Catalog, Curriculum, Assignments, Completions, External Content (SCORM/AICC), Compliance Training, Skills.',
    stats:[{label:'Content Types',val:'SCORM, AICC, Online, ILT, Blended'},{label:'API',val:'LMS OData API, Learning Completion API'},{label:'Integration',val:'EC Skills → LMS, CPI for completion replication'}],
    tags:['Course Catalog','Curriculum','SCORM','Compliance Training','Learning Assignments','Completions','Skills','ILT'],
  },
  'sf-pm': {
    title:'Performance & Goals', color:'#00C8FF',
    desc:'Goal setting (SMART goals), Performance Review forms, Calibration Sessions, 360 feedback, Continuous Performance Management (CPM), Achievement tracking.',
    stats:[{label:'Key Forms',val:'Goal Plan Form, Performance Review Form, 360 Multi-Rater'},{label:'CPM',val:'Continuous feedback, coaching conversations, achievements'},{label:'API',val:'OData V2: PerformanceReview, GoalPlan entities'}],
    tags:['Goal Setting','Performance Review','360 Feedback','Calibration','CPM','Continuous Feedback','Achievements'],
  },
  'sf-comp': {
    title:'Compensation', color:'#F59E0B',
    desc:'Compensation Planning worksheets, Merit/Bonus cycles, Pay Grade Structures, Salary Range, Budgeting, Executive Review, Statement generation.',
    stats:[{label:'Compensation Types',val:'Merit Increase, Bonus, Long-Term Incentive (LTI)'},{label:'Budget',val:'Guidelines-based + discretionary + proration rules'},{label:'Integration',val:'Pay scales → EC → Payroll (S/4 or 3rd party)'}],
    tags:['Merit Planning','Bonus','LTI','Pay Grade','Salary Range','Budget','Compensation Statement','Proration'],
  },
  'sf-api': {
    title:'SuccessFactors API & Integration', color:'#3B82F6',
    desc:'OData V2 (legacy), OData V4 (modern), SFAPI (SOAP compound employee), BizX REST. SAP Integration Suite CPI packages for ECC/S/4 integration.',
    stats:[{label:'OData V2 Base',val:'https://{dc}.successfactors.com/odata/v2'},{label:'OData V4 Base',val:'https://{dc}.successfactors.com/odata/v4'},{label:'Auth',val:'OAuth 2.0 SAML Bearer, Basic Auth, OAuth 2.0 API-Key'}],
    tags:['OData V2','OData V4','SFAPI','Compound Employee','OAuth 2.0','Delta Query','CPI iFlow Package','Employee Import'],
  },

  // ── Ariba ─────────────────────────────────────────────────────────────────
  'ariba': {
    title:'SAP Ariba', color:'#FF9500',
    desc:'Cloud procurement platform: Guided Buying, Purchasing Contracts, Sourcing, Supplier Management, Invoice Management, Ariba Network.',
    stats:[{label:'API Base',val:'https://openapi.ariba.com'},{label:'Auth',val:'OAuth 2.0 — Application + User Tokens'},{label:'Integration',val:'CPI packages + Ariba Network cXML'}],
    tags:['Procurement','Contracts','Sourcing','Supplier Mgmt','Invoice','Ariba Network','cXML','Open API','CIG'],
  },
  'ariba-proc': {
    title:'Ariba Procurement', color:'#FF9500',
    desc:'Purchase Requisitions, Purchase Orders, Receipt Confirmations, Invoices, Guided Buying, Catalog Management. Integration to S/4HANA via CPI.',
    stats:[{label:'Key API',val:'Purchasing Open API — /api/procure/v2/purorders'},{label:'cXML',val:'PurchaseOrderRequest, ConfirmationRequest, InvoiceDetailRequest'},{label:'Integration',val:'Ariba → S/4 PO via CPI or Ariba Cloud Integration (ACI)'}],
    tags:['Purchase Orders','Requisitions','GR/Invoice','Guided Buying','Catalog','cXML','ACI','3-Way Match'],
  },
  'ariba-cntrt': {
    title:'Ariba Contracts', color:'#00D68F',
    desc:'Contract Workspace, Contract Compliance, Global Contracts, Clause Library. Supplier performance, contract milestones, and spend compliance.',
    stats:[{label:'Contract Types',val:'Master Agreement, Purchasing Contract, Sales Contract'},{label:'API',val:'Contract Management Open API v1'},{label:'Integration',val:'Contracts → S/4HANA Outline Agreements via CPI'}],
    tags:['Contract Workspace','Clause Library','Compliance','Milestone Tracking','Outline Agreement','SAP CLM','Spend Analysis'],
  },
  'ariba-sup': {
    title:'Ariba Supplier Management', color:'#A855F7',
    desc:'Supplier Lifecycle, Qualification, Risk (SLP), Supplier Information & Performance Management (SIM). 360-degree supplier view.',
    stats:[{label:'SLP',val:'Lifecycle & Performance — supplier profiles + ratings'},{label:'SIM',val:'Supplier scorecard + risk assessment + qualification'},{label:'Integration',val:'Supplier master → S/4HANA Business Partner via CPI'}],
    tags:['SLP','SIM','Supplier Qualification','Risk Assessment','Scorecard','Business Partner','Onboarding','Certificates'],
  },
  'ariba-api': {
    title:'Ariba Open API', color:'#3B82F6',
    desc:'REST APIs for Ariba procurement data. OAuth 2.0 application + user tokens. Buying/Invoicing API, Analytical Reporting API, Document Automation API.',
    stats:[{label:'API Hub',val:'developer.ariba.com/api'},{label:'Auth',val:'OAuth 2.0 — POST to /api/oauth/token'},{label:'Key API Groups',val:'Procurement, Contracts, Analytics, Supplier, Document'}],
    tags:['OAuth 2.0','REST','Purchase Orders API','Supplier API','Analytics API','Document Automation','Ariba Developer'],
  },

  // ── Others ────────────────────────────────────────────────────────────────
  'oth-concur': {
    title:'SAP Concur', color:'#00C8FF',
    desc:'Travel & Expense management. Travel booking, expense reports, invoice processing, intelligence. Integrate with S/4HANA FI via CPI.',
    stats:[{label:'Key APIs',val:'Expense v4, Travel v4, Invoice v3 (REST)'},{label:'Auth',val:'OAuth 2.0 (Company Token + User Token)'},{label:'Integration',val:'CPI: Concur Expense → S/4HANA FI posting'}],
    tags:['Expense Reports','Travel Booking','Invoice','Receipts','CPI Integration','OAuth 2.0','FI Posting','Company Card'],
  },
  'oth-mdi': {
    title:'Master Data Integration (MDI)', color:'#FF9500',
    desc:'Central hub for master data replication across SAP cloud solutions. Powered by SAP One Domain Model (ODM). Business Partner, Customer, Supplier, Cost Center.',
    stats:[{label:'Protocol',val:'CloudEvents 1.0 via Event Mesh'},{label:'ODM Entities',val:'BusinessPartner, Customer, Supplier, CostCenter, Plant'},{label:'Flow',val:'S/4HANA → MDI → SuccessFactors/Ariba/Field Svc'}],
    tags:['ODM','Business Partner','CloudEvents','Replication','Delta','SAP Graph','One Domain Model','Central Master'],
  },
  'oth-mdg': {
    title:'Master Data Governance (MDG)', color:'#00D68F',
    desc:'On-premise/cloud master data governance. Workflow-based data stewardship, consolidation, mass processing. Governs BP, Customer, Supplier, Material, GL Account.',
    stats:[{label:'Key Objects',val:'Business Partner, Material, GL Account, Cost Center'},{label:'Transactions',val:'MDG1, MDGIMG, MDGME01'},{label:'Integration',val:'MDG → ECC/S4 via ALE/IDoc or Direct APIs'}],
    tags:['Data Stewardship','Workflows','Consolidation','Change Requests','Business Partner','Material','GL Account','Mass Processing'],
  },
  'oth-dms': {
    title:'Document Management System (DMS)', color:'#A855F7',
    desc:'Document storage linked to SAP objects. Document Info Records (DIR), Document Types, Classification, Version Management, CAD integration.',
    stats:[{label:'Key Objects',val:'Document Info Record (DIR) — table DRAW'},{label:'Transactions',val:'CV01N, CV02N, CV04N, CV03N'},{label:'Integration',val:'Linked to MM (Material), PM (Equipment), PP (BOM)'}],
    tags:['Document Info Records','DIR','Classification','Version Mgmt','Content Server','CAD Link','GOS','Archive Link'],
  },
  'oth-ibp': {
    title:'SAP IBP — Integrated Business Planning', color:'#F59E0B',
    desc:'Cloud supply chain planning: Demand Sensing, Demand Planning, Supply Planning, S&OP, Inventory Optimization. Excel add-in UI, HANA-based analytics.',
    stats:[{label:'Modules',val:'S&OP, Demand, Response & Supply, Inventory, Demand Sensing'},{label:'Integration',val:'IBP Add-on for SAP ECC/S4 via CIF/CPI'},{label:'UI',val:'Excel add-in + Web UI + SAP Analytics Cloud'}],
    tags:['S&OP','Demand Planning','Supply Planning','Inventory Optimization','CIF Integration','Excel Add-in','Consensus Plan'],
  },
  'oth-bw': {
    title:'BW/4HANA', color:'#3B82F6',
    desc:'SAP next-gen data warehouse. HANA-optimized, open data integration, simplified modeling (CompositeProviders), native SAP Analytics Cloud integration.',
    stats:[{label:'Modeling',val:'aDSO, CompositeProvider, DataFlow, Calculation View reuse'},{label:'Source Systems',val:'S/4HANA (BW Extractors, SLT, ODP), Delta-capable'},{label:'Reporting',val:'SAC, SAP Analysis for Office, BEx Analyzer'}],
    tags:['aDSO','CompositeProvider','DataFlow','ODP Extractors','BEx','SAC','SLT Replication','Delta Extraction','HANA Views'],
  },
  'oth-grc': {
    title:'GRC — Governance Risk & Compliance', color:'#FF4466',
    desc:'GRC Access Control (SoD analysis, firefighter, role management), Process Control (automated monitoring), Risk Management, Audit Management.',
    stats:[{label:'Modules',val:'AC (Access Control), PC (Process Control), RM, GT (Global Trade)'},{label:'Key Tables',val:'GRACACTION, GRACFUNCATTR, GRACROLEMAP'},{label:'Integration',val:'GRC → ECC/S4 via RFC connectors (SPRO config)'}],
    tags:['SoD Analysis','Firefighter','Role Certification','Process Control','Risk Assessment','MSMP Workflow','Emergency Access'],
  },

  // ── BTP ───────────────────────────────────────────────────────────────────
  'btp': {
    title:'SAP Business Technology Platform', color:'#00D68F',
    desc:'Unified platform for integration, extension, data, and AI. 100+ services across runtimes (CF, Kyma, ABAP), identity, connectivity, and operations.',
    stats:[{label:'Services',val:'100+ BTP services across 8 categories'},{label:'Runtimes',val:'Cloud Foundry, Kyma (K8s), ABAP Environment'},{label:'Integration',val:'Integration Suite (CPI + APIM + Event Mesh + more)'}],
    tags:['Integration Suite','ABAP Env','Build','HANA Cloud','AI Core','Kyma','IAS','Cloud Connector','Destination Service'],
  },
  'intgsuite': {
    title:'Integration Suite', color:'#00D68F',
    desc:'SAP iPaaS — Cloud Integration (CPI), API Management, Event Mesh, Integration Advisor, Open Connectors, Trading Partner Management.',
    stats:[{label:'Adapters',val:'OData, SOAP, REST, SFTP, AMQP, IDoc, RFC, JDBC, AS2…'},{label:'Monitoring',val:'Message Processing Logs (MPL) + Integration Monitoring'},{label:'Auth',val:'OAuth 2.0, SAML, mTLS, Basic, JWT, Client Cert'}],
    tags:['CPI','APIM','Event Mesh','IA','Open Connectors','TPM','Groovy','XSLT','Mapping','Migration Toolkit'],
  },
  'is-cpi': {
    title:'Cloud Integration (CPI)', color:'#00C8FF',
    desc:'iFlow-based integration — design, deploy, monitor message flows. Apache Camel under the hood. Groovy/XSLT scripting, 50+ adapters, robust error handling.',
    stats:[{label:'Runtime',val:'Apache Camel (OSGi) on Cloud Foundry'},{label:'Scripting',val:'Groovy 2.4, JavaScript'},{label:'Error Handling',val:'Exception Subprocess, Dead Letter Queue (AMQP), Retry'}],
    tags:['iFlows','Groovy','XSLT','Content Modifier','Router','Splitter','OData Adapter','IDoc Adapter','AMQP','MPL'],
  },
  'is-apim': {
    title:'API Management (APIM)', color:'#FF9500',
    desc:'Expose and secure APIs. API Proxies, Policies (rate limit, OAuth, spike arrest), Developer Portal, API Products, Monetization, Analytics.',
    stats:[{label:'Proxy Types',val:'REST, SOAP, OData V2/V4, GraphQL'},{label:'Key Policies',val:'Quota, SpikeArrest, OAuthV2, VerifyAPIKey, ResponseCache'},{label:'Developer Portal',val:'Self-service API discovery and subscription'}],
    tags:['API Proxy','Policies','Quota','SpikeArrest','OAuthV2','Developer Portal','API Products','Analytics','Monetization'],
  },
  'is-em': {
    title:'Event Mesh', color:'#A855F7',
    desc:'Async messaging fabric for event-driven architectures. Publish/subscribe, queues, topic subscriptions, CloudEvents 1.0, AMQP 1.0.',
    stats:[{label:'Protocol',val:'AMQP 1.0 (queues), REST (publish/subscribe)'},{label:'Event Format',val:'CloudEvents 1.0 JSON envelope'},{label:'CPI Adapter',val:'AMQP Adapter → Event Mesh queue/topic subscription'}],
    tags:['CloudEvents 1.0','AMQP 1.0','Queues','Topic Subscriptions','Webhooks','Service Key','REST API','CPI AMQP Adapter'],
  },
  'is-ia': {
    title:'Integration Advisor (IA)', color:'#00D68F',
    desc:'ML-assisted mapping and MIG/MAG generation. Define Message Implementation Guidelines (MIG) and generate Mapping Artifacts (MAG) for B2B/A2A.',
    stats:[{label:'MIG',val:'Message Implementation Guideline — annotated message format'},{label:'MAG',val:'Mapping Artifact — XSLT/Graphical mapping generated'},{label:'Standards',val:'EDIFACT, ANSI X12, IDoc, Custom'}],
    tags:['MIG','MAG','B2B Mapping','EDIFACT','ANSI X12','ML-Mapping Proposals','XSLT Generation','IDoc','AS2 Partner'],
  },
  'is-oc': {
    title:'Open Connectors', color:'#F59E0B',
    desc:'100+ pre-built connectors to non-SAP cloud apps. Normalize diverse APIs into a uniform REST interface. Salesforce, ServiceNow, HubSpot, Box, Slack, etc.',
    stats:[{label:'Connector Count',val:'170+ pre-built connectors'},{label:'Unified API',val:'Normalize REST APIs into common SAP IS format'},{label:'Auth',val:'OAuth 2.0, API Key, Basic, Custom'}],
    tags:['Salesforce','ServiceNow','HubSpot','Box','Slack','Normalized API','Virtual Data Resources','Bulk Operations','Webhooks'],
  },
  'is-tpm': {
    title:'Trading Partner Management (TPM)', color:'#3B82F6',
    desc:'Manage B2B trading partner profiles, agreements, and interchanges. EDI processing (EDIFACT, ANSI X12, TRADACOMS) with AS2/SFTP transport.',
    stats:[{label:'EDI Standards',val:'EDIFACT, ANSI X12, TRADACOMS, HL7'},{label:'Transport',val:'AS2, SFTP, HTTP, FTP'},{label:'Integration',val:'TPM Agreements → CPI iFlow execution'}],
    tags:['B2B','EDI','EDIFACT','ANSI X12','AS2','Trading Partner Profiles','Agreements','Interchanges','Functional Acks'],
  },

  // ── BTP Dev / Runtime ─────────────────────────────────────────────────────
  'btpdev': {
    title:'BTP Dev & Runtime', color:'#00D68F',
    desc:'Development tools and execution runtimes on BTP. ABAP Environment (RAP), Cloud Foundry (Node.js/Java), Kyma (Kubernetes/Functions), Business App Studio.',
    stats:[{label:'Runtimes',val:'Cloud Foundry, Kyma (K8s), ABAP Environment'},{label:'Dev Tool',val:'SAP Business App Studio (BAS) — VS Code in cloud'},{label:'CI/CD',val:'BTP Pipeline + SAP CALM + GitHub Actions'}],
    tags:['ABAP Environment','Cloud Foundry','Kyma','BAS','CAP','RAP','Multitenancy','CI/CD','XSUAA'],
  },
  'dev-abap': {
    title:'BTP ABAP Environment', color:'#00C8FF',
    desc:'ABAP Cloud runtime on BTP. Develop RAP Business Objects, REST APIs, and ABAP-based extensions. ADT (Eclipse) for development. ATC mandatory.',
    stats:[{label:'Dev Tool',val:'ADT (ABAP Development Tools) — Eclipse plugin'},{label:'Language',val:'ABAP Cloud — Released APIs (C1) only'},{label:'Deployment',val:'BTP Subaccount → ABAP Environment service instance'}],
    tags:['RAP','ADT','ATC','ABAP Cloud','Released APIs','CDS Views','Business Services','OData V4','Eclipse'],
  },
  'dev-cf': {
    title:'Cloud Foundry Runtime', color:'#FF9500',
    desc:'PaaS runtime for Node.js, Java, Python, and other buildpack-based apps. CAP apps, microservices, API backends. Uses XSUAA for auth.',
    stats:[{label:'Buildpacks',val:'Node.js, Java (Tomcat/Liberty), Python, Ruby, Go'},{label:'Services',val:'Bound via service instances (HANA Cloud, XSUAA, Destination, etc.)'},{label:'Manifest',val:'manifest.yml → cf push to deploy'}],
    tags:['Node.js','Java','CAP','XSUAA','Service Binding','manifest.yml','Blue-Green Deploy','cf push','Spaces/Orgs'],
  },
  'dev-kyma': {
    title:'Kyma Runtime (Kubernetes)', color:'#A855F7',
    desc:'Managed Kubernetes on BTP. Serverless Functions, Microservices, Service Mesh (Istio), Event processing, API Rules for OAuth-protected exposure.',
    stats:[{label:'Compute',val:'Functions (serverless) + Deployments (full K8s pods)'},{label:'Eventing',val:'Kyma Eventing → NATS or Hybrid SAP Event Mesh'},{label:'API Rule',val:'Exposes services via OAuth2Introspection or JWT'}],
    tags:['K8s','Functions','Serverless','Service Mesh','Istio','API Rule','Eventing','NATS','Helm Charts','Docker'],
  },
  'dev-bas': {
    title:'SAP Business App Studio (BAS)', color:'#00D68F',
    desc:'Cloud IDE based on VS Code. Dev spaces for CAP, Fiori, ABAP, Mobile. Integrated generators, deploy tools, SAP Fiori tools extension pack.',
    stats:[{label:'Dev Spaces',val:'CAP (Full Stack Cloud App), Fiori, ABAP, Mobile, SAP HANA'},{label:'Fiori Tools',val:'Fiori Generator, Page Map, Guided Dev, Annotation Modeler'},{label:'Deploy',val:'Direct deploy to CF, Kyma, ABAP (ADT via BAS)'}],
    tags:['VS Code Cloud IDE','CAP Generator','Fiori Generator','Page Map','Annotation Modeler','Deploy to CF','Yeoman','npm/maven'],
  },

  // ── SAP Build ──────────────────────────────────────────────────────────────
  'btpbuild': {
    title:'SAP Build', color:'#00D68F',
    desc:'Low-code/no-code platform. Build Process Automation (workflows + RPA), Build Apps (drag-drop web/mobile apps), Work Zone (digital workplace portal).',
    stats:[{label:'Components',val:'Process Automation, Build Apps, Work Zone'},{label:'Target Users',val:'Citizen developers + power users + professional devs'},{label:'Integration',val:'Connects to S/4HANA, SuccessFactors, Ariba via standard APIs'}],
    tags:['Low Code','No Code','Process Automation','RPA','Build Apps','Work Zone','Workflow','Citizen Dev','Joule'],
  },
  'build-spa': {
    title:'SAP Build Process Automation', color:'#FF9500',
    desc:'Workflow automation + RPA bots. Visual process builder, form-based approvals, desktop automation bots (attended/unattended), business rules engine.',
    stats:[{label:'Trigger Types',val:'API Call, Event, Schedule, Form Submission, Manual'},{label:'Bot Types',val:'Attended (human-triggered), Unattended (fully automated)'},{label:'Integration',val:'S/4HANA, SF, Ariba APIs + CPI for complex flows'}],
    tags:['Workflow Forms','RPA Bots','Business Rules','Decision Tables','Approval Process','Process Visibility','iRPA','Monitoring'],
  },
  'build-apps': {
    title:'SAP Build Apps', color:'#00C8FF',
    desc:'Visual drag-and-drop app builder (formerly AppGyver). Web and mobile apps, data binding to any REST/OData API, logic flow builder, Formula editor.',
    stats:[{label:'Output',val:'Web App (CF deploy) or Mobile App (iOS/Android)'},{label:'Data Sources',val:'OData V2/V4, REST API, SAP BTP services, local'},{label:'Logic',val:'Visual flow builder — no-code with formula support'}],
    tags:['Drag-and-Drop','AppGyver','Web App','Mobile App','OData Binding','Formula Editor','BTP Deploy','No-Code'],
  },
  'build-wz': {
    title:'SAP Build Work Zone', color:'#00D68F',
    desc:'Digital workplace portal — central launchpad aggregating Fiori apps, 3rd-party tools, content, workspaces. Standard Edition (replaces SAP Fiori Launchpad Service) and Advanced Edition.',
    stats:[{label:'Editions',val:'Standard (Fiori Launchpad managed) + Advanced (full portal)'},{label:'Content',val:'SAP apps, custom tiles, external apps, cards (UI5 Web Components)'},{label:'Advanced',val:'Workspaces, KM, blogs, forums, business site pages'}],
    tags:['Launchpad Service','Digital Workplace','Fiori Apps','Content Pages','Workspaces','UI Integration Cards','Business Sites'],
  },

  // ── Data & AI ──────────────────────────────────────────────────────────────
  'btpdata': {
    title:'Data & AI on BTP', color:'#F59E0B',
    desc:'HANA Cloud (in-memory DB), SAP Analytics Cloud (BI + Planning), Datasphere (data fabric), AI Core + Launchpad (ML model lifecycle), Data Intelligence.',
    stats:[{label:'Database',val:'SAP HANA Cloud — in-memory, columnar, multi-model'},{label:'Analytics',val:'SAC: BI stories + Predictive + Planning'},{label:'AI/ML',val:'AI Core: training + serving ML models on BTP'}],
    tags:['HANA Cloud','SAC','AI Core','Datasphere','Data Intelligence','ML','Vector Engine','Graph','Spatial'],
  },
  'data-hana': {
    title:'SAP HANA Cloud', color:'#F59E0B',
    desc:'Fully managed in-memory cloud database. Columnar storage, multi-model (JSON, Graph, Spatial, Vector), SAP HANA Calculation Views, Data Lake integration.',
    stats:[{label:'Services',val:'HANA DB, Data Lake (IQ), HANA Cloud Central'},{label:'Multi-Model',val:'Relational, JSON Store, Graph Engine, Spatial Engine, Vector Engine'},{label:'Dev',val:'SAP HANA Database Explorer, BAS, hdbcds, CAP'}],
    tags:['In-Memory','Columnar','Calculation Views','Vector Engine','Graph','Spatial','Data Lake','HDI','CAP','Multi-Model'],
  },
  'data-sac': {
    title:'SAP Analytics Cloud (SAC)', color:'#3B82F6',
    desc:'Cloud BI + Planning + Predictive. Stories (dashboards), Analytic Applications (interactive), Planning models with real-time writeback, Augmented Analytics.',
    stats:[{label:'Story Types',val:'Classic Story, Optimized Story, Analytic App'},{label:'Data Sources',val:'Live HANA, BW/4, S/4HANA, REST, Excel, CSV'},{label:'Planning',val:'Optimized Embedded Planning with BPC migration path'}],
    tags:['Stories','Dashboards','Planning','Augmented Analytics','Predictive','Analytic App','Smart Insights','Live Connection','SAP Datasphere'],
  },
  'data-ai': {
    title:'AI Core & AI Launchpad', color:'#A855F7',
    desc:'ML model lifecycle management on BTP. Train, deploy, serve ML models. Joule copilot foundation. Pre-trained AI services (Business Entity Recognition, Intelligent Scenario Library).',
    stats:[{label:'AI Core',val:'Model training + deployment + serving (Docker/K8s)'},{label:'Pre-built Services',val:'BER, DAR, Document Info Extraction, Translation'},{label:'AI Launchpad',val:'UI for managing AI Core scenarios and deployments'}],
    tags:['AI Core','ML Models','Joule','BER','DAR','Document Extraction','Training Pipeline','Deployment Serving','LLM Gateway'],
  },
  'data-dsp': {
    title:'SAP Datasphere', color:'#00D68F',
    desc:'Data fabric for the intelligent enterprise. Semantic layer with Business Content, Data Flows, Virtual access to SAP and non-SAP data. Replaces SAP Data Warehouse Cloud.',
    stats:[{label:'Layers',val:'Data Integration Layer + Semantic Layer + Consumption Layer'},{label:'Virtual Access',val:'Connect without copying: S/4HANA, BW, HANA Cloud'},{label:'Consumption',val:'SAC Live Connection, Open SQL, BTP services'}],
    tags:['Data Fabric','Semantic Layer','Data Flows','Virtual Tables','Business Content','Space Modeling','SAC Connection','Open SQL'],
  },

  // ── ABAP Development ──────────────────────────────────────────────────────
  'abap': {
    title:'ABAP Development', color:'#00C8FF',
    desc:'ABAP programming across all generations: Classic (SE38), OO-ABAP, ABAP for HANA (push-down), ABAP Cloud (clean core). Enhancement Framework, Forms, ALV.',
    stats:[{label:'Generations',val:'Classic → OO → HANA-optimized → ABAP Cloud'},{label:'Quality Tools',val:'SCI, SLIN, ABAP Test Cockpit (ATC), ST05, SAT'},{label:'Enhancement',val:'BAdi, User Exit, Customer Exit, Enhancement Spots'}],
    tags:['SE38','OO-ABAP','ABAP for HANA','ABAP Cloud','ALV','Enhancement Framework','Forms','ATC','Performance'],
  },
  'abap-classic': {
    title:'Classic ABAP / OO-ABAP', color:'#00C8FF',
    desc:'Report programming (SE38), Dialog programming (SE51/SE41), OO-ABAP (SE24), ALV (REUSE_ALV_GRID_DISPLAY), BAPIs, RFC-enabled FMs, Batch Input.',
    stats:[{label:'Key Transactions',val:'SE38, SE80, SE24, SE51, SE41, SE37, ST05, SAT'},{label:'ALV Classes',val:'CL_SALV_TABLE, CL_GUI_ALV_GRID'},{label:'Test',val:'ST05 SQL trace, SAT performance trace, SCI code inspector'}],
    tags:['SE38','SE80','SE24','ALV','BAPIs','RFC FMs','Batch Input','ABAP Objects','ALV Grid','Dialog Programming'],
  },
  'abap-cloud': {
    title:'ABAP Cloud (Clean Core)', color:'#00D68F',
    desc:'ABAP development within clean core rules for S/4HANA Cloud and ABAP Environment on BTP. Released C1 APIs only, ATC checks, RAP paradigm.',
    stats:[{label:'API Classification',val:'C1 (released, stable) — only these are allowed'},{label:'Forbidden Patterns',val:'CALL TRANSACTION, direct DB SELECT, WRITE/AT SELECTION-SCREEN'},{label:'Quality Gate',val:'ATC (ABAP Test Cockpit) — mandatory before transport'}],
    tags:['Released APIs','C1','ATC','RAP','No Direct DB Access','Clean Core','ABAP Environment','Tier 1','CDS','OData V4'],
  },
  'abap-hana': {
    title:'ABAP for HANA', color:'#F59E0B',
    desc:'Push computation down to HANA database using AMDP (ABAP Managed Database Procedures), CDS Views with aggregations, OPEN SQL with HANA functions.',
    stats:[{label:'Push-Down',val:'AMDP: ABAP class implementing IF_AMDP_MARKER_HDB'},{label:'CDS',val:'CDS with @Analytics.dataCategory + HANA-specific functions'},{label:'Avoid',val:'Application-layer loops over large datasets — use CDS/AMDP'}],
    tags:['AMDP','CDS Push-Down','HANA Functions','Column Store','ABAP CDS','Code-to-Data','Table Functions','Analytic CDS'],
  },
  'abap-enh': {
    title:'Enhancement Framework', color:'#A855F7',
    desc:'Non-modifying extensions for ECC/S4 On-Prem. BAdIs (SE18/SE19), Enhancement Spots, Customer Exits, User Exits, Implicit/Explicit Enhancement Points.',
    stats:[{label:'Classic BAdI',val:'SE18 definition, SE19 implementation — single-use interface'},{label:'New BAdI',val:'Enhancement Spot → BADI_DEF/BADI_IMP in source — multiple implementations'},{label:'Exits',val:'CMOD user exits, function module exits (EXIT_*), screen exits'}],
    tags:['BAdI SE18/SE19','Enhancement Spots','Customer Exits','Implicit Enh. Points','Explicit Enh. Points','CMOD','EXIT_*','Non-Modifying'],
  },
  'abap-forms': {
    title:'SAP Forms (Adobe/SmartForms)', color:'#EC4899',
    desc:'Adobe Forms (FP prefix in SE80), SmartForms (SMARTFORMS tx), SAPscript (SE71). Adobe LiveCycle Designer for form layout design, PDF output.',
    stats:[{label:'Adobe Forms',val:'SE80 → Interface (FP_...) + Form (FP_...) → SFPDF output'},{label:'SmartForms',val:'SMARTFORMS → form design → SSF_FUNCTION_MODULE_NAME + call'},{label:'SAPscript',val:'SE71 → Classic, largely replaced by Adobe/Smart'}],
    tags:['Adobe Forms','FP Interface','FP Form','PDF Output','SmartForms','SAPscript','LiveCycle Designer','XFDF','Print Program'],
  },

  // ── RAP / OData ───────────────────────────────────────────────────────────
  'rap': {
    title:'RAP / OData', color:'#A855F7',
    desc:'RESTful ABAP Programming model. CDS Views → Behavior Definition (BDEF) → Behavior Implementation → OData V4 exposure. The S/4HANA development standard.',
    stats:[{label:'Layers',val:'CDS (data model) → BDEF (behavior) → Behavior Impl (logic) → OData V4'},{label:'BO Types',val:'Managed, Unmanaged, Abstract, Projection'},{label:'Draft',val:'Managed draft with auto-generated draft table (D-table)'}],
    tags:['CDS Views','BDEF','Behavior Impl','Draft','Actions','Determinations','Validations','OData V4','Feature Control'],
  },
  'rap-cds': {
    title:'CDS Views (Core Data Services)', color:'#00C8FF',
    desc:'ABAP CDS is the data modeling foundation of RAP. Basic interface view → Composite view → Consumption/Projection view. Annotations drive Fiori UI, OData metadata.',
    stats:[{label:'View Types',val:'Basic Interface View → Composite View → Consumption/Projection View'},{label:'Key Annotations',val:'@OData.publish, @UI.lineItem, @UI.facets, @Search.searchable'},{label:'Associations',val:'to-one, to-many, redirected in projection'}],
    tags:['Basic View','Composite View','Projection View','@OData.publish','@UI annotations','@Search','Associations','Joins','AMDP CDS'],
  },
  'rap-bdef': {
    title:'Behavior Definition (BDEF)', color:'#A855F7',
    desc:'Defines operations, draft, actions, determinations, validations, feature controls for a RAP Business Object. MANAGED or UNMANAGED implementation.',
    stats:[{label:'BO Types',val:'managed implementation (auto CRUD), unmanaged (manual handlers)'},{label:'Draft Table',val:'Auto-generated for managed + draft — D_<entity>'},{label:'Numbering',val:'uuid (early auto-UUID), early (developer sets key), late (DB sequence)'}],
    tags:['Managed','Unmanaged','Draft','Actions','Determinations','Validations','Feature Control','Projection BDEF','Authorization'],
  },
  'rap-impl': {
    title:'Behavior Implementation (ABAP Class)', color:'#00D68F',
    desc:'Local handler classes implementing FOR MODIFY, FOR READ, FOR VALIDATE, FOR DETERMINE, FOR CREATE/UPDATE/DELETE. Where the business logic lives.',
    stats:[{label:'Class Structure',val:'LCL_HANDLER (FOR MODIFY) + LCL_SAVER (FOR GLOBAL SAVE)'},{label:'Context Objects',val:'it_create, it_update, it_delete, mapped, failed, reported'},{label:'RAP BO Access',val:'EML (Entity Manipulation Language) — READ ENTITIES / MODIFY ENTITIES'}],
    tags:['Handler Class','Saver Class','EML','MODIFY ENTITIES','READ ENTITIES','it_create','mapped-failed-reported','Feature Control Impl'],
  },
  'rap-v4': {
    title:'OData V4 / V2', color:'#00C8FF',
    desc:'OData V4 (preferred for RAP), OData V2 (legacy). Batch requests, $expand, $select, $filter, Draft-specific actions, delta queries, function imports vs. actions.',
    stats:[{label:'V4 Endpoint',val:'/sap/opu/odata4/{namespace}/{service_name}/srvd/sap/{repo}/{version}/'},{label:'Draft',val:'Draft-specific actions: draftActivate, draftEdit, draftDiscard'},{label:'Batch',val:'Content-Type: multipart/mixed with changeset'}],
    tags:['$expand','$select','$filter','$skiptoken','Draft Actions','Batch Requests','Actions vs Functions','V2 Compatibility','OpenAPI'],
  },

  // ── Fiori / UI5 ───────────────────────────────────────────────────────────
  'fiori': {
    title:'Fiori / UI5', color:'#00C8FF',
    desc:'SAP Fiori Design System + SAPUI5 framework. Fiori Elements (annotation-driven), Freestyle UI5 apps, Fiori Launchpad, Adapt UI, CDS Annotation-driven apps.',
    stats:[{label:'Fiori Elements',val:'ListReport, ObjectPage, ALP, Worklist, Overview Page'},{label:'UI5 Framework',val:'MVC pattern, OData V2/V4 Models, Controls library'},{label:'Tools',val:'SAP Fiori Tools (BAS + VS Code), Guided Dev, Page Map'}],
    tags:['ListReport','ObjectPage','ALP','SAPUI5','MVC','OData Model','Fiori Tools','BAS','Adapt UI','Launchpad'],
  },
  'fiori-elem': {
    title:'Fiori Elements', color:'#00C8FF',
    desc:'Annotation-driven Fiori apps with minimal code. ListReport + ObjectPage most common. CDS annotations drive table columns, form fields, actions, facets, filters.',
    stats:[{label:'App Types',val:'List Report/Object Page (LR/OP), ALP, Worklist, OP, Form Entry'},{label:'Key Annotations',val:'@UI.lineItem, @UI.facets, @UI.fieldGroup, @UI.selectionFields'},{label:'Action Types',val:'Bound actions (per instance), Unbound (list-level), Toolbar buttons'}],
    tags:['List Report','Object Page','ALP','@UI.lineItem','@UI.facets','@UI.fieldGroup','@UI.selectionFields','Bound Actions','Criticality','SmartTable'],
  },
  'fiori-ui5': {
    title:'SAPUI5 Custom Apps', color:'#FF9500',
    desc:'Full flexibility custom Fiori apps. MVC architecture (Views + Controllers + Models), OData V2/V4 model binding, Component.js, manifest.json routing.',
    stats:[{label:'Architecture',val:'MVC: XML View + Controller (JS) + JSON/OData Model'},{label:'Routing',val:'manifest.json → sap.ui5.routing → targets + routes'},{label:'OData',val:'ODataModel V2 (sap.ui.model.odata.v2) or V4 (v4.ODataModel)'}],
    tags:['XML Views','Controller','OData V2 Model','OData V4 Model','manifest.json','Routing','Component.js','SmartControls','Custom Extensions'],
  },
  'fiori-anno': {
    title:'CDS Annotations', color:'#00D68F',
    desc:'Drive Fiori Elements UI from CDS layer. @UI, @Search, @OData, @Analytics, @Consumption annotations. Complete Fiori app behavior from CDS without JS code.',
    stats:[{label:'UI Annotations',val:'@UI.lineItem, @UI.facets, @UI.fieldGroup, @UI.headerInfo, @UI.selectionPresentationVariant'},{label:'OData Annotations',val:'@OData.publish, @OData.entityType.name, @Semantics'},{label:'Search',val:'@Search.searchable, @Search.defaultSearchElement'}],
    tags:['@UI.lineItem','@UI.facets','@UI.fieldGroup','@UI.selectionPresentationVariant','@OData.publish','@Semantics','@Analytics.dataCategory','@Search'],
  },
  'fiori-lp': {
    title:'Fiori Launchpad Configuration', color:'#A855F7',
    desc:'SAP Fiori Launchpad setup: Business Roles, Business Catalogs, App Tiles, Target Mappings, Spaces/Pages (FLP 3.0). SPRO configuration + Launchpad Designer.',
    stats:[{label:'Config Path',val:'SPRO → SAP Fiori → Launchpad → System Configuration'},{label:'Role Assignment',val:'SU01/PFCG → Role → Menu → SAP Fiori App'},{label:'FLP 3.0',val:'Spaces + Pages model replacing classic Groups'}],
    tags:['Business Roles','Business Catalogs','Target Mappings','App Tiles','Spaces/Pages','PFCG','Launchpad Designer','FLP Config','Intent Navigation'],
  },

  // ── CAP ───────────────────────────────────────────────────────────────────
  'cap': {
    title:'CAP — Cloud Application Programming', color:'#3B82F6',
    desc:'Framework for cloud-native SAP apps. CDS for data models + services, Node.js or Java runtime, HANA Cloud as DB, Fiori as UI. MTX for multitenancy.',
    stats:[{label:'Runtimes',val:'@sap/cds (Node.js), com.sap.cds (Java Spring Boot)'},{label:'Database',val:'SAP HANA Cloud (prod), SQLite (dev/test)'},{label:'Deploy',val:'CF (mta.yaml), Kyma (helm chart), ABAP (CDS plugin)'}],
    tags:['CDS Model','Node.js','Java','@restrict','@requires','MTX','HANA Cloud','Remote Services','Audit Log','Feature Toggles'],
  },

  // ── Extensibility ─────────────────────────────────────────────────────────
  'ext': {
    title:'SAP Extensibility', color:'#EC4899',
    desc:'4-tier model: Key User (no-code), In-App ABAP (BAdI), Side-by-Side (BTP), Classic (modifications). Clean core compliance depends on S/4 variant.',
    stats:[{label:'Tier 1',val:'Key User Ext. — Adapt UI, Custom Fields, Custom Logic, Apps'},{label:'Tier 2',val:'In-App BAdI / Enhancement Spots — ABAP developer'},{label:'Tier 3-4',val:'Side-by-Side BTP (CAP) / Classic ECC modification'}],
    tags:['Key User Ext.','BAdI','Enhancement Spots','Side-by-Side','CAP','Classic Mods','Upgrade Safety','Clean Core Levels','ABAP Cloud'],
  },

  // ── Workflow ──────────────────────────────────────────────────────────────
  'wf': {
    title:'SAP Workflow', color:'#F59E0B',
    desc:'BTP Build Process Automation (cloud workflow), SAP Business Workflow (classic ECC/S4), S/4HANA Flexible Workflow (SWDD-based), iFlow orchestration in CPI.',
    stats:[{label:'Cloud',val:'SAP Build SPA — visual workflow + RPA + decisions'},{label:'Classic',val:'SWDD (Workflow Builder) + Business Objects + events'},{label:'S/4 Flexible',val:'SWDD-based approval workflows with UI5 inbox'}],
    tags:['Build SPA','SWDD','Business Objects','SWI1','SWI5','My Inbox','Flexible WF','Step Types','Agent Determination','CPI Orchestration'],
  },

  // ── Documentation ─────────────────────────────────────────────────────────
  'doc-sdd': {
    title:'Software Design Document', color:'#00C8FF',
    desc:'Full SDD covering system architecture, component design, data models, interfaces, security, deployment, non-functional requirements.',
    stats:[{label:'Sections',val:'Overview, Architecture, Components, Data Model, Interfaces, Security, Deployment'},{label:'Audience',val:'Technical architects, lead developers, reviewers'},{label:'Output',val:'Structured Markdown / Word — sharable design spec'}],
    tags:['Architecture','Components','Data Model','Interfaces','Security','NFR','Deployment Diagram','ER Diagram'],
  },
  'doc-tech': {
    title:'Technical Specification', color:'#FF9500',
    desc:'Precise technical details for implementation. Exact FM names, table fields, SPRO paths, config values, code snippets, transaction codes.',
    stats:[{label:'Content',val:'FMs, Tables, Fields, Events, Transactions, SPRO paths, Code'},{label:'Audience',val:'Developers implementing the solution'},{label:'Output',val:'Developer-ready implementation reference'}],
    tags:['FM Names','Table Fields','SPRO Path','Transaction Codes','Config Values','Code Snippets','Test Data','Error Codes'],
  },
  'doc-intg': {
    title:'Integration Design Document', color:'#00D68F',
    desc:'Full IDD: source/target systems, payload mapping, adapter config, auth mechanism, error handling strategy, monitoring, retry logic.',
    stats:[{label:'Sections',val:'Systems, Payload, Adapter Config, Auth, Error Handling, Monitoring'},{label:'Audience',val:'Integration developers, architects, client technical teams'},{label:'Standard',val:'Follows SAP Integration Solution Advisory (ISA-M) patterns'}],
    tags:['Source/Target','Payload Mapping','Adapter Config','OAuth Setup','Error Handling','Dead Letter Queue','Monitoring','ISA-M'],
  },
  'doc-impl': {
    title:'Implementation Guide', color:'#A855F7',
    desc:'Phased implementation plan with prerequisites, config steps, customizing paths, test criteria, go-live checklist, handover documentation.',
    stats:[{label:'Phases',val:'Prepare → Explore → Realize → Deploy → Run'},{label:'Content',val:'Prerequisites, Config Steps, SPRO, Test Script, Go-Live'},{label:'Audience',val:'Project team, functional consultants, client stakeholders'}],
    tags:['Phases','Prerequisites','Config Steps','Customizing','SPRO Paths','Test Script','Go-Live Checklist','Handover','Risk Mitigation'],
  },
  'doc-step': {
    title:'Step-by-Step Solution Guide', color:'#F59E0B',
    desc:'Numbered procedure with exact SPRO paths, transaction codes, field values, screenshots pointer, and verification steps. Zero ambiguity.',
    stats:[{label:'Format',val:'Numbered steps → transaction → SPRO path → field → value → result'},{label:'Detail Level',val:'100% reproducible without additional knowledge'},{label:'Use Case',val:'Runbooks, SOPs, support handbooks, training material'}],
    tags:['Numbered Steps','SPRO Path','Transaction Codes','Field Values','Verification','Runbook','SOP','Training Material'],
  },
  'doc-api': {
    title:'API Documentation', color:'#EC4899',
    desc:'Full API reference: endpoints, methods, request/response payloads, auth flows, error codes, curl examples, rate limits, changelog.',
    stats:[{label:'Structure',val:'OpenAPI 3.0 spec compatible'},{label:'Content',val:'Endpoints, Methods, Payloads, Auth, Errors, Examples, Rate Limits'},{label:'Audience',val:'API consumers, third-party developers, integration teams'}],
    tags:['OpenAPI 3.0','Endpoints','Payloads','Auth Flow','Error Codes','curl Examples','Rate Limits','Versioning','Changelog'],
  },
  'doc-test': {
    title:'Test Plan & Test Cases', color:'#FF4466',
    desc:'Unit tests, integration tests, UAT, regression, performance test cases. Each case: preconditions, steps, expected result, pass/fail criteria.',
    stats:[{label:'Test Types',val:'Unit, Integration, E2E, UAT, Regression, Performance, Security'},{label:'Test Case Format',val:'ID → Precondition → Steps → Expected Result → Actual → Status'},{label:'Tools',val:'SAP Solution Manager, TOSCA, Jira Xray, manual'}],
    tags:['Test Cases','Unit Tests','Integration Tests','UAT','Regression','Performance','Test Data','Defect Tracking','Traceability Matrix'],
  },
};

// ─── NAVIGATION TREE ──────────────────────────────────────────────────────────
export const NAV = [
  { id:'_sep1', separator:true, label:'CORE' },
  { id:'home',    icon:'⬡',  label:'Command Center',      section:'core' },
  { id:'chat',    icon:'◈',  label:'SAP Sage AI',          section:'core', badge:'AI' },
  { id:'_sep2', separator:true, label:'LANDSCAPES' },
  { id:'ecc',     icon:'▣', label:'SAP ECC 6.0',           section:'landscape', children:[
    { id:'ecc-fi',    label:'FI / CO',         color:'#00D68F' },
    { id:'ecc-mm',    label:'MM / WM',         color:'#FF9500' },
    { id:'ecc-sd',    label:'SD',              color:'#00C8FF' },
    { id:'ecc-pm',    label:'PM / EAM',        color:'#A855F7' },
    { id:'ecc-qm',    label:'QM',              color:'#EC4899' },
    { id:'ecc-pp',    label:'PP / MRP',        color:'#F59E0B' },
    { id:'ecc-hcm',   label:'HCM / Payroll',  color:'#14B8A6' },
    { id:'ecc-ps',    label:'PS',              color:'#3B82F6' },
    { id:'ecc-ale',   label:'ALE / IDoc',      color:'#00C8FF' },
    { id:'ecc-basis', label:'Basis / Config',  color:'#607D8B' },
  ]},
  { id:'s4op',    icon:'▣', label:'S/4HANA On-Premise',   section:'landscape', children:[
    { id:'s4op-fi',    label:'FI / Universal Journal', color:'#00D68F' },
    { id:'s4op-mm',    label:'MM / EWM',               color:'#FF9500' },
    { id:'s4op-sd',    label:'SD / aATP',              color:'#00C8FF' },
    { id:'s4op-pm',    label:'PM / EAM',               color:'#A855F7' },
    { id:'s4op-pp',    label:'PP / MRP Live',          color:'#F59E0B' },
    { id:'s4op-rap',   label:'RAP / OData V4',         color:'#00D68F' },
    { id:'s4op-fiori', label:'Fiori / Launchpad',      color:'#00C8FF' },
    { id:'s4op-ext',   label:'Extensibility',          color:'#EC4899' },
  ]},
  { id:'s4pub',   icon:'▣', label:'S/4HANA Public Cloud', section:'landscape', children:[
    { id:'s4pub-kue',  label:'Key User Extensions', color:'#00D68F' },
    { id:'s4pub-side', label:'Side-by-Side (BTP)',  color:'#FF9500' },
    { id:'s4pub-api',  label:'Released APIs',       color:'#00C8FF' },
    { id:'s4pub-evts', label:'Business Events',     color:'#A855F7' },
  ]},
  { id:'s4pc',    icon:'▣', label:'S/4HANA Private Cloud',section:'landscape', children:[
    { id:'s4pc-ext',  label:'Extensibility Rules', color:'#FF9500' },
    { id:'s4pc-ops',  label:'Operations / Basis',  color:'#607D8B' },
    { id:'s4pc-intg', label:'BTP Integration',      color:'#3B82F6' },
  ]},
  { id:'sf',      icon:'◆', label:'SuccessFactors',       section:'landscape', children:[
    { id:'sf-ec',   label:'Employee Central', color:'#FF9500' },
    { id:'sf-rcm',  label:'Recruiting',       color:'#00D68F' },
    { id:'sf-lms',  label:'Learning',         color:'#A855F7' },
    { id:'sf-pm',   label:'Performance',      color:'#00C8FF' },
    { id:'sf-comp', label:'Compensation',     color:'#F59E0B' },
    { id:'sf-api',  label:'API & Integration',color:'#3B82F6' },
  ]},
  { id:'ariba',   icon:'◆', label:'SAP Ariba',            section:'landscape', children:[
    { id:'ariba-proc',  label:'Procurement',       color:'#FF9500' },
    { id:'ariba-cntrt', label:'Contracts',          color:'#00D68F' },
    { id:'ariba-sup',   label:'Supplier Mgmt',      color:'#A855F7' },
    { id:'ariba-api',   label:'Open API',           color:'#3B82F6' },
  ]},
  { id:'others',  icon:'◆', label:'Other Landscapes',     section:'landscape', children:[
    { id:'oth-concur', label:'SAP Concur',       color:'#00C8FF' },
    { id:'oth-mdi',    label:'MDI (Master Data)',color:'#FF9500' },
    { id:'oth-mdg',    label:'MDG',              color:'#00D68F' },
    { id:'oth-dms',    label:'DMS',              color:'#A855F7' },
    { id:'oth-ibp',    label:'IBP',              color:'#F59E0B' },
    { id:'oth-bw',     label:'BW/4HANA',         color:'#3B82F6' },
    { id:'oth-grc',    label:'GRC',              color:'#EC4899' },
  ]},
  { id:'_sep_btp', separator:true, label:'SAP BTP' },
  { id:'btp',      icon:'⬡', label:'BTP Overview',        section:'btp' },
  { id:'intgsuite',icon:'⬡', label:'Integration Suite',   section:'btp', children:[
    { id:'is-cpi',  label:'Cloud Integration (CPI)',  color:'#00D68F' },
    { id:'is-apim', label:'API Management',            color:'#00C8FF' },
    { id:'is-em',   label:'Event Mesh',               color:'#A855F7' },
    { id:'is-ia',   label:'Integration Advisor',      color:'#F59E0B' },
    { id:'is-oc',   label:'Open Connectors',          color:'#3B82F6' },
    { id:'is-tpm',  label:'Trading Partner Mgmt',     color:'#EC4899' },
  ]},
  { id:'btpdev',   icon:'⬡', label:'BTP Dev / Runtime',  section:'btp', children:[
    { id:'dev-abap', label:'ABAP Environment', color:'#00D68F' },
    { id:'dev-cf',   label:'Cloud Foundry',    color:'#FF9500' },
    { id:'dev-kyma', label:'Kyma',             color:'#A855F7' },
    { id:'dev-bas',  label:'BAS',              color:'#00C8FF' },
  ]},
  { id:'btpbuild',icon:'⬡', label:'SAP Build',           section:'btp', children:[
    { id:'build-spa',  label:'Process Automation', color:C.amber },
    { id:'build-apps', label:'Build Apps',         color:C.cyan },
    { id:'build-wz',   label:'Work Zone',          color:C.green },
  ]},
  { id:'btpdata', icon:'⬡', label:'Data & AI',           section:'btp', children:[
    { id:'data-hana', label:'HANA Cloud',        color:C.yellow },
    { id:'data-sac',  label:'Analytics Cloud',   color:C.blue },
    { id:'data-ai',   label:'AI Core',           color:C.purple },
    { id:'data-dsp',  label:'Datasphere',        color:C.teal },
  ]},
  { id:'_sep3', separator:true, label:'TECHNICAL' },
  { id:'abap',  icon:'◉', label:'ABAP Development',  section:'tech', children:[
    { id:'abap-classic', label:'Classic ABAP / OO',       color:C.cyan },
    { id:'abap-cloud',   label:'ABAP Cloud (Clean Core)', color:C.green },
    { id:'abap-hana',    label:'ABAP for HANA',           color:C.yellow },
    { id:'abap-enh',     label:'Enhancement Framework',   color:C.purple },
    { id:'abap-forms',   label:'Adobe / SAPscript Forms', color:C.pink },
  ]},
  { id:'rap',   icon:'◉', label:'RAP / OData',       section:'tech', children:[
    { id:'rap-cds',  label:'CDS Views',               color:C.cyan },
    { id:'rap-bdef', label:'Behavior Definition',     color:C.green },
    { id:'rap-impl', label:'Behavior Implementation', color:C.amber },
    { id:'rap-v4',   label:'OData V4 / V2',           color:C.purple },
  ]},
  { id:'fiori', icon:'◉', label:'Fiori / UI5',       section:'tech', children:[
    { id:'fiori-elem',  label:'Fiori Elements',   color:C.cyan },
    { id:'fiori-ui5',   label:'SAPUI5 Custom',    color:C.amber },
    { id:'fiori-anno',  label:'CDS Annotations',  color:C.green },
    { id:'fiori-lp',    label:'Launchpad Config', color:C.purple },
  ]},
  { id:'cap', icon:'◉', label:'CAP Full Stack',    section:'tech' },
  { id:'ext', icon:'◉', label:'Extensibility',     section:'tech' },
  { id:'spa', icon:'◉', label:'Process Automation',section:'tech' },
  { id:'wf',  icon:'◉', label:'Workflow',          section:'tech' },
  { id:'_sep4', separator:true, label:'DOCUMENTATION' },
  { id:'doc-sdd',  icon:'▫', label:'Software Design Doc',    section:'docs' },
  { id:'doc-tech', icon:'▫', label:'Technical Spec',         section:'docs' },
  { id:'doc-intg', icon:'▫', label:'Integration Design Doc', section:'docs' },
  { id:'doc-impl', icon:'▫', label:'Implementation Guide',   section:'docs' },
  { id:'doc-step', icon:'▫', label:'Step-by-Step Guide',     section:'docs' },
  { id:'doc-api',  icon:'▫', label:'API Documentation',      section:'docs' },
  { id:'doc-test', icon:'▫', label:'Test Plan',              section:'docs' },
  { id:'_sep5', separator:true, label:'TOOLS' },
  { id:'codegen',  icon:'⌨', label:'Code Generator',     section:'tools' },
  { id:'txfinder', icon:'⊞', label:'Transaction Finder', section:'tools' },
  { id:'wizard',   icon:'⟡', label:'Config Wizard',      section:'tools' },
  { id:'apiref',   icon:'⊙', label:'API Reference',      section:'tools' },
];

// ─── TRANSACTIONS ─────────────────────────────────────────────────────────────
export const TRANSACTIONS = [
  ['SM59','BASIS','RFC Destinations','Connectivity'],['STRUST','BASIS','SSL Certificate Manager','Security'],
  ['SM21','BASIS','System Log','Monitoring'],['SM50','BASIS','Work Process Overview','Performance'],
  ['SM37','BASIS','Job Monitor','Scheduler'],['SM36','BASIS','Schedule Background Job','Scheduler'],
  ['PFCG','BASIS','Role Maintenance','Authorization'],['SU01','BASIS','User Maintenance','Authorization'],
  ['SPRO','BASIS','Customizing / IMG','Config'],['SLG1','BASIS','Application Log Viewer','Monitoring'],
  ['SM30','BASIS','Table Maintenance','Config'],['AL11','BASIS','SAP Directories','Files'],
  ['SM12','BASIS','Lock Entries','Performance'],['RZ10','BASIS','Profile Parameters','Config'],
  ['STMS','BASIS','Transport Management','Transport'],['SCC4','BASIS','Client Administration','Basis'],
  ['SMLG','BASIS','Logon Groups','Basis'],['SM66','BASIS','Global Work Process Overview','Performance'],
  ['SE38','ABAP','ABAP Program Editor','Dev'],['SE80','ABAP','Object Navigator','Dev'],
  ['SE11','ABAP','ABAP Dictionary','Dev'],['SE16','ABAP','Data Browser','Data'],
  ['SE16N','ABAP','General Table Display','Data'],['SE24','ABAP','Class Builder','Dev'],
  ['SE37','ABAP','Function Module Editor','Dev'],['SE93','ABAP','Transaction Maintenance','Dev'],
  ['SE18','ABAP','BAdI Builder','Enhancement'],['SE19','ABAP','BAdI Implementation','Enhancement'],
  ['ST05','ABAP','SQL Performance Trace','Performance'],['SAT','ABAP','Runtime Analysis','Performance'],
  ['SCI','ABAP','Code Inspector','Quality'],['SLIN','ABAP','Extended Syntax Check','Quality'],
  ['SHDB','ABAP','Batch Input Recorder','Dev'],['SE51','ABAP','Screen Painter','Dev'],
  ['WE81','ALE','Message Type Maintenance','IDoc'],['WE31','ALE','IDoc Basic Type Editor','IDoc'],
  ['WE82','ALE','Assign IDoc to Message Type','IDoc'],['WE05','ALE','IDoc Monitor','IDoc'],
  ['WE09','ALE','Search IDoc','IDoc'],['WE19','ALE','Test IDoc Processing','IDoc'],
  ['BD64','ALE','Distribution Model','ALE'],['BD61','ALE','Activate Change Pointers Global','ALE'],
  ['BD50','ALE','Activate CP per Message Type','ALE'],['BD52','ALE','Change Doc Fields for MsgType','ALE'],
  ['SWE2','ALE','Event Type Linkages','Events'],['SWO1','ALE','Business Object Builder','Events'],
  ['RBDMIDOC','ALE','Generate IDocs from Change Pointers','ALE'],['BD87','ALE','Reprocess IDocs','IDoc'],
  ['/ASADEV/ACI_MONITOR','EEM','Event Enablement Monitor','EventEnablement'],
  ['FB01','FI','Post FI Document','Posting'],['FB03','FI','Display FI Document','Display'],
  ['FB50','FI','G/L Account Document Entry','G/L'],['FB60','FI','Enter Vendor Invoice','AP'],
  ['FB70','FI','Enter Customer Invoice','AR'],['F-53','FI','Post Outgoing Payments','AP'],
  ['F-28','FI','Post Incoming Payments','AR'],['F-32','FI','Clear Customer Open Items','AR'],
  ['F110','FI','Automatic Payment Program','AP'],['FS00','FI','G/L Account Master','MasterData'],
  ['FK01','FI','Create Vendor (FI)','MasterData'],['FD01','FI','Create Customer','MasterData'],
  ['FBL1N','FI','Vendor Line Items','Reports'],['FBL3N','FI','G/L Line Items','Reports'],
  ['FBL5N','FI','Customer Line Items','Reports'],['F.01','FI','Balance Sheet / P&L','Reports'],
  ['FAGLB03','FI','G/L Account Balance (New G/L)','Reports'],
  ['KE30','CO','CO-PA Report','CO-PA'],['KSB1','CO','Cost Center Line Items','CO'],
  ['KO01','CO','Create Internal Order','CO'],['CJI3','PS','Project Line Items','PS'],
  ['ME21N','MM','Create Purchase Order','Procurement'],['ME22N','MM','Change PO','Procurement'],
  ['ME23N','MM','Display PO','Procurement'],['ME51N','MM','Create Purchase Requisition','Procurement'],
  ['MIGO','MM','Goods Movement (GR/GI)','Inventory'],['MMBE','MM','Stock Overview','Inventory'],
  ['MB52','MM','Warehouse Stocks','Inventory'],['MB51','MM','Material Document List','Inventory'],
  ['MIRO','MM','Incoming Invoice (LIV)','Invoice'],['MIR7','MM','Park Invoice','Invoice'],
  ['MM01','MM','Create Material Master','MasterData'],['MK01','MM','Create Vendor (MM)','MasterData'],
  ['ME2N','MM','POs by PO Number','Reports'],['ME2M','MM','POs by Material','Reports'],
  ['VA01','SD','Create Sales Order','Orders'],['VA02','SD','Change Sales Order','Orders'],
  ['VA03','SD','Display Sales Order','Orders'],['VL01N','SD','Create Outbound Delivery','Shipping'],
  ['VL02N','SD','Change Delivery','Shipping'],['VF01','SD','Create Billing Document','Billing'],
  ['VF03','SD','Display Billing','Billing'],['XD01','SD','Create Customer (Central)','MasterData'],
  ['VK11','SD','Create Pricing Condition','Pricing'],['VKM3','SD','Release Credit-Blocked Docs','Credit'],
  ['IW21','PM','Create PM Notification','Notifications'],['IW22','PM','Change Notification','Notifications'],
  ['IW29','PM','Display Notifications','Notifications'],['IW31','PM','Create Work Order','Orders'],
  ['IW32','PM','Change Work Order','Orders'],['IW38','PM','Mass Change Orders','Orders'],
  ['IL01','PM','Create Functional Location','MasterData'],['IE01','PM','Create Equipment','MasterData'],
  ['IP01','PM','Create Maintenance Plan','Planning'],['IP10','PM','Maintenance Scheduling','Planning'],
  ['QM01','QM','Create Quality Notification','QM'],['QE01','QM','Inspection Results Entry','QM'],
  ['QA01','QM','Create Inspection Lot','QM'],['QS21','QM','Master Inspection Char.','QM'],
  ['MD01','PP','Run MRP','PP'],['MD04','PP','Stock/Requirements List','PP'],
  ['CO01','PP','Create Production Order','PP'],['CO02','PP','Change Production Order','PP'],
  ['CA01','PP','Create Routing','PP'],['CS01','PP','Create BOM','PP'],
  ['COOIS','PP','Production Order Information','PP'],
];

// ─── QUICK PROMPTS — every section gets 4-5 targeted suggestions ──────────────
export const QUICK_PROMPTS = {

  // ── Global default ───────────────────────────────────────────────────────
  default: [
    'How do I send ECC PM Notification events to SAP Event Mesh using ASANWEE?',
    'Generate a complete CPI Groovy script to parse IDoc XML and map to CloudEvent',
    'Compare S/4HANA Public vs Private Cloud extensibility rules and restrictions',
    'Walk me through RAP managed BO with draft handling and custom actions',
    'What BTP services are needed for a side-by-side extension on S/4HANA Cloud?',
    'How does SuccessFactors Employee Central integrate with S/4HANA Payroll via CPI?',
  ],

  // ── ECC Parent ────────────────────────────────────────────────────────────
  ecc: [
    'What are the key architectural differences between ECC 6.0 EhP7 and S/4HANA?',
    'How do I enable change pointers for a custom IDoc type in ECC?',
    'Walk me through setting up an RFC destination (SM59) and testing connectivity',
    'What is the ECC enhancement framework — BAdI vs user exit vs customer exit?',
    'Generate an ABAP report to read BKPF/BSEG and display as ALV with totals',
  ],
  'ecc-fi': [
    'What tables store FI document headers and line items — BKPF, BSEG differences?',
    'Walk me through New G/L document splitting configuration in SPRO step by step',
    'How does F110 automatic payment program work — configuration and run steps?',
    'Write ABAP using BAPI_ACC_DOCUMENT_POST to post a G/L journal entry with error handling',
    'Configure AR dunning procedure from scratch — dunning levels, charges, interest',
    'Explain CO-PA characteristics vs value fields and how document flow works',
  ],
  'ecc-mm': [
    'Explain 3-way match in MM invoice verification — PO → GR → MIRO flow',
    'What movement types do I need for GR (101), GI to cost center (201), and goods issue to production (261)?',
    'How does automatic account determination work in OBYC — what are transaction keys?',
    'Write ABAP to call BAPI_GOODSMVT_CREATE for a goods receipt against a PO',
    'Configure a new procurement type with special procurement keys in MM',
    'How do I set up batch management with batch classification in MM?',
  ],
  'ecc-sd': [
    'What is copy control in SD and how do I configure it between order types?',
    'Walk me through VK11 pricing condition record setup — access sequence, condition table, condition type',
    'How does credit management work in ECC SD — what are the credit check types?',
    'Explain the output determination procedure for sales order confirmation (RVORDER01)',
    'Write ABAP to read VBAK/VBAP and generate a custom delivery list report',
    'Configure revenue recognition for a service order type using VF44/VF45',
  ],
  'ecc-pm': [
    'Configure preventive maintenance plans using IP01 — counter-based and time-based',
    'How does the BUS2080 event linkage work for PM Notification CREATED → Event Mesh?',
    'Set up equipment hierarchy: functional location → equipment → measuring point',
    'Walk me through IW31 work order creation with operations, components, and settlement rule',
    'Write ABAP to read QMEL and AUFK with join for maintenance notification + order data',
    'How do I configure ASANWEE to publish PM Notification events to SAP Event Mesh?',
  ],
  'ecc-qm': [
    'How does QM inspection lot creation work triggered from MM goods receipt?',
    'Configure an inspection plan (QP01) with control charts and sampling procedure',
    'Walk me through usage decision posting and how it affects stock type in IM',
    'How do I create a QM notification and link it to a production order?',
    'Write ABAP to read VIQMEL for quality notifications filtered by plant and status',
    'Configure defect recording with defect codes and catalog types in QM',
  ],
  'ecc-pp': [
    'Explain the MRP run (MD01) — what inputs does it read and what outputs does it create?',
    'Walk me through creating a production order (CO01) through to goods issue and GR',
    'How does KANBAN work in PP — configure a kanban cycle for a production supply area',
    'Write ABAP to read production order status and component requirements from AUFK/RESB',
    'Configure capacity planning — work center, capacity category, shift definition',
    'How does DDMRP differ from classic MRP — buffer positioning and replenishment logic',
  ],
  'ecc-hcm': [
    'Explain infotype structure in HCM PA — how do PA0001, PA0002, PA0007, PA0008 relate?',
    'How do I configure a new absence type and quota in TM (PA20/TM)?',
    'Walk me through running payroll for a single employee and retro accounting',
    'Configure an OM object (O, S, P, C) and maintain relationships in PP01',
    'Write ABAP to read multiple infotypes for an employee using HR_READ_INFOTYPE',
    'How does HR-PDC interface work for time data transfer to payroll?',
  ],
  'ecc-ps': [
    'Explain WBS element structure — how does it relate to network activities in PS?',
    'How do I configure a project billing plan for milestone billing in PS/SD?',
    'Walk me through project settlement (CJ88) — what settlement rules are needed?',
    'Configure project planning board in CJ20N — how do I set up project profiles?',
    'Write ABAP to read PRPS (WBS) and AUFK (network orders) for project cost report',
    'How does Resource-Related Billing (DP90) work in PS integrated with SD?',
  ],
  'ecc-ale': [
    'Full step-by-step ASANWEE configuration to publish ECC PM Notification events to SAP Event Mesh',
    'How does BD52 change pointer field activation work — what needs to be active?',
    'Configure SWE2 event linkage for BUS2080 CREATED — exact steps and parameters',
    'Write ABAP to create and send a custom IDoc using MASTER_IDOC_DISTRIBUTE',
    'How do I monitor and reprocess failed IDocs — WE05, BD87, RBDMIDOC explained',
    'Set up a distribution model (BD64) for Customer master replication between two systems',
  ],
  'ecc-basis': [
    'How do I configure an RFC destination (SM59) — all tabs and their settings',
    'Walk me through SSL certificate import in STRUST — add to PSE, test connection',
    'Explain PFCG role concept — authorization objects, field values, profile generation',
    'How does the ECC transport landscape work — DEV → QAS → PRD transport path',
    'Analyze system performance using SM50, SM66, SM37 — what to look for',
    'Configure background job with job steps, variants, and start conditions in SM36',
  ],

  // ── S/4HANA On-Premise ───────────────────────────────────────────────────
  s4op: [
    'What is the Universal Journal ACDOCA — what does it replace from ECC?',
    'Compare extensibility options in S/4HANA On-Prem: Key User vs BAdI vs Side-by-Side',
    'How does Fiori Launchpad replace SAP GUI for business transactions in S/4?',
    'What is the S/4HANA Simplification List and how do I check my custom code?',
    'Generate a CDS view with @OData.publish:true for a S/4HANA On-Prem service',
  ],
  's4op-fi': [
    'How does ACDOCA Universal Journal differ from ECC BKPF/BSEG structure?',
    'Configure Central Finance (CFIN) — what does it replicate and what stays in ECC?',
    'What is Group Reporting in S/4HANA and how does it relate to BCS/SEM-BCS?',
    'Walk me through S/4HANA Cash Management setup — bank accounts, liquidity planning',
    'How does document splitting work differently in S/4 vs ECC New G/L?',
    'Write ABAP Cloud code to read ACDOCA using released CDS view IF_I_JOURNALENTRY',
  ],
  's4op-mm': [
    'How is Material Ledger mandatory in S/4HANA and how does actual costing work?',
    'Explain Embedded EWM vs classic WM — what is the migration approach?',
    'Configure a stock transport order (STO) between two plants in S/4HANA',
    'What simplifications happened in MM Purchasing in S/4 vs ECC?',
    'How does the Manage Purchase Orders Fiori app replace ME21N/ME22N/ME23N?',
  ],
  's4op-sd': [
    'What is Advanced ATP (aATP) in S/4HANA — how does MATP differ from GATP?',
    'How does Transportation Management (TM) embed into S/4HANA — key differences?',
    'Explain Revenue Accounting & Reporting (RAR/IFRS15) setup in S/4HANA SD',
    'Configure Credit Management in S/4HANA using FSCM credit management',
    'What changed in Rebate Management in S/4HANA — BRF+ based conditions?',
  ],
  's4op-pm': [
    'How does Asset Intelligence Network (AIN) integrate with S/4HANA PM?',
    'Configure Work Clearance Management (WCM) permits and work approval',
    'What S/4HANA PM business events can trigger side-by-side BTP extensions?',
    'Set up predictive maintenance scenario using IoT → BTP → S/4HANA PM',
    'Walk me through Equipment 360 Fiori app configuration for PM technicians',
  ],
  's4op-pp': [
    'How does MRP Live work differently from classic ECC MRP batch run?',
    'Configure Demand-Driven MRP (DDMRP) — buffer types, zones, and replenishment',
    'What is S/4HANA Manufacturing Cloud for Production and how does it connect?',
    'Compare pMRP (predictive MRP) with classic MRP — when should I use which?',
    'How do I migrate from ECC Production Orders to S/4HANA with embedded PP?',
  ],
  's4op-rap': [
    'Generate a complete managed RAP BO with draft, Submit action, and determinations for a Z table',
    'How does managed RAP differ from unmanaged — when should I use which?',
    'Write a full CDS projection view with @UI.lineItem, @UI.facets, and @OData.publish:true',
    'Implement a RAP determination to auto-derive description from a code field',
    'How does RAP authorization work — feature control vs authorization checks in behavior impl?',
    'Write a RAP validation that checks mandatory fields and returns error messages',
  ],
  's4op-fiori': [
    'Configure Business Roles and Business Catalogs for a new Fiori app in S/4HANA',
    'How does SAP Fiori Launchpad 3.0 Spaces/Pages model replace classic Groups?',
    'Walk me through Adapt UI — how does a Key User add a custom field to a Fiori app?',
    'Create a custom Fiori tile with a custom target mapping to a Z RAP app',
    'Generate a Fiori Elements List Report app configuration using Fiori Tools (BAS)',
  ],
  's4op-ext': [
    'What are the 4 extensibility tiers in S/4HANA On-Prem and when should I use each?',
    'Implement a new BAdI for a released BAdI definition in SE19 — step by step',
    'What does ATC check for in S/4HANA On-Prem custom code — which check variants?',
    'Configure a side-by-side extension connecting BTP CAP to S/4HANA released API',
    'How does Key User extensibility differ from in-app ABAP extensibility in S/4?',
  ],

  // ── S/4HANA Public Cloud ──────────────────────────────────────────────────
  s4pub: [
    'What is Clean Core — explain all 4 levels and the rules per level',
    'Compare Key User Extension vs Side-by-Side extension — which to use when?',
    'How do Business Events work in S/4HANA Cloud — end-to-end from event to BTP?',
    'Walk me through consuming a released S/4HANA Cloud API in a CAP application',
    'What is the difference between S/4HANA Public Cloud and Private Cloud governance?',
  ],
  's4pub-kue': [
    'How do I add a custom field to the Purchase Order header using Key User Extensibility?',
    'Walk me through creating a Custom Logic script in KUE — syntax, APIs available',
    'Configure a custom workflow for purchase order approval using Key User Workflows',
    'How does Adapt UI work — what can a Key User change and what is locked?',
    'Create a custom analytical query in KUE and expose it to SAP Analytics Cloud',
  ],
  's4pub-side': [
    'Architecture walkthrough: CAP app on BTP CF connecting to S/4 Cloud via released API + events',
    'How do I set up OAuth 2.0 Client Credentials for S/4HANA Cloud API consumption in CAP?',
    'Configure SAP Event Mesh subscription to receive SalesOrder.Created business events',
    'What is Principal Propagation and when do I need it for S/4HANA Cloud extensions?',
    'How does the BTP Destination Service work with Cloud Connector for Private Cloud?',
  ],
  's4pub-api': [
    'List key released APIs for Purchase Orders in S/4HANA Cloud with entity sets',
    'How do I handle $skiptoken pagination for large S/4HANA Cloud OData result sets?',
    'Consume API_BUSINESS_PARTNER in a CPI iFlow — auth, headers, CSRF handling',
    'What is the difference between C1 and C2 classified APIs in SAP API Hub?',
    'How do I test a released S/4HANA Cloud API using API Hub sandbox environment?',
  ],
  's4pub-evts': [
    'What S/4HANA Cloud business events are available out-of-the-box — full list with topics',
    'How do I configure S/4HANA Cloud to publish events to SAP Advanced Event Mesh?',
    'Write a CPI iFlow that subscribes to BusinessPartner.Changed via AMQP adapter',
    'What is the CloudEvents 1.0 envelope structure for S/4HANA business events?',
    'How do I filter business events by specific business conditions before processing?',
  ],

  // ── S/4HANA Private Cloud ─────────────────────────────────────────────────
  s4pc: [
    'What are the key differences between S/4HANA Private Cloud and Public Cloud?',
    'How does SAP manage the Basis layer in Private Cloud — what does the customer control?',
    'What ABAP development is allowed in S/4HANA Private Cloud vs restricted in Public Cloud?',
    'Configure Cloud Connector to connect Private Cloud S/4HANA to BTP services',
    'What is the recommended upgrade cycle and approach for S/4HANA Private Cloud?',
  ],
  's4pc-ext': [
    'What is allowed in S/4HANA Private Cloud extensibility — BAdI, Z-tables, modifications?',
    'How does ATC enforce clean core compliance in S/4HANA Private Cloud?',
    'Configure a BAdI implementation for a released BAdI spot in S/4HANA Private Cloud',
    'When should I choose side-by-side BTP extension over in-system BAdI in Private Cloud?',
    'What are the upgrade risks of custom code in S/4HANA Private Cloud?',
  ],
  's4pc-ops': [
    'What operations can I perform via Cloud Control Center (CCC) in S/4HANA Private Cloud?',
    'How do I use gCTS (Git-based CTS) for transport management in S/4HANA Private Cloud?',
    'Configure SAP for Me monitoring dashboards and alerts for Private Cloud system health',
    'What is the process for requesting system refresh (copy) in S/4HANA Private Cloud?',
    'How does restricted Basis access work — what cannot be done without SAP support?',
  ],
  's4pc-intg': [
    'Full setup: Cloud Connector → BTP Destination → CPI iFlow for S/4HANA Private Cloud',
    'Configure OAuth 2.0 with Principal Propagation between BTP and S/4HANA Private Cloud',
    'Set up SAP Event Mesh subscription for business events from S/4HANA Private Cloud',
    'How does CAP Remote Service work to consume S/4HANA Private Cloud OData APIs?',
    'Configure the Destination Service in BTP for S/4HANA RFC (via Cloud Connector) and HTTP',
  ],

  // ── SuccessFactors ────────────────────────────────────────────────────────
  sf: [
    'How does SuccessFactors Employee Central integrate with SAP S/4HANA Payroll via CPI?',
    'What is the difference between OData V2, OData V4, and SFAPI (Compound Employee) in SF?',
    'Walk me through configuring OAuth 2.0 SAML Bearer assertion for SuccessFactors API access',
    'How do SAP Integration Suite pre-packaged content packages for SF work?',
    'What is the SAP Master Data Integration (MDI) role in SuccessFactors + S/4 integration?',
  ],
  'sf-ec': [
    'What OData V2 entities do I need to read comprehensive employee data from Employee Central?',
    'How does MDF (Metadata Framework) work — create a custom object with association to Employee',
    'Configure Position Management in EC — how does it relate to Organizational Management?',
    'How does Time Off work in EC — leave types, accrual rules, time account structure',
    'Write a CPI iFlow to replicate EC new hires to S/4HANA as HR master (IDoc HRMD_A)',
  ],
  'sf-rcm': [
    'Walk me through the full Recruiting cycle in SF — from job req to hire decision',
    'How do I configure Candidate Relationship Management (CRM) sourcing in SF RCM?',
    'How does RCM hand-off to Onboarding work — what data flows between them?',
    'Write an API query to read JobRequisition and Candidate Application data in OData V2',
    'Configure interview assessment forms and routing maps in SF Recruiting',
  ],
  'sf-lms': [
    'How do I structure a Curriculum in SF LMS with prerequisites and completion rules?',
    'Configure SCORM 2004 content upload and tracking in SF LMS',
    'How does Skills integration work between EC Skills and LMS learning recommendations?',
    'Write an API call to query LMS learning completions for a user using OData V2',
    'Set up compliance training with automated assignment and escalation rules in LMS',
  ],
  'sf-pm': [
    'Walk me through configuring a Performance Review Form in SF PM — form templates, routes',
    'How does the goal plan cascade work in SF Goal Management — top-down alignment',
    'Configure calibration session with distribution curve and ratings in SF PM',
    'How does Continuous Performance Management (CPM) differ from annual review in SF?',
    'Set up 360 multi-rater feedback with external rater invitations in SF',
  ],
  'sf-comp': [
    'Walk me through a compensation planning worksheet setup — merit matrix, budget, guidelines',
    'Configure eligibility rules for compensation planning — who sees what in the worksheet',
    'How does Long-Term Incentive (LTI) planning work in SF Compensation?',
    'Set up compensation statement generation — template, fields, distribution to employees',
    'How does proration work in compensation when an employee changes jobs mid-cycle?',
  ],
  'sf-api': [
    'OData V2 query to read PerPersonal, EmpEmployment, EmpJob for active employees',
    'What is the Compound Employee SFAPI — when is it better than OData V2?',
    'How does OAuth 2.0 SAML Bearer authentication work for SF API — full token flow',
    'Write a CPI Groovy script to call SF OData V2 delta query and extract changed employees',
    'How do I handle pagination (@nextLink) in SF OData V4 queries?',
    'Configure Integration Center in SF to push data to an external SFTP endpoint',
  ],

  // ── Ariba ─────────────────────────────────────────────────────────────────
  ariba: [
    'How does Ariba Network connect to S/4HANA — cXML vs Open API vs ACI?',
    'Walk me through OAuth 2.0 token flow for SAP Ariba Open API',
    'What CPI pre-packaged content exists for Ariba to S/4HANA integration?',
    'How does Guided Buying connect to the Ariba Procurement core?',
    'What is the Ariba Cloud Integration Gateway (CIG) and when is it used?',
  ],
  'ariba-proc': [
    'Walk me through full P2P flow in Ariba: PR → PO → Order Confirmation → Invoice',
    'How does cXML PurchaseOrderRequest work between Ariba Network and supplier systems?',
    'Configure 3-way match in Ariba — PO, receipt, and invoice reconciliation rules',
    'Write a CPI iFlow to receive Ariba PO confirmation and update S/4HANA via API',
    'How does catalog management work in Ariba Buying — punch-out catalogs, cXML',
  ],
  'ariba-cntrt': [
    'Walk me through creating a Contract Workspace in Ariba with approval workflow',
    'How does Contract Compliance work — spending against contract limits and alerts',
    'Configure Ariba contract → S/4HANA Outline Agreement replication via CPI',
    'What are the contract milestone triggers and automated notifications in Ariba?',
    'How does the Clause Library work in Ariba for legal template management?',
  ],
  'ariba-sup': [
    'Walk me through supplier onboarding in Ariba SLP — qualification, registration, approval',
    'How does supplier risk assessment work in Ariba SIM — scoring and monitoring?',
    'Configure supplier scorecard in Ariba with KPIs and automated data feeds',
    'How does supplier master sync work between Ariba SLP and S/4HANA Business Partner?',
    'Set up Ariba supplier certificate management with expiry notifications',
  ],
  'ariba-api': [
    'How do I get an OAuth 2.0 access token for SAP Ariba Open API — full request',
    'Query Ariba Procurement API to fetch purchase orders with line item details',
    'Write a CPI iFlow to poll Ariba Analytical Reporting API for spend data',
    'What is the difference between Ariba Open API and Ariba Network cXML integration?',
    'How do I configure webhook callbacks in Ariba Open API for event-driven processing?',
  ],

  // ── Others ────────────────────────────────────────────────────────────────
  others: [
    'How does SAP Master Data Integration (MDI) sync Business Partner across cloud systems?',
    'Compare SAP Concur integration options — direct CPI vs Dell Boomi vs SAP Add-on',
    'What is SAP IBP and how does CIF connect it to S/4HANA for supply planning data?',
    'How does SAP GRC Access Control integrate with S/4HANA for SoD analysis?',
    'Walk me through SAP BW/4HANA ODP extraction from S/4HANA with delta handling',
  ],
  'oth-concur': [
    'How do I configure Concur Expense → S/4HANA FI journal entry posting via CPI?',
    'Walk me through OAuth 2.0 Company Token vs User Token flow in SAP Concur API',
    'What Concur API endpoints are needed for expense report extract and status update?',
    'How does Concur Travel booking integrate with S/4HANA cost center validation?',
    'Configure company card feed processing in Concur with automatic expense report creation',
  ],
  'oth-mdi': [
    'How does SAP MDI replicate Business Partner from S/4HANA to SuccessFactors and Ariba?',
    'What is the SAP One Domain Model (ODM) — key entities and their canonical structure',
    'Configure MDI tenant and set up replication flow for Customer master',
    'How does delta replication work in MDI — what triggers a change event?',
    'Walk me through MDI error monitoring and reprocessing failed replications',
  ],
  'oth-mdg': [
    'What is the difference between MDG on S/4HANA vs standalone MDG vs SAP MDI?',
    'Configure a Business Partner change request workflow in MDG with approval steps',
    'How does MDG consolidation work — match-and-merge for duplicate Business Partners?',
    'Set up MDG replication to ECC systems using ALE/IDoc after governance approval',
    'Walk me through MDG custom object setup using the MDG framework (MDGIMG)',
  ],
  'oth-dms': [
    'How do I create a Document Info Record (DIR) linked to an equipment master in DMS?',
    'Configure Content Server for SAP DMS — connection settings and HTTP Content Server',
    'How does DMS Archive Link work for storing documents attached to SAP objects?',
    'Set up classification for DMS document types — characteristics and class assignment',
    'Write ABAP to create a DIR and attach a file using cv01n BAPI equivalent',
  ],
  'oth-ibp': [
    'How does CIF (Core Interface) connect S/4HANA with SAP IBP for supply data transfer?',
    'Walk me through IBP Demand Planning setup — statistical forecasting and consensus plan',
    'How does S&OP process work in IBP — volume planning vs value planning alignment',
    'Configure IBP Inventory Optimization — what data does it need from S/4HANA?',
    'How does the IBP Excel add-in work — connecting to IBP and editing planning data?',
  ],
  'oth-bw': [
    'How does ODP (Operational Data Provisioning) extraction from S/4HANA to BW/4 work?',
    'Explain aDSO in BW/4HANA — how does it replace classic DSO and InfoCube?',
    'Configure an SLT (SAP Landscape Transformation) replication from S/4HANA to BW/4',
    'Build a CompositeProvider in BW/4HANA combining multiple aDSOs with union/join',
    'How does BW/4HANA live access to HANA Calculation Views work in BEx queries?',
  ],
  'oth-grc': [
    'How do I set up RFC connectors from GRC to S/4HANA for SoD rule sync?',
    'Configure Firefighter access in GRC AC — role assignment, log review workflow',
    'Walk me through SoD conflict analysis — ruleset, functions, risk levels, mitigation',
    'How does GRC role certification work — periodic review campaigns and approvals?',
    'Configure MSMP workflow in GRC for access request approval routing',
  ],

  // ── BTP ───────────────────────────────────────────────────────────────────
  btp: [
    'What BTP services are needed for a side-by-side extension on S/4HANA Cloud?',
    'Explain BTP subaccount structure — global account, directories, subaccounts, spaces',
    'Compare Cloud Foundry vs Kyma runtime — when to use which on BTP?',
    'How does XSUAA work for authentication in BTP apps — JWT flow explained',
    'What is the BTP Connectivity Service and Cloud Connector — how do they work together?',
  ],
  intgsuite: [
    'Compare CPI vs MuleSoft vs Dell Boomi — when is SAP Integration Suite the right choice?',
    'Walk me through creating a new CPI tenant and first iFlow deployment',
    'How does API Management connect to Cloud Integration — when do you need both?',
    'What are the SAP Integration Suite pre-packaged content packages for S/4HANA?',
    'How does Event Mesh fit into an event-driven integration architecture with CPI?',
  ],
  'is-cpi': [
    'How do I handle CSRF token refresh in the CPI OData V2 receiver adapter?',
    'Write a Groovy script to route messages to different receivers based on IDoc message type',
    'Configure dead letter queue with retry count and delay in CPI using AMQP adapter',
    'How does CPI exception subprocess work — when does it trigger vs message retry?',
    'Walk me through configuring OAuth 2.0 Client Credentials in CPI for S/4HANA Cloud API',
    'Write a Groovy script to parse CloudEvent JSON and set exchange properties for routing',
  ],
  'is-apim': [
    'Configure a rate limiting policy (Quota + SpikeArrest) in SAP API Management',
    'How do I validate OAuth 2.0 access tokens in APIM using OAuthV2 policy?',
    'Set up API Products, Apps, and developer portal subscription in API Management',
    'Write an APIM JavaScript policy to transform request headers before backend call',
    'How does API Management connect to an on-premise S/4HANA backend via Cloud Connector?',
    'Configure APIM analytics — what traffic metrics are available out of the box?',
  ],
  'is-em': [
    'Walk me through AMQP adapter configuration in CPI to consume from Event Mesh queue',
    'What is the CloudEvents 1.0 JSON structure for SAP ECC business events?',
    'Parse Event Mesh service key — which fields map to CPI AMQP adapter settings?',
    'How do I configure topic-to-queue subscription in SAP Event Mesh for filtering?',
    'Write a CPI iFlow that consumes CloudEvent from Event Mesh and calls S/4HANA API',
    'How does SAP Advanced Event Mesh differ from SAP Event Mesh — which should I use?',
  ],
  'is-ia': [
    'Walk me through creating a Message Implementation Guideline (MIG) in Integration Advisor',
    'How does the ML mapping proposal work in Integration Advisor — what data does it learn from?',
    'Generate a MAG (Mapping Artifact) from MIG definitions and use it in a CPI iFlow',
    'Configure EDIFACT ORDERS message handling using Integration Advisor MIG/MAG',
    'How does Integration Advisor handle multi-versioning of B2B message standards?',
  ],
  'is-oc': [
    'How do I create a Salesforce connector in Open Connectors and use it in a CPI iFlow?',
    'What is the Virtual Data Resource (VDR) concept in Open Connectors?',
    'Configure a ServiceNow incident connector with OAuth 2.0 authentication in OC',
    'How do Open Connectors webhook subscriptions work for real-time event processing?',
    'Write a CPI iFlow that calls Open Connectors to retrieve HubSpot contacts',
  ],
  'is-tpm': [
    'Walk me through creating a Trading Partner profile and agreement in TPM',
    'How does AS2 transport work in SAP Trading Partner Management for EDI?',
    'Configure EDIFACT INVOIC interchange processing with acknowledgment (CONTRL)',
    'How does TPM integrate with CPI for the actual message processing execution?',
    'Set up ANSI X12 850 Purchase Order mapping using TPM and Integration Advisor',
  ],

  // ── BTP Dev / Runtime ─────────────────────────────────────────────────────
  btpdev: [
    'Compare ABAP Environment vs Cloud Foundry vs Kyma — when to use each runtime?',
    'Walk me through setting up a BTP trial account with CF subaccount and spaces',
    'What is the BTP Destination Service and how does it work with Cloud Connector?',
    'How does XSUAA (JWT) security work for a CAP app on Cloud Foundry?',
    'Configure a CI/CD pipeline for BTP development using SAP Continuous Integration',
  ],
  'dev-abap': [
    'How do I create an ABAP Environment service instance on BTP and connect ADT?',
    'Walk me through creating a RAP BO and exposing it as OData V4 in ABAP Environment',
    'What ATC checks run in ABAP Environment — which clean core rules are enforced?',
    'How does the ABAP Environment differ from S/4HANA On-Prem ABAP development?',
    'Write an ABAP Cloud HTTP client to consume a REST API from BTP ABAP Environment',
  ],
  'dev-cf': [
    'Walk me through deploying a CAP Node.js application to BTP Cloud Foundry',
    'Explain CF service binding — how does VCAP_SERVICES work for HANA Cloud?',
    'How does blue-green deployment work in CF for zero-downtime releases?',
    'Configure CF app environment variables vs service bindings for secrets management',
    'How do I scale a CF application horizontally and configure memory/disk limits?',
  ],
  'dev-kyma': [
    'Walk me through deploying a serverless Function on Kyma with HANA Cloud binding',
    'How does Kyma API Rule work for OAuth2-protected service exposure?',
    'Configure Kyma eventing to subscribe to SAP Event Mesh topics and trigger Functions',
    'What is the difference between Kyma Functions and Deployments — when to use which?',
    'How do I set up Kyma with Helm chart deployment for a production microservice?',
  ],
  'dev-bas': [
    'How do I create a Full Stack Cloud Application dev space in BAS for CAP development?',
    'Walk me through using Fiori Tools Page Map to add an object page to a Fiori app in BAS',
    'How does the BAS Annotation Modeler work for adding @UI annotations to CDS views?',
    'Configure BAS dev space for ABAP development and connect to S/4HANA via ADT',
    'How do I deploy a CAP app directly from BAS to Cloud Foundry?',
  ],

  // ── SAP Build ──────────────────────────────────────────────────────────────
  btpbuild: [
    'What is the difference between SAP Build Process Automation, Build Apps, and Work Zone?',
    'How does SAP Build connect to S/4HANA for approval triggers and data retrieval?',
    'Walk me through a simple BTP Build license entitlement — what plans are needed?',
    'How does Joule AI copilot integrate with SAP Build automation flows?',
    'What citizen developer use cases are best suited for SAP Build vs custom ABAP?',
  ],
  'build-spa': [
    'Build a complete Purchase Order approval workflow in SAP Build SPA with form and routing',
    'How do I configure an unattended RPA bot for automated data entry in S/4HANA GUI?',
    'Set up a Business Rule decision table for approval routing based on amount thresholds',
    'How does SPA API trigger work — configure REST endpoint to start a workflow instance',
    'Walk me through Process Visibility dashboard setup for monitoring active workflow instances',
  ],
  'build-apps': [
    'Walk me through building a web app in SAP Build Apps that reads S/4HANA OData V4',
    'How does the Formula editor in Build Apps work — what functions are available?',
    'Configure OAuth 2.0 authentication for a REST API data source in Build Apps',
    'How do I deploy a Build Apps project to BTP Cloud Foundry as a production web app?',
    'Build a mobile app in SAP Build Apps with offline sync capability',
  ],
  'build-wz': [
    'What is the difference between SAP Build Work Zone Standard and Advanced Edition?',
    'How do I add a Fiori app tile to SAP Build Work Zone from an S/4HANA system?',
    'Configure UI Integration Cards in Work Zone for displaying S/4HANA business data',
    'How does Work Zone Advanced workspace content management work for team collaboration?',
    'Configure a custom business site page in Work Zone Advanced with custom layout',
  ],

  // ── Data & AI ─────────────────────────────────────────────────────────────
  btpdata: [
    'How does HANA Cloud fit into the BTP data landscape — what does it replace?',
    'Walk me through connecting SAP Analytics Cloud to S/4HANA with Live Connection',
    'What is SAP Datasphere and how does it differ from BW/4HANA and HANA Cloud?',
    'How does SAP AI Core work for training and serving custom ML models on BTP?',
    'What is the role of AI Core in the SAP Joule copilot infrastructure?',
  ],
  'data-hana': [
    'What is the HANA Cloud HDI (HANA Deployment Infrastructure) and how does it work?',
    'Write a HANA Calculation View with measures and restricted measures for finance reporting',
    'How does the HANA Cloud Vector Engine work for AI/LLM use cases?',
    'Configure HANA Cloud Data Lake integration for cold storage and analytics',
    'How do I write an AMDP (ABAP Managed DB Procedure) that uses HANA-specific functions?',
  ],
  'data-sac': [
    'How do I create an SAC Story with a bar chart, KPIs, and variance calculations?',
    'Configure SAC Planning model with planning sequences and data actions for writeback',
    'How does SAC live connection to S/4HANA work — what performance considerations?',
    'Build an SAC Analytic Application with dynamic filters and drill-down navigation',
    'Walk me through SAC Smart Predict — train an automated forecasting scenario',
  ],
  'data-ai': [
    'How do I create an AI Core deployment for an LLM model and call it via REST API?',
    'Walk me through the Document Information Extraction (DIE) API — upload invoice and parse',
    'What is the SAP AI Launchpad and how do I use it to monitor model deployments?',
    'How does Business Entity Recognition (BER) work — train a custom entity extraction model',
    'Configure SAP GenAI Hub to use GPT-4o or Claude models via AI Core API',
  ],
  'data-dsp': [
    'What is the Semantic Layer in SAP Datasphere — how do Business Entities work?',
    'Configure a Data Flow in Datasphere to replicate S/4HANA data into local tables',
    'How does Datasphere virtual access work — read S/4HANA data without copying?',
    'Connect SAP Analytics Cloud to Datasphere for story-based reporting',
    'Walk me through SAP Business Content deployment in Datasphere for a specific LoB',
  ],

  // ── ABAP Development ──────────────────────────────────────────────────────
  abap: [
    'What are the key differences between classic ABAP, OO-ABAP, and ABAP Cloud?',
    'Generate an ABAP OO class with factory pattern, exception handling, and unit test class',
    'How does ABAP for HANA push-down work — AMDP vs CDS table functions vs OPEN SQL',
    'What is the ABAP Enhancement Framework — explain BAdI, enhancement spots, exits',
    'Walk me through ABAP performance analysis using ST05, SAT, and SM50',
  ],
  'abap-classic': [
    'Generate a classical ALV report with field catalog, layout, and sortable columns',
    'Write an ABAP dialog program with screen, flow logic, PAI/PBO, and AT SELECTION-SCREEN',
    'How does ABAP CALL FUNCTION STARTING NEW TASK work for parallel processing?',
    'Implement a classical BAdI with SE18 definition, SE19 implementation',
    'Write ABAP to use BAPI_TRANSACTION_COMMIT and error handling pattern with rollback',
    'How do I create an ABAP background job with a selection screen variant?',
  ],
  'abap-cloud': [
    'What does ATC check for in ABAP Cloud — which syntax patterns are forbidden?',
    'Write ABAP Cloud code using released API cl_api_purchaseorder_2 to read PO data',
    'How do I call OData V4 APIs from ABAP Cloud using CL_HTTP_DESTINATION_PROVIDER?',
    'Explain C1 vs C2 vs C3 release state — what does each mean for usage in ABAP Cloud?',
    'How does ABAP Cloud unit testing work — CL_ABAP_TESTDOUBLE and test isolation',
    'Generate a full ABAP Cloud class with released API usage, ATC-compliant, with unit test',
  ],
  'abap-hana': [
    'Write an AMDP method using HANA SQL for complex aggregation pushed to database',
    'How does CDS push-down work for analytic views — @Analytics.dataCategory:CUBE',
    'When should I use AMDP vs CDS table function vs ABAP OPEN SQL for HANA optimization?',
    'Generate a CDS table function using HANA-specific SQL functions (SERIES_GENERATE_DATE)',
    'How do I avoid "application-side joins" and push computation to HANA layer?',
  ],
  'abap-enh': [
    'What is the difference between classic BAdI (SE18/SE19) and new Enhancement Spot BAdI?',
    'How do I find all available BAdIs for a specific SAP transaction or program?',
    'Implement a new-style BAdI using enhancement spot definition and implementation class',
    'How do implicit vs explicit enhancement points differ — when are each available?',
    'Write a customer exit implementation for an FM exit (EXIT_SAPMM06E_*) in CMOD',
  ],
  'abap-forms': [
    'Walk me through creating a new Adobe Forms interface and form in SE80 step by step',
    'How do I call an Adobe Form from ABAP and get PDF output — full code example',
    'What is the difference between print program, form interface, and form layout in Adobe Forms?',
    'Convert a SmartForm to Adobe Form — what changes in the ABAP call and structure?',
    'How does form translation work in Adobe Forms for multilingual output?',
  ],

  // ── RAP / OData ───────────────────────────────────────────────────────────
  rap: [
    'Generate a complete managed RAP BO from scratch: CDS views → BDEF → behavior impl',
    'When should I use managed vs unmanaged RAP — key differences in implementation approach',
    'How does RAP draft handling work — activation, discard, and draft lock concepts',
    'Write a RAP action with return parameter and UI feature control',
    'How does EML (Entity Manipulation Language) work — MODIFY ENTITIES and READ ENTITIES',
  ],
  'rap-cds': [
    'Generate a 3-layer CDS stack: basic interface view → composite view → projection view',
    'What annotations are needed for a standard Fiori List Report on a CDS view?',
    'How do CDS associations work — to-one vs to-many, and redirected in projection view',
    'Write a CDS view with @Analytics.dataCategory:DIMENSION and @Analytics.dataCategory:CUBE',
    'What is the difference between DEFINE VIEW ENTITY and DEFINE VIEW in ABAP CDS?',
    'Add @Search.searchable and search help annotation to CDS view for OData search',
  ],
  'rap-bdef': [
    'Generate a full BDEF for managed BO with draft, Create/Update/Delete, and custom action',
    'How does authorization control work in BDEF — authorization master field and checks',
    'Write a projection BDEF that aliases fields and restricts operations from root BDEF',
    'Explain early numbering vs late numbering vs UUID in RAP BDEF — which to use when',
    'How do I define a static feature control in BDEF for conditional field editability?',
  ],
  'rap-impl': [
    'Write a complete behavior implementation class with CREATE, UPDATE, determination, and validation',
    'How do mapped-failed-reported work together in RAP behavior implementation?',
    'Implement a RAP determination that triggers on Create and derives fields from external data',
    'Write a RAP validation with multiple field checks and specific error messages per field',
    'How do I call an external API from within a RAP behavior implementation safely?',
  ],
  'rap-v4': [
    'How do I call an OData V4 draft action (draftActivate) from the Fiori UI?',
    'Write an OData V4 batch request with changesets for multiple entity operations',
    'How does $expand work in OData V4 for nested entities — syntax differences from V2?',
    'Handle OData V4 $skiptoken pagination in a CPI iFlow for large result sets',
    'What is the OData V4 function import vs action — key differences and when to use each?',
  ],

  // ── Fiori / UI5 ───────────────────────────────────────────────────────────
  fiori: [
    'What are the main Fiori Elements app types — when to use List Report vs Object Page vs ALP?',
    'How does Fiori Launchpad routing work — target mappings, semantic objects, and actions',
    'Generate a SAPUI5 app manifest.json with routing, OData V4 model, and i18n setup',
    'What is the Fiori Tools extension in BAS — what generators and editors does it provide?',
    'How do I add a custom action button to a standard SAP Fiori app using extensibility?',
  ],
  'fiori-elem': [
    'Generate a List Report + Object Page app CDS annotation setup with all required @UI annotations',
    'How do I add a custom column to a Fiori Elements List Report table using CDS?',
    'Configure a filter bar with default values and mandatory filters in Fiori Elements',
    'How does Analytical List Page (ALP) differ from List Report — when to use ALP?',
    'Add a bound action button to the Object Page toolbar with confirmation dialog in Fiori Elements',
  ],
  'fiori-ui5': [
    'Generate a SAPUI5 app with OData V4 model, smart table, and SmartFilterBar controls',
    'How does OData V2 Model vs OData V4 Model differ in SAPUI5 — binding syntax changes',
    'Write a SAPUI5 controller that reads OData, applies filters, and updates a model',
    'Configure SAPUI5 app internationalization (i18n) with multiple language files',
    'How do I add a custom fragment with a dialog to a SAPUI5 controller with proper binding?',
  ],
  'fiori-anno': [
    'What @UI annotations are needed for a complete List Report — lineItem, selectionFields, headerInfo',
    'How do @UI.facets work on an Object Page — FieldGroup, CollectionFacet, ReferenceFacet',
    'Add @Semantics, @ObjectModel, and @Search annotations to CDS for smart search functionality',
    'How do I define a @UI.presentationVariant with sorting and grouping in CDS?',
    'Write full CDS annotation set for a Fiori Elements app with KPI header, chart, and form',
  ],
  'fiori-lp': [
    'Walk me through assigning a Fiori app to a Business Role via Business Catalog in S/4HANA',
    'How do I configure a custom target mapping for a Z RAP OData V4 app in the Launchpad?',
    'What is the SPRO path for SAP Fiori Launchpad system configuration in S/4HANA?',
    'How does the Fiori Launchpad 3.0 Spaces/Pages model work — how to migrate from Groups?',
    'Configure app personalization settings — which Launchpad settings apply per user vs globally?',
  ],

  // ── CAP ───────────────────────────────────────────────────────────────────
  cap: [
    'Generate a complete CAP CDS data model with entities, associations, and OData service definition',
    'How does @restrict authorization work in CAP — roles, grants, and where clauses',
    'Write a CAP Node.js custom handler with CDS.tx and proper error handling',
    'Configure CAP remote service to consume S/4HANA OData V2 API with mocking for tests',
    'How does CAP MTX (multitenancy) work — tenant onboarding, schema upgrade, isolation',
    'Walk me through deploying a CAP app to BTP Cloud Foundry with HANA Cloud and XSUAA',
  ],

  // ── Extensibility ─────────────────────────────────────────────────────────
  ext: [
    'Compare all 4 extensibility tiers in S/4HANA — Key User, BAdI, Side-by-Side, Classic Mod',
    'When should I use a Key User Extension vs an in-app BAdI vs a BTP CAP side-by-side app?',
    'How does clean core compliance work — what is Tier 1 extensibility vs Tier 4?',
    'Configure a side-by-side extension using CAP + S/4HANA released API + Event Mesh events',
    'What happens to custom code during S/4HANA upgrades — BAdI vs modification risks?',
  ],

  // ── Workflow ──────────────────────────────────────────────────────────────
  wf: [
    'Build a purchase order approval workflow in SAP Build SPA with amount-based routing',
    'How does classic SAP Workflow (SWDD) differ from S/4HANA Flexible Workflow?',
    'Configure My Inbox (SAP Fiori) to show work items from classic workflow and SPA',
    'How does CPI iFlow orchestration differ from SAP Build SPA workflow — when to use which?',
    'Walk me through S/4HANA Flexible Workflow setup for purchase order approvals (SWDD)',
  ],

  // ── Documentation ─────────────────────────────────────────────────────────
  'doc-sdd': [
    'Generate a full SDD for a CPI integration between Ariba and S/4HANA Purchase Orders',
    'Write the architecture section for a BTP side-by-side extension using CAP and Event Mesh',
    'Create a SDD for SAP ECC PM Notification event enablement using ASANWEE to Event Mesh',
    'Generate a Software Design Document for an SF Employee Central to S/4HANA HR replication',
  ],
  'doc-tech': [
    'Write a technical specification for custom ABAP class that calls S/4HANA API with retry logic',
    'Generate TSPEC for a CPI iFlow: OData V4 read → transform → IDoc send with error handling',
    'Create a technical specification for RAP BO with draft, actions, and determinations',
    'Write a TSPEC for ASANWEE ECC event enablement — tables, FMs, SPRO config, events',
  ],
  'doc-intg': [
    'Generate a full Integration Design Document for S/4HANA PM Notifications to SenSys CMMS',
    'Write an IDD for SuccessFactors Employee Central to SAP ECC HR master replication via CPI',
    'Create an IDD for Ariba PO → S/4HANA PO sync with error handling and retry strategy',
    'Generate IDD for S/4HANA business events (CloudEvents) to Azure Event Hub via CPI',
  ],
  'doc-impl': [
    'Generate an implementation guide for ASANWEE ECC PM event enablement to SAP Event Mesh',
    'Write a phased implementation plan for S/4HANA BTP side-by-side extension project',
    'Create an implementation guide for SAP API Management setup from scratch',
    'Generate implementation guide for CPI OAuth 2.0 configuration for S/4HANA Cloud OData',
  ],
  'doc-step': [
    'Write step-by-step guide for configuring SM59 RFC, STRUST SSL, and SWE2 event linkage in ECC',
    'Create a runbook for CPI iFlow deployment, testing, and monitoring in production',
    'Generate step-by-step procedure for onboarding a new trading partner in SAP TPM',
    'Write a detailed guide for configuring S/4HANA Public Cloud Key User Custom Field end-to-end',
  ],
  'doc-api': [
    'Generate API documentation for a custom CPI REST API endpoint with OAuth 2.0 auth',
    'Write API docs for a custom SAP ABAP OData V4 service including all entities and operations',
    'Create API documentation for an APIM-proxied S/4HANA released API with rate limits',
    'Generate OpenAPI 3.0 spec for a CAP service exposing purchase order data to third parties',
  ],
  'doc-test': [
    'Generate test cases for CPI iFlow: OData read → transform → IDoc send with all failure scenarios',
    'Write a full test plan for S/4HANA RAP BO including unit, integration, and UAT cases',
    'Create test cases for SF Employee Central to ECC HR replication — positive and negative flows',
    'Generate performance test cases for SAP API Management with rate limiting policies',
  ],

  // ── Tools ─────────────────────────────────────────────────────────────────
  codegen: [
    'ABAP class to consume OData V4 API with OAuth, CSRF token handling, and error retry',
    'CPI Groovy: parse CloudEvent JSON, extract business object data, set exchange properties',
    'Complete RAP BDEF for Z_EQUIPMENT with draft, Submit action, and plant determination',
    'CAP CDS model for a purchase request with status management and authorization',
    'SAPUI5 controller to call OData V4 batch request and refresh binding on success',
    'ABAP Cloud class using IF_AMDP_MARKER_HDB for complex aggregation pushed to HANA',
  ],
  txfinder: [
    'Which transactions are used for FI document posting and payment runs?',
    'List all key PM/EAM transactions for notifications and work orders',
    'What are the important RFC and connectivity transactions in Basis?',
    'Which CPI/BTP transactions exist in S/4HANA for integration monitoring?',
  ],
  wizard: [
    'Walk me through full ASANWEE configuration — WE81, WE31, BD64, SWE2, BD52, /ASADEV/ steps',
    'Configure OAuth 2.0 Client Credentials in CPI for S/4HANA Cloud API consumption — all steps',
    'Set up SAP API Management from scratch: API Proxy → Policies → Products → App',
    'Configure Event Mesh queue, topic subscription, and AMQP adapter in CPI end-to-end',
    'Walk me through S/4HANA Principal Propagation setup from BTP to backend system',
  ],
  apiref: [
    'S/4HANA released API for Maintenance Orders with entity sets and key fields (OData V4)',
    'SuccessFactors Employee Central OData V2 endpoints for reading employee data',
    'SAP Event Mesh REST API for publishing events — URL, headers, CloudEvents envelope',
    'Ariba Open API — base URLs, auth endpoints, and key procurement API operations',
    'SAP API Management API Proxy REST interface — how to test and manage proxies via API',
  ],
  spa: [
    'Build a purchase order approval workflow in SAP Build SPA with conditional routing by amount',
    'Configure an unattended RPA bot for automated T-code execution in S/4HANA SAP GUI',
    'How does SPA integrate with S/4HANA using API triggers — full setup walkthrough',
    'Set up a Business Rule with decision table for approval routing logic',
    'Configure Process Visibility for real-time monitoring of active SPA workflow instances',
  ],
};

export const DOC_META = {
  'doc-sdd':  { title:'Software Design Document',        short:'SDD',   color:C.cyan,   icon:'▫', desc:'Full SDD: architecture, components, data models, interfaces, security, deployment.' },
  'doc-tech': { title:'Technical Specification',         short:'TSPEC', color:C.amber,  icon:'▫', desc:'Detailed technical spec with FMs, tables, fields, transactions, code snippets.' },
  'doc-intg': { title:'Integration Design Document',     short:'IDD',   color:C.green,  icon:'▫', desc:'Source/target, payload mapping, adapters, auth, error handling, monitoring.' },
  'doc-impl': { title:'Implementation Guide',            short:'IMPL',  color:C.purple, icon:'▫', desc:'Phased implementation with prerequisites, config, customizing, testing, go-live.' },
  'doc-step': { title:'Step-by-Step Solution Guide',     short:'GUIDE', color:C.yellow, icon:'▫', desc:'Numbered steps with SPRO paths, transaction codes, screenshots pointer, verification.' },
  'doc-api':  { title:'API Documentation',               short:'API',   color:C.pink,   icon:'▫', desc:'Endpoints, methods, payloads, auth, error codes, curl examples, OpenAPI structure.' },
  'doc-test': { title:'Test Plan & Test Cases',          short:'TEST',  color:C.red,    icon:'▫', desc:'Unit, integration, UAT, regression, performance test cases with expected results.' },
};

// ─── MASTER AI SYSTEM PROMPT ──────────────────────────────────────────────────
export const SYSTEM_PROMPT = `You are SAP Sage — the definitive AI assistant for the full SAP ecosystem. You operate as an elite SAP architect, developer, and consultant combined.

LANDSCAPES: SAP ECC 6.0 (all EhPs), S/4HANA On-Premise (1511–2023), S/4HANA Private Cloud, S/4HANA Public Cloud, SuccessFactors (EC/RCM/LMS/PMgmt/Comp), SAP Ariba (Procurement/Contracts/Network), SAP Concur, MDI, MDG, DMS, IBP, BW/4HANA, GRC, SRM, TM, EWM

MODULES: FI (G/L, AP, AR, AA, Bank, New G/L, Doc Splitting, Special Ledger), CO (CostCenters, ProfitCenters, InternalOrders, ProductCosting, CO-PA, Overhead), MM (Purchasing, IM, LIV, WM, Batch, Valuation, Invoice Verification), SD (Orders, Delivery, Billing, Pricing, Credit, Revenue Recognition IFRS15), PP (MRP, ProdOrders, Routings, BOM, Capacity, KANBAN, SFC), PM/EAM (Equipment, FuncLoc, Notifications, WOs, PreventiveMaint, Calibration, MeasPoints), QM (InspLots, QualityNotifs, CtrlCharts, Defect Recording, Audit), PS (WBS, Networks, Milestones, ResourcePlanning, BillingPlans), HCM (PA, Payroll, TM, OM, Recruitment), GRC (AC, PC, RM, GT), RE-FX (IFRS16 Leases)

BTP: Integration Suite (CPI iFlows, Groovy scripts, adapters, mappings, APIM policies, Event Mesh AMQP/REST, Integration Advisor, Open Connectors, TPM), ABAP Environment (ABAP Cloud/RAP, ADT, ATC, released APIs), SAP Build (Process Automation workflows+bots, Build Apps, Work Zone), HANA Cloud, Analytics Cloud, Datasphere, AI Core, Kyma, Cloud Foundry, BAS, IAS, IPS, XSUAA, Cloud Connector, Destination Service

TECHNICAL DEPTH:
- ABAP: Classic, OO, HANA push-down, ABAP Cloud (clean core, C1 APIs only, ATC compliance)
- RAP: CDS Views (basic, composite, consumption, projection), BDEF (managed/unmanaged/abstract/projection), behavior implementation (determinations, validations, actions, feature control), draft handling, OData V4 binding
- Fiori/UI5: Fiori Elements (ListReport, ObjectPage, ALP, Worklist, OP), SAPUI5 controls, CDS annotations (UI, Search, OData), Launchpad config, custom Fiori apps
- CAP: CDS data models, Node.js/Java services, @restrict authorization, HANA Cloud, MTX (multitenancy), remote service consumption, feature toggles, audit log
- Extensibility: Key User (Adapt UI, custom fields/logic/apps), In-App (BAdI, ABAP Cloud), Side-by-Side (BTP CAP + released APIs + business events), Classic ECC (modifications, user exits, customer exits, enhancement spots)
- Integration: CloudEvents 1.0, AMQP 1.0, OAuth 2.0, SAML 2.0, mTLS, JWT, Principal Propagation, SNC, CSRF token handling, OData V2/V4 pagination, batch requests, delta queries
- SPA: Workflow forms, automation bots (attended/unattended), business rules engine, decision tables, triggers (API/event/schedule), monitoring dashboards

BEHAVIOR RULES:
1. COMPLETE answers only — no "refer to SAP documentation" without first answering fully
2. Include [Tx: XXXX] for every transaction mentioned, exact table/field/FM names
3. Include full SPRO paths for configuration steps
4. Generate working, production-ready code with error handling
5. State landscape/version where behavior differs (ECC ≠ S/4 ≠ Cloud)
6. S/4HANA Public Cloud: released APIs only — no modifications, clean core strictly
7. For integration scenarios: specify adapter type, channel settings, auth method, error strategy
8. For documentation requests: produce fully-structured professional documents with all sections complete
9. Be an expert peer — technically precise, no filler, no hedging`;
