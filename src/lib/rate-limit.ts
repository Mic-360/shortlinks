import 'server-only'
import { createHash } from 'node:crypto'
import { AppwriteException } from 'node-appwrite'
import { getDatabases } from './appwrite/server'
import { APPWRITE_DATABASE_ID, TABLE_RATE_LIMITS } from './appwrite/tables'
import type { Identity } from './identity'

const SCOPE_CREATE = 'create-link'
const LIMIT = 2
const WINDOW_SECONDS = 1

export type RateLimitResult = {
  ok: boolean
  limit: number
  remaining: number
  reset: number
}

function rowId(
  scope: string,
  identityHash: string,
  windowStart: number
): string {
  return createHash('sha256')
    .update(`${scope}:${identityHash}:${windowStart}`)
    .digest('hex')
    .slice(0, 36)
}

function isConflict(err: unknown): boolean {
  if (err instanceof AppwriteException) {
    return err.code === 409 || err.type === 'document_already_exists'
  }
  return false
}

function isLimitExceeded(err: unknown): boolean {
  if (err instanceof AppwriteException) {
    if (err.code === 400 || err.code === 409) {
      const msg = (err.message || '').toLowerCase()
      return msg.includes('max') || msg.includes('limit')
    }
  }
  return false
}

export async function checkRateLimit(
  identity: Identity
): Promise<RateLimitResult> {
  const db = getDatabases()
  const now = Date.now()
  const windowStart = Math.floor(now / 1000)
  const reset = windowStart + WINDOW_SECONDS
  const id = rowId(SCOPE_CREATE, identity.hash, windowStart)
  const expiresAt = new Date((reset + 60) * 1000).toISOString()

  try {
    await db.createDocument(APPWRITE_DATABASE_ID, TABLE_RATE_LIMITS, id, {
      identityHash: identity.hash,
      scope: SCOPE_CREATE,
      windowStart,
      count: 1,
      expiresAt,
    })
    return { ok: true, limit: LIMIT, remaining: LIMIT - 1, reset }
  } catch (err) {
    if (!isConflict(err)) throw err
  }

  try {
    const updated = await db.incrementDocumentAttribute(
      APPWRITE_DATABASE_ID,
      TABLE_RATE_LIMITS,
      id,
      'count',
      1,
      LIMIT
    )
    const count = (updated as unknown as { count: number }).count
    return {
      ok: count <= LIMIT,
      limit: LIMIT,
      remaining: Math.max(0, LIMIT - count),
      reset,
    }
  } catch (err) {
    if (isLimitExceeded(err)) {
      return { ok: false, limit: LIMIT, remaining: 0, reset }
    }
    throw err
  }
}

export function rateLimitHeaders(r: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': String(r.limit),
    'X-RateLimit-Remaining': String(r.remaining),
    'X-RateLimit-Reset': String(r.reset),
  }
}
