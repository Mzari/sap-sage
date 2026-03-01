// ─── SAP Sage API Client ─────────────────────────────────────────────────────
// All functions return null on error — never throw.

const API_BASE =
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
    'http://localhost:3001';

async function request(path, options = {}) {
    try {
        const res = await fetch(`${API_BASE}${path}`, {
            headers: { 'Content-Type': 'application/json', ...options.headers },
            ...options,
        });
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    }
}

/** POST /api/sessions — create a new session */
export async function createSession(sectionId) {
    return request('/api/sessions', {
        method: 'POST',
        body: JSON.stringify({ title: 'New Session', sap_context: sectionId ? { sectionId } : null }),
    });
}

/** GET /api/sessions — list all sessions, newest first */
export async function getSessions() {
    return request('/api/sessions');
}

/** GET /api/sessions/:id/messages — messages for a session */
export async function getMessages(sessionId) {
    if (!sessionId) return null;
    return request(`/api/sessions/${sessionId}/messages`);
}

/** POST /api/chat — main chat, returns { reply, sessionId, toolCallsMade, citations } */
export async function sendMessage({ sessionId, message, provider, model, apiKey, sectionId }) {
    return request('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ sessionId, message, provider, model, apiKey, sectionId }),
    });
}

/** DELETE /api/sessions/:id */
export async function deleteSession(id) {
    return request(`/api/sessions/${id}`, { method: 'DELETE' });
}

/** POST /api/knowledge — store a knowledge item */
export async function storeKnowledge({ topic, content, sourceUrl, source }) {
    return request('/api/knowledge', {
        method: 'POST',
        body: JSON.stringify({ topic, content, source_url: sourceUrl, source }),
    });
}

/** GET /health — backend health status */
export async function checkHealth() {
    return request('/health');
}
