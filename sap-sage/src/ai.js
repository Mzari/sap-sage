import { SYSTEM_PROMPT } from './constants.js';

export const PROVIDERS = {
  anthropic: {
    name:    'Claude (Anthropic)',
    color:   '#FF8B00',
    badge:   'PAID',
    url:     'https://api.anthropic.com/v1/messages',
    apiKey:  import.meta.env?.VITE_ANTHROPIC_API_KEY || '',
    model:   'claude-sonnet-4-5',
    altModels: ['claude-opus-4-5', 'claude-haiku-4-5'],
    maxTokens: 8192,
    defaultSystem: SYSTEM_PROMPT,
    keyHint: 'console.anthropic.com → API Keys',
    headers: (key) => ({
      'Content-Type':      'application/json',
      'x-api-key':         key,
      'anthropic-version': '2023-06-01',
    }),
    buildBody: (messages, model, system, maxTokens) => JSON.stringify({
      model, max_tokens: maxTokens, system,
      messages,
    }),
    extractReply: (d) => d.content?.map(b => b.text || '').join('') || '',
  },

  groq: {
    name:    'Groq (Free ⚡ Fastest)',
    color:   '#00E8A2',
    badge:   'FREE',
    url:     'https://api.groq.com/openai/v1/chat/completions',
    apiKey:  import.meta.env?.VITE_GROQ_API_KEY || '',
    model:   'llama-3.3-70b-versatile',
    altModels: ['llama-3.1-8b-instant', 'gemma2-9b-it', 'deepseek-r1-distill-llama-70b'],
    maxTokens: 8192,
    defaultSystem: SYSTEM_PROMPT,
    keyHint: 'console.groq.com → API Keys (no credit card)',
    headers: (key) => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
    }),
    buildBody: (messages, model, system, maxTokens) => JSON.stringify({
      model, max_tokens: maxTokens,
      messages: [{ role: 'system', content: system }, ...messages],
    }),
    extractReply: (d) => d.choices?.[0]?.message?.content || '',
  },

  ollama: {
    name:    'Ollama (Local 🖥️)',
    color:   '#9D6FFF',
    badge:   'LOCAL',
    url:     'http://localhost:11434/v1/chat/completions',
    apiKey:  'ollama',
    model:   'llama3.1:8b',
    altModels: ['llama3.1:70b', 'qwen2.5:14b', 'deepseek-r1:8b', 'mistral:7b'],
    maxTokens: 4096,
    defaultSystem: SYSTEM_PROMPT,
    keyHint: 'Run: OLLAMA_ORIGINS="*" ollama serve',
    headers: () => ({ 'Content-Type': 'application/json' }),
    buildBody: (messages, model, system, maxTokens) => JSON.stringify({
      model, max_tokens: maxTokens, stream: false,
      messages: [{ role: 'system', content: system }, ...messages],
    }),
    extractReply: (d) => d.choices?.[0]?.message?.content || '',
  },

  together: {
    name:    'Together AI ($5 Free)',
    color:   '#00D4FF',
    badge:   '$5 FREE',
    url:     'https://api.together.xyz/v1/chat/completions',
    apiKey:  import.meta.env?.VITE_TOGETHER_API_KEY || '',
    model:   'meta-llama/Llama-3.3-70B-Instruct-Turbo',
    altModels: ['meta-llama/Llama-3.1-8B-Instruct-Turbo', 'deepseek-ai/DeepSeek-V3'],
    maxTokens: 4096,
    defaultSystem: SYSTEM_PROMPT,
    keyHint: 'api.together.ai → Settings → API Keys',
    headers: (key) => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
    }),
    buildBody: (messages, model, system, maxTokens) => JSON.stringify({
      model, max_tokens: maxTokens,
      messages: [{ role: 'system', content: system }, ...messages],
    }),
    extractReply: (d) => d.choices?.[0]?.message?.content || '',
  },
};
