import { createOpenAICompatible, type OpenAICompatibleProvider } from '@ai-sdk/openai-compatible'

import { normalizeBaseURL, readEnvironment } from './config.js'

const API_KEY_ENVIRONMENT_VARIABLE = 'TAODOCK_API_KEY'
const BASE_URL_ENVIRONMENT_VARIABLE = 'TAODOCK_BASE_URL'

export interface TaoDockProviderSettings {
  /** TaoDock API key. Defaults to `TAODOCK_API_KEY`. */
  apiKey?: string
  /** OpenAI-compatible API prefix. Defaults to `TAODOCK_BASE_URL` or TaoDock's public `/v1` endpoint. */
  baseURL?: string
  /** Headers added to every request. */
  headers?: Record<string, string>
  /** Fetch implementation used to send requests. */
  fetch?: typeof globalThis.fetch
}

export type TaoDockProvider = OpenAICompatibleProvider<string, string, string, string>

function apiKeyForRequest(configuredValue: string | undefined): string {
  const value = (configuredValue ?? readEnvironment(API_KEY_ENVIRONMENT_VARIABLE))?.trim()
  if (value) return value

  throw new Error(
    'TaoDock API key is missing. Pass apiKey or set TAODOCK_API_KEY. Create a key at https://taodock.com/keys.',
  )
}

export function createTaoDock(settings: TaoDockProviderSettings = {}): TaoDockProvider {
  const send = settings.fetch ?? globalThis.fetch
  const baseURL = normalizeBaseURL(settings.baseURL ?? readEnvironment(BASE_URL_ENVIRONMENT_VARIABLE))

  return createOpenAICompatible({
    name: 'taodock',
    baseURL,
    ...(settings.headers ? { headers: settings.headers } : {}),
    includeUsage: true,
    fetch: async (input, init) => {
      const headers = new Headers(init?.headers)
      if (!headers.has('authorization')) {
        headers.set('Authorization', `Bearer ${apiKeyForRequest(settings.apiKey)}`)
      }
      return send(input, { ...init, headers })
    },
  })
}
