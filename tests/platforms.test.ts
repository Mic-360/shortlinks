import {
  detectPlatform,
  isPlatformPathSegment,
  platformPathSegment,
} from '@/lib/platforms'
import { describe, expect, it } from 'vitest'

describe('detectPlatform', () => {
  it.each([
    ['www.linkedin.com', 'linkedin'],
    ['lnkd.in', 'linkedin'],
    ['www.youtube.com', 'youtube'],
    ['youtu.be', 'youtube'],
    ['instagram.com', 'instagram'],
    ['x.com', 'twitter'],
    ['twitter.com', 'twitter'],
    ['t.co', 'twitter'],
    ['drive.google.com', 'google_drive'],
    ['docs.google.com', 'google_docs'],
    ['forms.gle', 'google_forms'],
    ['github.com', 'github'],
    ['gist.github.com', 'github'],
    ['notion.so', 'notion'],
    ['t.me', 'telegram'],
    ['wa.me', 'whatsapp'],
    ['some-random-blog.example.org', 'web'],
  ])('detects %s as %s', (host, expected) => {
    expect(detectPlatform(host)).toBe(expected)
  })

  it('uses stored platform names as path segments', () => {
    expect(platformPathSegment('google_drive')).toBe('google_drive')
    expect(platformPathSegment('google_docs')).toBe('google_docs')
    expect(platformPathSegment('google_sheets')).toBe('google_sheets')
    expect(platformPathSegment('google_forms')).toBe('google_forms')
    expect(platformPathSegment('google_maps')).toBe('google_maps')
    expect(platformPathSegment('youtube')).toBe('youtube')
  })

  it('validates platform path segments', () => {
    expect(isPlatformPathSegment('google_drive')).toBe(true)
    expect(isPlatformPathSegment('gdrive')).toBe(false)
    expect(isPlatformPathSegment('not-a-platform')).toBe(false)
  })
})
