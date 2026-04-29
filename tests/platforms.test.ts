import { describe, expect, it } from 'vitest'
import { detectPlatform } from '@/lib/platforms'

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
})
