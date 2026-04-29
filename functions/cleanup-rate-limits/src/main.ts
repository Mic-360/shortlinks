import { Client, Databases, Query } from 'node-appwrite'

type AppwriteFnContext = {
  log: (msg: unknown) => void
  error: (msg: unknown) => void
  res: {
    json: (body: unknown, statusCode?: number) => unknown
  }
}

function need(name: string): string {
  const v = process.env[name]
  if (!v) throw new Error(`Missing env: ${name}`)
  return v
}

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID ?? 'linkshort'
const TABLE = process.env.APPWRITE_RATE_LIMITS_TABLE_ID ?? 'rate_limits'

const handler = async ({ log, error, res }: AppwriteFnContext) => {
  const client = new Client()
    .setEndpoint(need('APPWRITE_ENDPOINT'))
    .setProject(need('APPWRITE_PROJECT_ID'))
    .setKey(need('APPWRITE_API_KEY'))
  const db = new Databases(client)

  const cutoff = new Date().toISOString()
  let deleted = 0
  try {
    while (true) {
      const page = await db.listDocuments(DATABASE_ID, TABLE, [
        Query.lessThan('expiresAt', cutoff),
        Query.limit(100),
      ])
      if (page.documents.length === 0) break
      for (const doc of page.documents) {
        await db.deleteDocument(DATABASE_ID, TABLE, doc.$id)
        deleted += 1
      }
      if (page.documents.length < 100) break
    }
    log(`cleanup-rate-limits: deleted ${deleted} expired rows`)
    return res.json({ ok: true, deleted })
  } catch (err) {
    error(`cleanup-rate-limits: ${(err as Error).message}`)
    throw err
  }
}

export default handler
