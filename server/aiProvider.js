'use strict';

const { boundedEnvironmentInteger } = require('./config');

class AiProviderError extends Error {
  constructor(message, code = 'provider_unavailable') {
    super(message);
    this.name = 'AiProviderError';
    this.code = code;
  }
}

function getProviderConfig(env = process.env) {
  const apiKey = env.GEMINI_API_KEY || env.AI_PROVIDER_API_KEY || env.GROQ_API_KEY || '';
  const baseUrl = String(
    env.AI_PROVIDER_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta/openai'
  ).replace(/\/$/, '');
  const model = String(env.AI_PROVIDER_MODEL || 'gemini-3.5-flash').trim();
  const timeoutMs = boundedEnvironmentInteger(
    'AI_PROVIDER_TIMEOUT_MS',
    15_000,
    2_000,
    30_000,
    env
  );
  const offline = String(env.AI_TUTOR_OFFLINE || '').toLowerCase() === 'true';

  return {
    apiKey,
    baseUrl,
    model,
    timeoutMs,
    enabled: Boolean(!offline && apiKey && baseUrl && model),
  };
}

function extractMessageContent(payload) {
  const content = payload?.choices?.[0]?.message?.content;
  if (typeof content === 'string') return content;
  if (content && typeof content === 'object') return JSON.stringify(content);
  throw new AiProviderError('The AI provider returned no message.', 'provider_empty');
}

async function requestChatCompletion({
  messages,
  maxTokens = 720,
  temperature = 0.1,
  env = process.env,
  fetchImpl = globalThis.fetch,
}) {
  const config = getProviderConfig(env);
  if (!config.enabled) {
    throw new AiProviderError('The AI provider is not configured.', 'provider_not_configured');
  }
  if (typeof fetchImpl !== 'function') {
    throw new AiProviderError('The AI provider transport is unavailable.', 'provider_transport_missing');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.timeoutMs);
  let response;
  try {
    response = await fetchImpl(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.model,
        messages,
        temperature,
        max_tokens: Math.min(1200, Math.max(64, Number(maxTokens) || 720)),
        stream: false,
      }),
      signal: controller.signal,
    });
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new AiProviderError('The AI provider timed out.', 'provider_timeout');
    }
    throw new AiProviderError('The AI provider could not be reached.', 'provider_network');
  } finally {
    clearTimeout(timeout);
  }

  if (!response?.ok) {
    throw new AiProviderError(
      `The AI provider returned status ${Number(response?.status) || 502}.`,
      'provider_http_error'
    );
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new AiProviderError('The AI provider returned invalid JSON.', 'provider_invalid_json');
  }

  return {
    content: extractMessageContent(data),
    model: config.model,
    usage: data.usage || null,
  };
}

module.exports = {
  AiProviderError,
  extractMessageContent,
  getProviderConfig,
  requestChatCompletion,
};
