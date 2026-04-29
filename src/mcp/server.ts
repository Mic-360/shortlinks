import { anonymousIdentity, apiKeyIdentity, type Identity } from '@/lib/identity'
import { createShortLink, getShortLink } from '@/lib/link-service'
import { detectPlatform, platformPathSegment } from '@/lib/platforms'
import { checkRateLimit } from '@/lib/rate-limit'
import { cleanUrl } from '@/lib/url-cleaner'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'

export type McpContext = {
  identity: Identity
  publicBaseUrl: string
}

function ok(text: string) {
  return { content: [{ type: 'text' as const, text }] }
}
function err(text: string) {
  return { isError: true, content: [{ type: 'text' as const, text }] }
}

export function buildMcpServer(ctx: McpContext): McpServer {
  const server = new McpServer({
    name: 'link-shortner',
    version: '0.1.0',
  })

  server.registerTool(
    'create_short_link',
    {
      description:
        'Create a short link from a URL. Strips tracking params before storing. Limited to 2 creations per second per identity.',
      inputSchema: { url: z.string().min(1).max(2048) },
    },
    async ({ url }) => {
      const limit = await checkRateLimit(ctx.identity)
      if (!limit.ok) return err('Rate limit exceeded. Try again in a moment.')
      const result = await createShortLink(url, ctx.identity)
      if (!result.ok) return err(result.error)
      const shortUrl = `${ctx.publicBaseUrl.replace(/\/$/, '')}/${platformPathSegment(result.row.platform)}/${result.row.slug}`
      return ok(
        JSON.stringify({
          slug: result.row.slug,
          shortUrl,
          cleanedUrl: result.row.cleanedUrl,
          platform: result.row.platform,
        }),
      )
    },
  )

  server.registerTool(
    'clean_url',
    {
      description:
        'Strip tracking parameters from a URL and return the cleaned URL plus detected platform metadata. Does not create a short link.',
      inputSchema: { url: z.string().min(1).max(2048) },
    },
    async ({ url }) => {
      const cleaned = cleanUrl(url)
      if (!cleaned.ok) return err(cleaned.error)
      return ok(
        JSON.stringify({
          originalUrl: cleaned.originalUrl,
          cleanedUrl: cleaned.cleanedUrl,
          host: cleaned.host,
          platform: detectPlatform(cleaned.host),
        }),
      )
    },
  )

  server.registerTool(
    'get_link_info',
    {
      description: 'Look up metadata for an existing short link by slug.',
      inputSchema: { slug: z.string().min(1).max(16) },
    },
    async ({ slug }) => {
      const result = await getShortLink(slug)
      if (!result.ok) return err(result.error)
      return ok(
        JSON.stringify({
          slug: result.row.slug,
          cleanedUrl: result.row.cleanedUrl,
          originalUrl: result.row.originalUrl,
          platform: result.row.platform,
          clickCount: result.row.clickCount,
          createdAt: result.row.$createdAt,
        }),
      )
    },
  )

  return server
}

export function identityForApiKeyOrAnon(rawKey: string | null, headers: Headers): Identity {
  if (rawKey) return apiKeyIdentity(rawKey)
  return anonymousIdentity(headers)
}
