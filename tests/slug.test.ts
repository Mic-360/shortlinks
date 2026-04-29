import { describe, expect, it } from 'vitest'
import { generateSlug, isReserved, isValidSlug, SLUG_LENGTH } from '@/lib/slug'

describe('slug', () => {
  it('generates 6-character URL-safe slugs', () => {
    for (let i = 0; i < 50; i++) {
      const s = generateSlug()
      expect(s.length).toBe(SLUG_LENGTH)
      expect(isValidSlug(s)).toBe(true)
    }
  })

  it('rejects slugs of the wrong length', () => {
    expect(isValidSlug('abcde')).toBe(false)
    expect(isValidSlug('abcdefg')).toBe(false)
  })

  it('rejects slugs with disallowed characters', () => {
    expect(isValidSlug('abc-de')).toBe(false)
    expect(isValidSlug('abc/de')).toBe(false)
  })

  it('flags reserved slugs', () => {
    expect(isReserved('api')).toBe(true)
    expect(isReserved('docs')).toBe(true)
    expect(isReserved('mcp')).toBe(true)
    expect(isReserved('aB3xQ9')).toBe(false)
  })
})
