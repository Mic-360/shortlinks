import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js'
import { publicSiteUrl } from '@/lib/api-helpers'
import { extractApiKey } from '@/lib/identity'
import { buildMcpServer, identityForApiKeyOrAnon } from '@/mcp/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

async function handle(req: Request): Promise<Response> {
  const rawKey = extractApiKey(req.headers)
  const identity = identityForApiKeyOrAnon(rawKey, req.headers)
  const url = new URL(req.url)
  const base = publicSiteUrl() || `${url.protocol}//${url.host}`

  const server = buildMcpServer({ identity, publicBaseUrl: base })
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  })
  await server.connect(transport)
  return transport.handleRequest(req)
}

export const GET = handle
export const POST = handle
export const DELETE = handle
