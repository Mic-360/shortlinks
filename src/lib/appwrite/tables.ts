import type { Models } from 'node-appwrite'

export const APPWRITE_DATABASE_ID =
  process.env.APPWRITE_DATABASE_ID ?? 'linkshort'

export const TABLE_SHORT_LINKS =
  process.env.APPWRITE_SHORT_LINKS_TABLE_ID ?? 'short_links'

export const TABLE_API_KEYS =
  process.env.APPWRITE_API_KEYS_TABLE_ID ?? 'api_keys'

export const TABLE_RATE_LIMITS =
  process.env.APPWRITE_RATE_LIMITS_TABLE_ID ?? 'rate_limits'

export type ShortLinkRow = Models.Document & {
  slug: string
  originalUrl: string
  cleanedUrl: string
  platform: string
  platformHost: string
  createdBy: string | null
  createdByType: 'anonymous' | 'api_key'
  clickCount: number
  active: boolean
  expiresAt: string | null
}

export type ApiKeyRow = Models.Document & {
  name: string
  keyHash: string
  keyPrefix: string
  enabled: boolean
  lastUsedAt: string | null
}

export type RateLimitRow = Models.Document & {
  identityHash: string
  scope: string
  windowStart: number
  count: number
  expiresAt: string
}
