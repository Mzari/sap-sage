import { useCallback, useState } from 'react';
import { PROVIDERS } from './ai.js';

export function useAI(provider, model, apiKeys) {
  const [loading, setLoading] = useState(false);
  const [timing, setTiming]   = useState(null);

  const call = useCallback(async (messages, systemOverride) => {
    const prov = PROVIDERS[provider];
    if (!prov) throw new Error('Unknown provider');
    const key = apiKeys?.[provider] || prov.apiKey || '';
    const sys = systemOverride || '';

    setLoading(true);
    const t0 = Date.now();
    try {
      const res = await fetch(prov.url, {
        method: 'POST',
        headers: prov.headers(key),
        body: prov.buildBody(messages, model || prov.model, sys, prov.maxTokens),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(`${prov.name} error ${res.status}: ${err.slice(0, 200)}`);
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
