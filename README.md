# ⬡ SAP Sage — Full Spectrum SAP Intelligence Platform

One unified AI assistant covering every SAP landscape, all functional modules, full technical stack — with multi-backend AI support.

## Coverage

| Area | Details |
|------|---------|
| **SAP Landscapes** | ECC 6.0, S/4HANA (On-Prem/Private/Public Cloud), SuccessFactors, Ariba, Concur, MDI, MDG, DMS, IBP, BW/4HANA, GRC |
| **Functional Modules** | FI/CO, MM/WM/EWM, SD/TM, PM/EAM, PP, QM, PS, HCM, RE-FX, GRC |
| **BTP Platform** | Integration Suite (CPI, APIM, Event Mesh, IA), ABAP Environment, SAP Build, HANA Cloud, AI Core, Kyma, Cloud Foundry |
| **Technical** | ABAP Classic/Cloud, RAP (CDS/BDEF), Fiori/UI5, CAP Full Stack, Extensibility (4 models), SPA, Workflow |
| **Documentation** | SDD, Technical Spec, IDD, Implementation Guide, Step-by-Step, API Docs, Test Plan |

## AI Backends

| Provider | Cost | Speed | Get Key |
|----------|------|-------|---------|
| **Groq** ⭐ | Free | ⚡ Fastest | [console.groq.com](https://console.groq.com) |
| **Anthropic** | Pay-as-you-go | Fast | [console.anthropic.com](https://console.anthropic.com) |
| **Ollama** | Free (local) | Depends on GPU | [ollama.com](https://ollama.com) |
| **Together AI** | $5 free credit | Fast | [api.together.ai](https://api.together.ai) |

## Quick Start

```bash
# 1. Clone
git clone https://github.com/YOUR_USER/sap-sage.git
cd sap-sage

# 2. Install
npm install

# 3. Configure API key
cp .env.example .env
# Edit .env → add your Groq key (free, no credit card)

# 4. Run
npm run dev
# Opens at http://localhost:5173
```

## Deploy to Vercel (Free)

```bash
npm install -g vercel
vercel --prod
# Add env vars in Vercel dashboard
```

## Ollama Local Setup

```bash
# Install Ollama from ollama.com
# Run with CORS enabled:
OLLAMA_ORIGINS="*" ollama serve

# Pull a model:
ollama pull llama3.1:8b   # Fast, 8GB RAM
ollama pull qwen2.5:14b   # Better quality, 16GB RAM
```

## Project Structure

```
sap-sage/
├── src/
│   ├── constants.js      # All data: nav, transactions, prompts, system prompt
│   ├── ai.js             # Provider configs (Groq, Anthropic, Ollama, Together)
│   ├── hooks.js          # useAI, useCopy hooks
│   ├── App.jsx           # Root with routing
│   └── components/
│       ├── Sidebar.jsx   # Collapsible navigation
│       ├── Dashboard.jsx # Command center
│       ├── SageChat.jsx  # Universal AI chat
│       ├── CodeGen.jsx   # Code generator (8 languages)
│       ├── DocGen.jsx    # Document generator (7 types)
│       ├── TxFinder.jsx  # Transaction finder (150+)
│       ├── ProviderBar.jsx # AI backend switcher
│       └── Primitives.jsx  # Shared UI components
├── .env.example
└── vite.config.js
```

---
Built by Azhar — SAP Integration Consultant & AI Platform Engineer
