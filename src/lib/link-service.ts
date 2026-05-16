import 'server-only'
import { AppwriteException } from 'node-appwrite'
import { getDatabases } from './appwrite/server'
import {
  APPWRITE_DATABASE_ID,
  TABLE_SHORT_LINKS,
  type ShortLinkRow,
} from './appwrite/tables'
import type { Identity } from './identity'
import { detectPlatform, type Platform } from './platforms'
import { generateSlug, isReserved, isValidSlug, SLUG_LENGTH } from './slug'
import { cleanUrl } from './url-cleaner'

const MAX_SLUG_RETRIES = 6

export type CreateLinkResult =
  | { ok: true; row: ShortLinkRow }
  | { ok: false; status: number; error: string }

export type GetLinkResult =
  | { ok: true; row: ShortLinkRow }
  | { ok: false; status: number; error: string }

function isConflict(err: unknown): boolean {
  if (err instanceof AppwriteException) {
    return err.code === 409 || err.type === 'document_already_exists'
  }
  return false
}

function isNotFound(err: unknown): boolean {
  if (err instanceof AppwriteException) {
    return err.code === 404 || err.type === 'document_not_found'
  }
  return false
}

export async function createShortLink(
  rawUrl: string,
  identity: Identity
): Promise<CreateLinkResult> {
  const cleaned = cleanUrl(rawUrl)
  if (!cleaned.ok) return { ok: false, status: 400, error: cleaned.error }

  const platform: Platform = detectPlatform(cleaned.host)
  const db = getDatabases()

  for (let attempt = 0; attempt < MAX_SLUG_RETRIES; attempt++) {
    let slug = generateSlug()
    while (isReserved(slug)) slug = generateSlug()

    try {
      const created = await db.createDocument<ShortLinkRow>(
        APPWRITE_DATABASE_ID,
        TABLE_SHORT_LINKS,
        slug,
        {
          slug,
          originalUrl: cleaned.originalUrl,
          cleanedUrl: cleaned.cleanedUrl,
          platform,
          platformHost: cleaned.host,
          createdBy: identity.prefix,
          createdByType: identity.type,
          clickCount: 0,
          active: true,
          expiresAt: null,
        }
      )
      return { ok: true, row: created }
    } catch (err) {
      if (isConflict(err)) continue
      throw err
    }
  }

  return { ok: false, status: 500, error: 'Could not generate a unique slug' }
}

export async function getShortLink(slug: string): Promise<GetLinkResult> {
  if (!isValidSlug(slug)) {
    return { ok: false, status: 404, error: 'Not found' }
  }
  if (isReserved(slug)) {
    return { ok: false, status: 404, error: 'Not found' }
  }
  const db = getDatabases()
  try {
    const row = await db.getDocument<ShortLinkRow>(
      APPWRITE_DATABASE_ID,
      TABLE_SHORT_LINKS,
      slug
    )
    if (!row.active) return { ok: false, status: 404, error: 'Not found' }
    if (row.expiresAt && new Date(row.expiresAt).getTime() < Date.now()) {
      return { ok: false, status: 404, error: 'Not found' }
    }
    return { ok: true, row }
  } catch (err) {
    if (isNotFound(err)) return { ok: false, status: 404, error: 'Not found' }
    throw err
  }
}

export async function recordClick(slug: string): Promise<void> {
  if (!isValidSlug(slug)) return
  const db = getDatabases()
  try {
    await db.incrementDocumentAttribute(
      APPWRITE_DATABASE_ID,
      TABLE_SHORT_LINKS,
      slug,
      'clickCount',
      1
    )
  } catch {
    // best effort; never block the redirect
  }
}

export const _internal = { MAX_SLUG_RETRIES, SLUG_LENGTH }
