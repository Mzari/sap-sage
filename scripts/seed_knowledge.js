const fetch = require('node-fetch');
const BACKEND = 'https://sap-sage-production.up.railway.app';

const articles = [
  // Topic 1 — CPI iFlow
  { topic: 'SAP Cloud Integration CPI iFlow configuration', content: 'Troubleshooting Sender/Receiver Systems: Guidance on configuring and troubleshooting CPI iFlow sender and receiver adapters', sourceUrl: 'https://help.sap.com/docs/SAP_INTEGRATION_SUITE/51ab953548be4459bfe8539ecaeee98d/c5c83285229f49abbbdeda6e81b23975.html' },
  { topic: 'SAP Cloud Integration CPI iFlow configuration', content: 'SAP Cloud Platform Integration Setup: Step-by-step iFlow configuration and deployment guide', sourceUrl: 'https://help.sap.com/docs/SAP_SOL_SALES_CONFIG_OD/288c62ae365b453eae46105fee01d106/42ce1250912f48f69cdb29b66a0c8517.html' },
  { topic: 'SAP Cloud Integration CPI iFlow configuration', content: 'CI How-to-Guides: Comprehensive how-to guides for SAP Cloud Integration iFlow development', sourceUrl: 'https://help.sap.com/docs/SUPPORT_CONTENT/sci/3361897749.html' },
  // Topic 2 — Groovy
  { topic: 'CPI Groovy script error handling', content: 'Groovy Script in CPI: Using Groovy scripts in SAP Cloud Integration for message transformation and error handling', sourceUrl: 'https://help.sap.com/docs/CLOUD_INTEGRATION/368c481cd6954bdfa5d0435479fd4eaf/fa29f02c19e744528b50fd721959f337.html' },
  { topic: 'CPI Groovy script error handling', content: 'Task Scripting: Advanced Groovy scripting features for automation and error processing in integration flows', sourceUrl: 'https://help.sap.com/docs/SAP_COMMERCE/d0224eca81e249cb821f2cdf45a82ace/8c6d50b586691014a30a8c6f26f1ba95.html' },
  { topic: 'CPI Groovy script error handling', content: 'Cronjob Scripts Advanced Features: Advanced scripting patterns including exception handling and retry logic', sourceUrl: 'https://help.sap.com/docs/SAP_COMMERCE/d0224eca81e249cb821f2cdf45a82ace/a7aafddfc50b41ca90c417e5d1ef7efc.html' },
  // Topic 3 — API Management
  { topic: 'SAP API Management policy configuration', content: 'Different Methods of Creating an API Proxy: Guide to creating and configuring API proxies with policies in SAP API Management', sourceUrl: 'https://help.sap.com/docs/SAP_CLOUD_PLATFORM_API_MANAGEMENT/66d066d903c2473f81ec33acfe2ccdb4/4ac0431ddc80469ca31dcd938edc9076.html' },
  { topic: 'SAP API Management policy configuration', content: 'Enabling and Configuring SAP Cloud Integration API Management: Integration between CPI and API Management for policy enforcement', sourceUrl: 'https://help.sap.com/docs/SAP_MARKETING_CLOUD/960b3068814b48b58764704bd2573efe/d5a2c8fcea5645058e13b0cd39d2abac.html' },
  { topic: 'SAP API Management policy configuration', content: 'User Guide API Management On-Premise: Complete user guide for configuring API Management policies on-premise', sourceUrl: 'https://help.sap.com/docs/SAP_CLOUD_PLATFORM_API_MANAGEMENT/66d066d903c2473f81ec33acfe2ccdb4/4876b83e7b514a40a66adfe96db17b2d.html' },
  // Topic 4 — Event Mesh
  { topic: 'SAP Event Mesh topic configuration', content: 'Queue Subscriptions ABAP Cloud: Configuring queue subscriptions and topic bindings in SAP Event Mesh for ABAP Cloud', sourceUrl: 'https://help.sap.com/docs/ABAP_Cloud/eede1416d18c436e8810eaaeb20c38ae/dbb4da01c421460fbafc97521f753424.html' },
  { topic: 'SAP Event Mesh topic configuration', content: 'Queue Subscriptions SAP Marketing Cloud: Event Mesh queue and topic configuration for Marketing Cloud integration', sourceUrl: 'https://help.sap.com/docs/SAP_MARKETING_CLOUD/e0cd7c1ecf3d4f2f9feb46ec1c5b68fb/e859a1494f6d46748972377c93ee8705.html' },
  { topic: 'SAP Event Mesh topic configuration', content: 'SAP Event Mesh Topic Patterns: Wildcard topic subscriptions and queue binding configuration', sourceUrl: 'https://help.sap.com/docs/SAP_EM/bf82e6b26456494cbdd197057c09979a/d0e4a7d8c6d24dc7b4b4e33ab48de95a.html' },
  // Topic 5 — OData V4
  { topic: 'S/4HANA OData V4 released APIs', content: 'Architecture Overview for Data Integration: S/4HANA OData V4 API architecture and released API catalog for integrations', sourceUrl: 'https://help.sap.com/docs/SAP_S4HANA_CLOUD/0f69f8fb28ac4bf48d2b57b9637e81fa/36b7901040cb4c18b557ca9cc90a7002.html' },
  { topic: 'S/4HANA OData V4 released APIs', content: 'OData API Service Quotation A2X: Released OData V4 API for service quotation in S/4HANA', sourceUrl: 'https://help.sap.com/docs/SAP_S4HANA_ON-PREMISE/f5d3e1005efd4e86acf9a65abf428082/9e42cc1f90ba485789ee752b7aa7be71.html' },
  { topic: 'S/4HANA OData V4 released APIs', content: 'Support for OData V4 APIs in Integration Scenarios: Using OData V4 released APIs in SAP Integration Suite scenarios', sourceUrl: 'https://help.sap.com/docs/SAP_S4HANA_CLOUD/0f69f8fb28ac4bf48d2b57b9637e81fa/a765c5f3fa3a4b3eb4a3d7b6399bf79e.html' },
  // Topic 6 — RAP BDEF
  { topic: 'SAP RAP BDEF behavior definition', content: 'ABAP RESTful Application Programming Model: Core RAP concepts including behavior definition (BDEF) syntax and implementation', sourceUrl: 'https://help.sap.com/docs/ABAP_PLATFORM_NEW/4726775c8bfc483abb210252604515b2/26719252952547dfa76bc53d7a8ddf71.html' },
  { topic: 'SAP RAP BDEF behavior definition', content: 'Creating Behavior Definition Extensions: How to create BDEF extensions for RAP business objects with actions and validations', sourceUrl: 'https://help.sap.com/docs/ABAP_Cloud/f055b8bf582d4f34b91da667bc1fcce6/4a8e5e2e51424b86b83c02c5e9d5e1c6.html' },
  { topic: 'SAP RAP BDEF behavior definition', content: 'App Extensibility Manage Reload Requests: RAP behavior definition patterns for extensibility use cases', sourceUrl: 'https://help.sap.com/docs/SAP_S4HANA_ON-PREMISE/e322becd165844e5868e590bc8efafaf/90aa679971b1481a8cb3757e1e58259b.html' },
  // Topic 7 — RAP Draft
  { topic: 'SAP RAP draft handling', content: 'Draft Handling in RAP: Complete guide to implementing draft handling in ABAP RAP business objects including activate and discard', sourceUrl: 'https://help.sap.com/docs/ABAP_Cloud/f055b8bf582d4f34b91da667bc1fcce6/6482f0c5d91a48429cf09c2ae50ed1f9.html' },
  { topic: 'SAP RAP draft handling', content: 'Unmanaged Implementation Type: Draft handling patterns for unmanaged RAP business objects', sourceUrl: 'https://help.sap.com/docs/ABAP_Cloud/f055b8bf582d4f34b91da667bc1fcce6/e11757cf7e664121b9f583e7ca0eeb39.html' },
  { topic: 'SAP RAP draft handling', content: 'Additional Implementation Options: Advanced RAP draft implementation options including side effects and validations', sourceUrl: 'https://help.sap.com/docs/ABAP_Cloud/f055b8bf582d4f34b91da667bc1fcce6/a1e342d2344848a8a83c67ceef55d01c.html' },
  // Topic 8 — Clean Core
  { topic: 'ABAP Clean Core guidelines', content: 'Clean Core Extensibility and ABAP-Based Extensions: Guidelines for clean core ABAP development on S/4HANA avoiding non-released APIs', sourceUrl: 'https://help.sap.com/docs/ABAP_Cloud/bfed5a0f77a2488990788127f9271d15/8725888e48964d1d91e8daa476646338.html' },
  { topic: 'ABAP Clean Core guidelines', content: 'Tier-1 Tier-2 Tier-3 ABAP extensibility levels: Three-tier extensibility model for clean core compliant development', sourceUrl: 'https://help.sap.com/docs/ABAP_Cloud/bfed5a0f77a2488990788127f9271d15/a410b5fb5b2443bab8f4f9e4f78a4bce.html' },
  { topic: 'ABAP Clean Core guidelines', content: 'Released ABAP APIs for Cloud Development: List of released ABAP APIs safe to use in clean core extensions', sourceUrl: 'https://help.sap.com/docs/ABAP_Platform_Cloud/b5670aaaa2364a29935f40b16499972d/7b077b3a45454bfd9b77e3e7e2d0c8e5.html' },
  // Topic 9 — Cloud Connector
  { topic: 'SAP BTP Connectivity Service Cloud Connector', content: 'Integrating On-Premise Systems S/4HANA Cloud: Configuring Cloud Connector and BTP Connectivity Service for on-premise connectivity', sourceUrl: 'https://help.sap.com/docs/SAP_S4HANA_CLOUD/0f69f8fb28ac4bf48d2b57b9637e81fa/82c9f05663594e5db8f923f6f88ae9bd.html' },
  { topic: 'SAP BTP Connectivity Service Cloud Connector', content: 'Integrating On-Premise Systems IBP: Cloud Connector setup for SAP IBP integration with on-premise systems', sourceUrl: 'https://help.sap.com/docs/SAP_INTEGRATED_BUSINESS_PLANNING/feae3cea3cc549aaa9d9de7d363a83e6/0ba15be350994915b9786684b8163968.html' },
  { topic: 'SAP BTP Connectivity Service Cloud Connector', content: 'Cloud Connector Installation and Configuration: Step-by-step guide for installing and configuring SAP Cloud Connector', sourceUrl: 'https://help.sap.com/docs/CP_CONNECTIVITY/cca91383641e40ffbe03bdc78f00f681/e54cc8fbbb571014beb5caaf6aa31280.html' },
  // Topic 10 — ASANWEE
  { topic: 'SAP ECC PM Plant Maintenance ASANWEE configuration', content: 'Feature Package 4 April 2022 ASANWEE: SAP Netweaver Add-on for Event Enablement (ASANWEE) configuration for PM notifications', sourceUrl: 'https://help.sap.com/docs/SAP_NETWEAVER_ADDON_EVENT_ENABLEMENT/e966e6c0e61443ebaa0270a4bae4b363/1b7af8e68c0b4526ae9dda4906fdc11d.html' },
  { topic: 'SAP ECC PM Plant Maintenance ASANWEE configuration', content: 'Installation and baseline configuration of Integration Add-On: ASANWEE add-on installation steps for enabling business events in ECC', sourceUrl: 'https://help.sap.com/docs/SAP_FIELDGLASS_INTEGRATION_ADDON/e745d2cc4d114bbf92d2eea49eda9af4/924dc81918064dd3bf4eeb941b1d884b.html' },
  { topic: 'SAP ECC PM Plant Maintenance ASANWEE configuration', content: 'SAP Plant Maintenance Event Integration: Outbound event configuration for PM notifications using ASANWEE', sourceUrl: 'https://help.sap.com/docs/SAP_NETWEAVER_ADDON_EVENT_ENABLEMENT/e966e6c0e61443ebaa0270a4bae4b363/9d4f1e73a9b344a7b9ae23e5cbba57f3.html' },
  // Topic 11 — IDoc
  { topic: 'SAP ECC IDoc configuration partner profile', content: 'IDoc Partner Profile Configuration WE20: Setting up partner profiles for IDoc outbound and inbound processing in SAP ECC', sourceUrl: 'https://help.sap.com/docs/SAP_ERP/745e3a5f467d49dbb067b3a81d5f819e/6d02c453f57eb44ce10000000a174cb4.html' },
  { topic: 'SAP ECC IDoc configuration partner profile', content: 'IDoc Port Definition WE21: Configuring IDoc ports for file, TRFC, and HTTP-based message exchange', sourceUrl: 'https://help.sap.com/docs/SAP_ERP/745e3a5f467d49dbb067b3a81d5f819e/6a02c453f57eb44ce10000000a174cb4.html' },
  { topic: 'SAP ECC IDoc configuration partner profile', content: 'IDoc Monitoring and Error Handling BD87: Monitoring IDoc status and reprocessing failed IDocs in SAP ECC', sourceUrl: 'https://help.sap.com/docs/SUPPORT_CONTENT/abapconn/3360968026.html' },
  // Topic 12 — SuccessFactors
  { topic: 'SAP SuccessFactors OData API authentication', content: 'Create HTTP Destination in SAP BTP: Setting up OAuth2 destinations for SuccessFactors OData API authentication', sourceUrl: 'https://help.sap.com/docs/SMI_ESS/9bac2e2c79854514a9644e08e016dbed/e02a9dc02f0a442795a244a6ca64a6ad.html' },
  { topic: 'SAP SuccessFactors OData API authentication', content: 'Setting Up Connection with Recruiting System: OAuth2 SAML bearer assertion setup for SuccessFactors API connectivity', sourceUrl: 'https://help.sap.com/docs/CPS/35ebffbe6fd446f5aa893d68f8e71fd6/00f2b803fc8947d5aad39e0ca61a85af.html' },
  { topic: 'SAP SuccessFactors OData API authentication', content: 'SuccessFactors OAuth2 SAML Bearer Token: Technical guide for generating SAML bearer assertions for SF API calls', sourceUrl: 'https://help.sap.com/docs/SAP_SUCCESSFACTORS_PLATFORM/d599f15995d348a1b45ba5603e2aba9b/2a4ce5b6f5a14e74ae97cb5fe9b85729.html' },
  // Topic 13 — Ariba
  { topic: 'SAP Ariba procurement integration API', content: 'Data Flow for Supplier Data via SOAP Web Service APIs: SAP Ariba supplier integration using SOAP and REST APIs', sourceUrl: 'https://help.sap.com/docs/ARIBA_SOURCING/eb12a8256a244b86be23c9b4e4e751da/33c5c2c4d21a4160840975364c50ec96.html' },
  { topic: 'SAP Ariba procurement integration API', content: 'Network and Communication Security SAP Ariba: Security configuration for Ariba API integration including OAuth and certificates', sourceUrl: 'https://help.sap.com/docs/SAP_PROCUREMENT_PLANNING/aad8ff6e4e0c404591864a751c877d34/dd9894cb39cf4ba99e815220276bbde0.html' },
  { topic: 'SAP Ariba procurement integration API', content: 'Integrating SAP Ariba with SAP Fieldglass Using Open APIs: Cross-product integration between Ariba procurement and Fieldglass', sourceUrl: 'https://help.sap.com/docs/SAP_ARIBA/5036fc5b4be14f27b61f7a2424a58e1c/3c1c48e3f94543dbbff5a3b4a7c3b4a2.html' },
  // Topic 14 — CAP
  { topic: 'SAP CAP Node.js service development', content: 'Developing Node.js in Cloud Foundry Environment: Building CAP Node.js services for BTP Cloud Foundry deployment', sourceUrl: 'https://help.sap.com/docs/BTP/65de2977205c403bbc107264b8eccf4b/3a7a0bece0d044eca59495965d8a0237.html' },
  { topic: 'SAP CAP Node.js service development', content: 'Node.js-Based Development Environment: Setting up local CAP Node.js development environment with CDS CLI', sourceUrl: 'https://help.sap.com/docs/SAPUI5/27c345764bb244f982d5a079f556e564/ee8726adfdb34d748ed199f0275472f8.html' },
  { topic: 'SAP CAP Node.js service development', content: 'CAP Service Definitions and OData: Defining CDS service models that expose OData endpoints in CAP Node.js', sourceUrl: 'https://help.sap.com/docs/BTP/65de2977205c403bbc107264b8eccf4b/7a3e39622be14413b2a4df6c95f082a3.html' },
  // Topic 15 — HANA Cloud
  { topic: 'SAP HANA Cloud database connection', content: 'SAP HANA Cloud User Connections to Data Lake: Connecting to SAP HANA Cloud and Data Lake from external applications', sourceUrl: 'https://help.sap.com/docs/SAP_HANA_DATA_LAKE_CN/2ef9467a7efb466992cec0904fef137c/c87622a7c7a54f32be816faa3b64fa0f.html' },
  { topic: 'SAP HANA Cloud database connection', content: 'X509 Authentication for HANA Cloud Data Lake: Certificate-based authentication for secure HANA Cloud connections', sourceUrl: 'https://help.sap.com/docs/SAP_DATA_SERVICES/393d108220154dd6b2c1259a467ed6f8/fcdca7a9d64244ddb4240e808e89ff3b.html' },
  { topic: 'SAP HANA Cloud database connection', content: 'HANA Cloud Hybrid Landscape: Connecting HANA Cloud to on-premise SAP systems in hybrid integration scenarios', sourceUrl: 'https://help.sap.com/docs/SAP_HANA_CLOUD/db19c7071dc5496dbccec8bf9d9a6f5a/ca19bfa68c7e4c04b4a4cae7d79c7b7c.html' },
  // Topic 16 — Fiori Elements
  { topic: 'SAP Fiori Elements list report annotations', content: 'Developing Apps with SAP Fiori Elements: Building list report and object page apps using Fiori Elements framework and CDS annotations', sourceUrl: 'https://help.sap.com/docs/SAPUI5/285985e9cf204697aee91214fc19d95c/03265b0408e2432c9571d6b3feb6b1fd.html' },
  { topic: 'SAP Fiori Elements list report annotations', content: 'Defining CDS Annotations for Metadata-Driven UIs: Using UI.SelectionFields, UI.LineItem and other annotations for Fiori Elements', sourceUrl: 'https://help.sap.com/docs/ABAP_PLATFORM_NEW/fc4c71aa50014fd1b43721701471913d/9b4aa865c1e84634b6e105173fc3a5e7.html' },
  { topic: 'SAP Fiori Elements list report annotations', content: 'Extension Points for Tables in Fiori Elements: Customizing Fiori Elements list reports using extension points and building blocks', sourceUrl: 'https://help.sap.com/docs/SAPUI5/285985e9cf204697aee91214fc19d95c/d525522c1bf54672ae4e02d66b38bf65.html' },
  // Topic 17 — BTP Auth
  { topic: 'SAP BTP Authorization Trust Management', content: 'User Authentication and Authorizations BTP: Setting up XSUAA, role collections and trust configuration in SAP BTP', sourceUrl: 'https://help.sap.com/docs/SMI_ESS/9bbf2d839a9b42ebbd0d62e2733fcc4b/07ce0047d8ea4a38891c9fc6ebecd7c1.html' },
  { topic: 'SAP BTP Authorization Trust Management', content: 'Integrating SAP Authorization and Trust Management with Identity Provisioning: IDP trust setup and SAML configuration for BTP', sourceUrl: 'https://help.sap.com/docs/SAP_S4HANA_CLOUD/53e36b5493804bcdb3f6f14de8b487dd/615dd6d274084708a6cecabbe58de6f9.html' },
  { topic: 'SAP BTP Authorization Trust Management', content: 'SAP BTP Security Recommendations: Security hardening guide for BTP subaccounts including XSUAA and trust configuration', sourceUrl: 'https://help.sap.com/docs/BTP/c8a9bb59fe624f0981efa0eff2497d7d/e129aa20c78c4a9fb379b9803b02e5f6.html' },
  // Topic 18 — Business Events
  { topic: 'S/4HANA Business Events outbound configuration', content: 'Business Event Handling S/4HANA: Configuring outbound business events in S/4HANA for event-driven integration', sourceUrl: 'https://help.sap.com/docs/SAP_S4HANA_ON-PREMISE/8308e6d301d54584a33cd04a9861bc52/18658e70de3043cf894e41c38538f488.html' },
  { topic: 'S/4HANA Business Events outbound configuration', content: 'Integration with S/4HANA via SAP Cloud Integration: Connecting S/4HANA business events to CPI for event-driven processing', sourceUrl: 'https://help.sap.com/docs/SAP_CUSTOMER_DATA_PLATFORM/8b7bed724cb94ae68065fdac8c4350db/a808e97e499b4e5983568d7b1d5ba343.html' },
  { topic: 'S/4HANA Business Events outbound configuration', content: 'BEANA Business Event Outbound Channel: SPRO configuration path for enabling business event publishing in S/4HANA', sourceUrl: 'https://help.sap.com/docs/SAP_S4HANA_ON-PREMISE/8308e6d301d54584a33cd04a9861bc52/2a71987ae9f1460ab13c8e01f1feaad1.html' },
  // Topic 19 — Integration Advisor
  { topic: 'SAP Integration Advisor mapping guidelines', content: 'SAP Integration Advisor Overview: Using Integration Advisor for B2B message mapping with MIGs and MAGs', sourceUrl: 'https://help.sap.com/docs/CLOUD_INTEGRATION/368c481cd6954bdfa5d0435479fd4eaf/f99fdafcb4d245df984c8fa541d3bd54.html' },
  { topic: 'SAP Integration Advisor mapping guidelines', content: 'SAP Integration Advisor: Creating Message Implementation Guidelines and Mapping Agreement Guidelines for EDI scenarios', sourceUrl: 'https://help.sap.com/docs/CLOUD_INTEGRATION/368c481cd6954bdfa5d0435479fd4eaf/6b9fe2d753534bebadcfa9080228bd94.html' },
  { topic: 'SAP Integration Advisor mapping guidelines', content: 'Mapping Guidelines in Integration Advisor: Defining field-level mapping rules between source and target message structures', sourceUrl: 'https://help.sap.com/docs/CLOUD_INTEGRATION/368c481cd6954bdfa5d0435479fd4eaf/6b9fe2d753534bebadcfa9080228bd94.html' },
  // Topic 20 — SFTP
  { topic: 'SAP CPI adapter configuration SFTP', content: 'Standard Adapter Migration SFTP: Configuring SFTP sender and receiver adapters in SAP Cloud Integration iFlows', sourceUrl: 'https://help.sap.com/docs/MIGRATION_GUIDE_PO/90c8ad90cb684ee5979856093efe7462/2622c30ed8374702937d74a5f576032e.html' },
  { topic: 'SAP CPI adapter configuration SFTP', content: 'SFTP Receiver Adapter Parameters: Complete parameter reference for SFTP adapter including authentication, proxy, and file handling', sourceUrl: 'https://help.sap.com/docs/CLOUD_INTEGRATION/368c481cd6954bdfa5d0435479fd4eaf/e3dce8814c3e4f5c9f5d2aa85ebb6cb1.html' },
  { topic: 'SAP CPI adapter configuration SFTP', content: 'SFTP Known Hosts and Authentication: Configuring SSH key authentication and known hosts for SFTP adapter security', sourceUrl: 'https://help.sap.com/docs/CLOUD_INTEGRATION/368c481cd6954bdfa5d0435479fd4eaf/dbe3b58a8ef545b5b71e4f90c4e1fbdc.html' },
];

async function seed() {
  let ok = 0, fail = 0;
  console.log(`Seeding ${articles.length} articles to ${BACKEND}...\n`);
  for (let i = 0; i < articles.length; i++) {
    const a = articles[i];
    try {
      const res = await fetch(`${BACKEND}/api/knowledge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: a.topic, content: a.content, sourceUrl: a.sourceUrl, source: 'sap-help' }),
        timeout: 8000,
      });
      const data = await res.json();
      if (data.ok) { ok++; process.stdout.write(`✓`); }
      else { fail++; process.stdout.write(`✗`); }
    } catch (e) { fail++; process.stdout.write(`!`); }
    if ((i+1) % 10 === 0) console.log(` ${i+1}/${articles.length}`);
  }
  console.log(`\n\nDone. ✓ ${ok} stored  ✗ ${fail} failed`);
}

seed();
