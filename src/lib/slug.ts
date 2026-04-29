import { customAlphabet } from 'nanoid'

const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
export const SLUG_LENGTH = 6

const generator = customAlphabet(ALPHABET, SLUG_LENGTH)

export const RESERVED_SLUGS = new Set<string>([
  'api',
  'docs',
  'about',
  'pricing',
  'health',
  'admin',
  'login',
  'logout',
  'signup',
  'signin',
  'mcp',
  'robots',
  'sitemap',
  'opengraph-image',
  'favicon',
  '_next',
  '_vercel',
  '_appwrite',
  'static',
  'assets',
  'linkedin',
  'youtube',
  'instagram',
  'twitter',
  'google_drive',
  'google_docs',
  'google_sheets',
  'google_forms',
  'google_maps',
  'facebook',
  'tiktok',
  'reddit',
  'github',
  'notion',
  'figma',
  'amazon',
  'medium',
  'whatsapp',
  'telegram',
  'discord',
  'spotify',
  'pinterest',
  'web',
])

export function generateSlug(): string {
  return generator()
}

export function isValidSlug(input: string): boolean {
  if (input.length !== SLUG_LENGTH) return false
  for (const ch of input) {
    if (!ALPHABET.includes(ch)) return false
  }
  return true
}

export function isReserved(slug: string): boolean {
  return RESERVED_SLUGS.has(slug.toLowerCase())
}
