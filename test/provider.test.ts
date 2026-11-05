import assert from 'node:assert/strict'
import { afterEach, test } from 'node:test'

import { generateText } from 'ai'

import { createTaoDock, TAODOCK_BASE_URL } from '../src/index.js'

const originalAPIKey = process.env.TAODOCK_API_KEY
const originalBaseURL = process.env.TAODOCK_BASE_URL

afterEach(() => {
  if (originalAPIKey === undefined) delete process.env.TAODOCK_API_KEY
  else process.env.TAODOCK_API_KEY = originalAPIKey

  if (originalBaseURL === undefined) delete process.env.TAODOCK_BASE_URL
  else process.env.TAODOCK_BASE_URL = originalBaseURL
})

function completionResponse(): Response {
  return Response.json({
    id: 'response-fixture',
    object: 'chat.completion',
    created: 1,
    model: 'catalog-model',
    choices: [
      {
        index: 0,
        message: { role: 'assistant', content: 'connected' },
        finish_reason: 'stop',
      },
    ],
    usage: { prompt_tokens: 2, completion_tokens: 1, total_tokens: 3 },
  })
}

test('sends AI SDK chat requests to TaoDock with configured authentication', async () => {
  let requestURL = ''
  let requestHeaders = new Headers()
  let requestBody: unknown
  const provider = createTaoDock({
    apiKey: 'fixture-credential',
    headers: { 'X-Client-Fixture': 'provider-test' },
    fetch: async (input, init) => {
      requestURL = input.toString()
      requestHeaders = new Headers(init?.headers)
      requestBody = JSON.parse(String(init?.body)) as unknown
      return completionResponse()
    },
  })

  const result = await generateText({
    model: provider('catalog-model'),
    prompt: 'Reply with connected.',
    maxRetries: 0,
  })

  assert.equal(result.text, 'connected')
  assert.equal(requestURL, `${TAODOCK_BASE_URL}/chat/completions`)
  assert.equal(requestHeaders.get('authorization'), 'Bearer fixture-credential')
  assert.equal(requestHeaders.get('x-client-fixture'), 'provider-test')
  assert.equal((requestBody as { model?: string }).model, 'catalog-model')
})

test('reads the API key when a request is sent and normalizes a custom base URL', async () => {
  delete process.env.TAODOCK_API_KEY
  const provider = createTaoDock({
    baseURL: 'https://gateway.example.test/openai/',
    fetch: async (input, init) => {
      assert.equal(input.toString(), 'https://gateway.example.test/openai/chat/completions')
      assert.equal(new Headers(init?.headers).get('authorization'), 'Bearer environment-fixture')
      return completionResponse()
    },
  })
  process.env.TAODOCK_API_KEY = 'environment-fixture'

  const result = await generateText({ model: provider('catalog-model'), prompt: 'Test', maxRetries: 0 })

  assert.equal(result.text, 'connected')
})

test('rejects a request before network access when authentication is missing', async () => {
  delete process.env.TAODOCK_API_KEY
  let called = false
  const provider = createTaoDock({
    fetch: async () => {
      called = true
      return completionResponse()
    },
  })

  await assert.rejects(
    generateText({ model: provider('catalog-model'), prompt: 'Test', maxRetries: 0 }),
    /TAODOCK_API_KEY/u,
  )
  assert.equal(called, false)
})
