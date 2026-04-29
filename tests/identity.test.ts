import { describe, expect, it } from 'vitest'
import {
  anonymousIdentity,
  apiKeyIdentity,
  extractApiKey,
  ipFromHeaders,
  sha256,
} from '@/lib/identity'

describe('identity', () => {
  it('hashes deterministically', () => {
    expect(sha256('abc')).toBe(sha256('abc'))
    expect(sha256('abc')).not.toBe(sha256('abcd'))
  })

  it('reads x-forwarded-for first hop', () => {
    const h = new Headers({ 'x-forwarded-for': '203.0.113.5, 10.0.0.1' })
    expect(ipFromHeaders(h)).toBe('203.0.113.5')
  })

  it('falls back to x-real-ip', () => {
    const h = new Headers({ 'x-real-ip': '198.51.100.7' })
    expect(ipFromHeaders(h)).toBe('198.51.100.7')
  })

  it('extracts bearer api keys', () => {
    expect(extractApiKey(new Headers({ authorization: 'Bearer abc123' }))).toBe('abc123')
    expect(extractApiKey(new Headers({ 'x-api-key': 'xyz789' }))).toBe('xyz789')
    expect(extractApiKey(new Headers())).toBeNull()
  })

  it('builds anonymous and api-key identities', () => {
    const anon = anonymousIdentity(new Headers({ 'x-real-ip': '1.2.3.4' }))
    expect(anon.type).toBe('anonymous')
    expect(anon.prefix).toBeNull()

    const key = apiKeyIdentity('mysecretkey1234')
    expect(key.type).toBe('api_key')
    expect(key.prefix).toBe('mysecret')
  })
})
