import { useState, useCallback } from 'react';
import { PROVIDERS } from './ai.js';

export function useCopy() {
  const [copiedId, setCopiedId] = useState(null);
  const copy = useCallback((text, id) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);
  return [copiedId, copy];
}

export function useAI(provider, model, apiKeys) {
  const [loading, setLoading] = useState(false);
  const [timing, setTiming]   = useState(null);

  const call = useCallback(async (messages, systemOverride) => {
    const prov = PROVIDERS[provider];
    if (!prov) throw new Error('Unknown provider');
    const key  = apiKeys?.[provider] || prov.apiKey;
    const sys  = systemOverride || prov.defaultSystem || '';

    setLoading(true);
    const t0 = Date.now();
    try {
      const res  = await fetch(prov.url, {
        method:  'POST',
        headers: prov.headers(key),
        body:    prov.buildBody(messages, model || prov.model, sys, prov.maxTokens),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(`${prov.name} ${res.status}: ${err.slice(0, 300)}`);
      }
      const data  = await res.json();
      const reply = prov.extractReply(data);
      setTiming(((Date.now() - t0) / 1000).toFixed(1));
      return reply;
    } finally {
      setLoading(false);
    }
  }, [provider, model, apiKeys]);

  return { call, loading, timing };
}
