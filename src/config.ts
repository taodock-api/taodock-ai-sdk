export const TAODOCK_BASE_URL = 'https://taodock.com/v1'

export function normalizeBaseURL(input: string | undefined): string {
  const candidate = input?.trim() || TAODOCK_BASE_URL
  let url: URL

  try {
    url = new URL(candidate)
  } catch {
    throw new TypeError(`Invalid TaoDock base URL: ${candidate}`)
  }

  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new TypeError(`Invalid TaoDock base URL: ${candidate}`)
  }
  if (url.search || url.hash) {
    throw new TypeError('TaoDock base URL cannot include a query or fragment')
  }

  return url.toString().replace(/\/+$/u, '')
}

export function readEnvironment(name: string): string | undefined {
  if (typeof process === 'undefined') return undefined
  return process.env[name]
}
