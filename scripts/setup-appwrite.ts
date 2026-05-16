import { Client, Databases, IndexType } from 'node-appwrite'
import {
  APPWRITE_DATABASE_ID,
  TABLE_API_KEYS,
  TABLE_RATE_LIMITS,
  TABLE_SHORT_LINKS,
} from '../src/lib/appwrite/tables'

function need(name: string): string {
  const v = process.env[name]
  if (!v) throw new Error(`Missing env: ${name}`)
  return v
}

const client = new Client()
  .setEndpoint(need('APPWRITE_ENDPOINT'))
  .setProject(need('APPWRITE_PROJECT_ID'))
  .setKey(need('APPWRITE_API_KEY'))

const db = new Databases(client)

async function ignoreConflict<T>(p: Promise<T>): Promise<T | null> {
  try {
    return await p
  } catch (err) {
    const e = err as { code?: number; type?: string }
    if (e.code === 409 || e.type === 'document_already_exists') return null
    throw err
  }
}

async function ensureDatabase() {
  await ignoreConflict(db.create(APPWRITE_DATABASE_ID, 'linkshort'))
}

async function ensureCollection(id: string, name: string) {
  await ignoreConflict(
    db.createCollection(APPWRITE_DATABASE_ID, id, name, undefined, false, true)
  )
}

async function str(
  id: string,
  key: string,
  size: number,
  required: boolean,
  def?: string
) {
  const safeDef = required ? undefined : def
  await ignoreConflict(
    db.createStringAttribute(
      APPWRITE_DATABASE_ID,
      id,
      key,
      size,
      required,
      safeDef
    )
  )
}
async function int(id: string, key: string, required: boolean, def?: number) {
  const safeDef = required ? undefined : def
  await ignoreConflict(
    db.createIntegerAttribute(
      APPWRITE_DATABASE_ID,
      id,
      key,
      required,
      undefined,
      undefined,
      safeDef
    )
  )
}
async function bool(id: string, key: string, required: boolean, def?: boolean) {
  const safeDef = required ? undefined : def
  await ignoreConflict(
    db.createBooleanAttribute(APPWRITE_DATABASE_ID, id, key, required, safeDef)
  )
}
async function index(
  id: string,
  key: string,
  type: IndexType,
  attrs: string[]
) {
  await ignoreConflict(
    db.createIndex(APPWRITE_DATABASE_ID, id, key, type, attrs)
  )
}

async function ensureShortLinks() {
  await ensureCollection(TABLE_SHORT_LINKS, 'Short links')
  await str(TABLE_SHORT_LINKS, 'slug', 16, true)
  await str(TABLE_SHORT_LINKS, 'originalUrl', 2048, true)
  await str(TABLE_SHORT_LINKS, 'cleanedUrl', 2048, true)
  await str(TABLE_SHORT_LINKS, 'platform', 64, true, 'web')
  await str(TABLE_SHORT_LINKS, 'platformHost', 255, true)
  await str(TABLE_SHORT_LINKS, 'createdBy', 128, false)
  await str(TABLE_SHORT_LINKS, 'createdByType', 16, true, 'anonymous')
  await int(TABLE_SHORT_LINKS, 'clickCount', true, 0)
  await bool(TABLE_SHORT_LINKS, 'active', true, true)
  await str(TABLE_SHORT_LINKS, 'expiresAt', 32, false)
  await index(TABLE_SHORT_LINKS, 'idx_platform', IndexType.Key, ['platform'])
  await index(TABLE_SHORT_LINKS, 'idx_platform_host', IndexType.Key, [
    'platformHost',
  ])
  await index(TABLE_SHORT_LINKS, 'idx_active', IndexType.Key, ['active'])
}

async function ensureApiKeys() {
  await ensureCollection(TABLE_API_KEYS, 'API keys')
  await str(TABLE_API_KEYS, 'name', 128, true)
  await str(TABLE_API_KEYS, 'keyHash', 128, true)
  await str(TABLE_API_KEYS, 'keyPrefix', 16, true)
  await bool(TABLE_API_KEYS, 'enabled', true, true)
  await str(TABLE_API_KEYS, 'lastUsedAt', 32, false)
  await index(TABLE_API_KEYS, 'idx_key_hash', IndexType.Unique, ['keyHash'])
  await index(TABLE_API_KEYS, 'idx_key_prefix', IndexType.Key, ['keyPrefix'])
}

async function ensureRateLimits() {
  await ensureCollection(TABLE_RATE_LIMITS, 'Rate limits')
  await str(TABLE_RATE_LIMITS, 'identityHash', 128, true)
  await str(TABLE_RATE_LIMITS, 'scope', 64, true)
  await int(TABLE_RATE_LIMITS, 'windowStart', true, 0)
  await int(TABLE_RATE_LIMITS, 'count', true, 0)
  await str(TABLE_RATE_LIMITS, 'expiresAt', 32, true)
  await index(TABLE_RATE_LIMITS, 'idx_identity_hash', IndexType.Key, [
    'identityHash',
  ])
  await index(TABLE_RATE_LIMITS, 'idx_scope', IndexType.Key, ['scope'])
  await index(TABLE_RATE_LIMITS, 'idx_window_start', IndexType.Key, [
    'windowStart',
  ])
  await index(TABLE_RATE_LIMITS, 'idx_expires_at', IndexType.Key, ['expiresAt'])
}

async function main() {
  await ensureDatabase()
  await ensureShortLinks()
  await ensureApiKeys()
  await ensureRateLimits()
  console.log('Appwrite schema ready.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
