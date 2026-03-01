// SAP Sage v5 — Backend API client
// All calls go to the Express backend. Falls back gracefully if backend is offline.

const BASE = import.meta.env?.VITE_API_URL || 'http://localhost:3001';

// ─── Read SAP connections from localStorage (set by SystemConnector) ──────────
function getSapConnections() {
  try {
    return JSON.parse(localStorage.getItem('sap-sage-connections') || '{}');
  } catch {
    return {};
  }
}

// ─── Generic fetch wrapper ────────────────────────────────────────────────────
async function api(path, opts = {}) {
  try {
    const res = await fetch(`${BASE}${path}`, {
      ...opts,
      headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    });
    return await res.json();
  } catch {
    return null; // backend offline — caller handles null
  }
}

// ─── Sessions ────────────────────────────────────────────────────────────────
export async function createSession(sectionId = 'default') {
  return api('/api/sessions', {
    method: 'POST',
    body: JSON.stringify({ sectionId }),
  });
}

export async function getSessions() {
  const r = await api('/api/sessions');
  return r || [];
}

export async function getMessages(sessionId) {
  if (!sessionId) return [];
  const r = await api(`/api/sessions/${sessionId}/messages`);
  return r || [];
}

export async function deleteSession(id) {
  return api(`/api/sessions/${id}`, { method: 'DELETE' });
}

// ─── Main chat — passes sapConnections from localStorage automatically ─────────
export async function sendMessage({ sessionId, message, provider, model, apiKey, sectionId, systemPrompt }) {
  return api('/api/chat', {
    method: 'POST',
    body: JSON.stringify({
      sessionId,
      message,
      provider:      provider   || 'anthropic',
      model:         model      || 'claude-sonnet-4-6',
      apiKey:        apiKey     || '',
      sectionId:     sectionId  || 'default',
      systemPrompt:  systemPrompt || '',
      sapConnections: getSapConnections(), // ← automatically attached from localStorage
    }),
  });
}

// ─── Knowledge base ───────────────────────────────────────────────────────────
export async function storeKnowledge({ topic, content, sourceUrl, source = 'manual' }) {
  return api('/api/knowledge', {
    method: 'POST',
    body: JSON.stringify({ topic, content, sourceUrl, source }),
  });
}

export async function getKnowledge(topic) {
  return api(`/api/knowledge/${encodeURIComponent(topic)}`);
}

// ─── Health check ─────────────────────────────────────────────────────────────
export async function checkHealth() {
  return api('/health');
}
