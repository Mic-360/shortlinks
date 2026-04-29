import { describe, expect, it } from 'vitest'
import { cleanUrl } from '@/lib/url-cleaner'

describe('cleanUrl', () => {
  it('rejects empty input', () => {
    expect(cleanUrl('').ok).toBe(false)
  })

  it('rejects non-http protocols', () => {
    const r = cleanUrl('ftp://example.com')
    expect(r.ok).toBe(false)
  })

  it('strips utm_* and friends', () => {
    const r = cleanUrl(
      'https://example.com/?utm_source=x&utm_medium=y&fbclid=abc&keep=me',
    )
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.cleanedUrl).toBe('https://example.com/?keep=me')
    }
  })

  it('preserves YouTube v and list params', () => {
    const r = cleanUrl(
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&utm_source=share',
    )
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.cleanedUrl).toContain('v=dQw4w9WgXcQ')
      expect(r.cleanedUrl).toContain('list=RDdQw4w9WgXcQ')
      expect(r.cleanedUrl).not.toContain('utm_source')
    }
  })

  it('preserves Google Drive file IDs', () => {
    const r = cleanUrl(
      'https://drive.google.com/file/d/abc123/view?usp=sharing&utm_campaign=x',
    )
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.cleanedUrl).toContain('/file/d/abc123/')
      expect(r.cleanedUrl).not.toContain('utm_campaign')
    }
  })

  it('lowercases the host', () => {
    const r = cleanUrl('https://Example.COM/path')
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.host).toBe('example.com')
  })

  it('rejects URLs longer than 2048 chars', () => {
    const long = 'https://example.com/' + 'x'.repeat(2050)
    expect(cleanUrl(long).ok).toBe(false)
  })
})
