import { createHash } from 'node:crypto'

export type Identity = {
  hash: string
  type: 'anonymous' | 'api_key'
  prefix: string | null
}

export function sha256(input: string): string {
  return createHash('sha256').update(input).digest('hex')
}

export function ipFromHeaders(headers: Headers): string {
  const fwd = headers.get('x-forwarded-for')
  if (fwd) {
    const first = fwd.split(',')[0]?.trim()
    if (first) return first
  }
  return headers.get('x-real-ip') ?? '0.0.0.0'
}

export function anonymousIdentity(headers: Headers): Identity {
  return { hash: sha256(`ip:${ipFromHeaders(headers)}`), type: 'anonymous', prefix: null }
}

export function apiKeyIdentity(rawKey: string): Identity {
  const hash = sha256(`key:${rawKey}`)
  return { hash, type: 'api_key', prefix: rawKey.slice(0, 8) }
}

export function extractApiKey(headers: Headers): string | null {
  const auth = headers.get('authorization')
  if (auth?.toLowerCase().startsWith('bearer ')) {
    const v = auth.slice(7).trim()
    if (v) return v
  }
  const x = headers.get('x-api-key')
  return x && x.length > 0 ? x : null
}
