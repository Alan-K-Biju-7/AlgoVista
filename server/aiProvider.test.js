'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const {
  AiProviderError,
  extractMessageContent,
  getProviderConfig,
  requestChatCompletion,
} = require('./aiProvider');

test('provider configuration stays offline without a server-side key', () => {
  const config = getProviderConfig({ AI_PROVIDER_MODEL: 'test-model' });
  assert.equal(config.enabled, false);
  assert.equal(config.model, 'test-model');
});

test('defaults to the current Gemini Flash model', () => {
  assert.equal(getProviderConfig({}).model, 'gemini-3.6-flash');
});

test('explicit offline mode overrides configured provider credentials', () => {
  const config = getProviderConfig({
    AI_PROVIDER_API_KEY: 'server-secret',
    AI_PROVIDER_BASE_URL: 'https://provider.example/v1',
    AI_PROVIDER_MODEL: 'test-model',
    AI_TUTOR_OFFLINE: 'true',
  });
  assert.equal(config.enabled, false);
});

test('provider timeout falls back safely when configuration is malformed', () => {
  assert.equal(getProviderConfig({ AI_PROVIDER_TIMEOUT_MS: 'not-a-number' }).timeoutMs, 15_000);
  assert.equal(getProviderConfig({ AI_PROVIDER_TIMEOUT_MS: 'Infinity' }).timeoutMs, 15_000);
  assert.equal(getProviderConfig({ AI_PROVIDER_TIMEOUT_MS: '2500' }).timeoutMs, 2_500);
});

test('extracts text and structured provider messages', () => {
  assert.equal(extractMessageContent({ choices: [{ message: { content: 'hello' } }] }), 'hello');
  assert.equal(
    extractMessageContent({ choices: [{ message: { content: { message: 'hello' } } }] }),
    '{"message":"hello"}'
  );
});

test('provider errors never expose the upstream response body', async () => {
  const env = {
    AI_PROVIDER_API_KEY: 'server-secret',
    AI_PROVIDER_BASE_URL: 'https://provider.example/v1',
    AI_PROVIDER_MODEL: 'test-model',
  };
  await assert.rejects(
    requestChatCompletion({
      messages: [],
      env,
      fetchImpl: async () => ({ ok: false, status: 429, text: async () => 'sensitive upstream payload' }),
    }),
    (error) => error instanceof AiProviderError
      && error.code === 'provider_http_error'
      && !error.message.includes('sensitive upstream payload')
  );
});

test('does not send deprecated sampling parameters unless explicitly requested', async () => {
  let requestBody;
  await requestChatCompletion({
    messages: [{ role: 'user', content: 'Explain a queue.' }],
    env: {
      AI_PROVIDER_API_KEY: 'server-secret',
      AI_PROVIDER_BASE_URL: 'https://provider.example/v1',
      AI_PROVIDER_MODEL: 'test-model',
    },
    fetchImpl: async (_url, options) => {
      requestBody = JSON.parse(options.body);
      return {
        ok: true,
        json: async () => ({ choices: [{ message: { content: 'A queue is FIFO.' } }] }),
      };
    },
  });

  assert.equal('temperature' in requestBody, false);
});
