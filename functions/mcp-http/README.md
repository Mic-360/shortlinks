# mcp-http (Appwrite Function fallback)

This is a fallback Appwrite Function entry point for the MCP HTTP transport in
case the App Router route handler at `/api/mcp` ever proves insufficient (for
example: very long-lived SSE sessions, custom session storage, or special
auth needs).

The primary MCP HTTP entrypoint is `src/app/api/mcp/route.ts` running on
Appwrite Sites. This function is intentionally not wired into the deploy
pipeline yet; ship it only if the Sites route hits a hard limitation.

## Suggested entry point

```ts
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js'
import { buildMcpServer, identityForApiKeyOrAnon } from '../../src/mcp/server'

export default async ({
  req,
}: {
  req: {
    url: string
    headers: Record<string, string>
    bodyRaw: string
    method: string
  }
}) => {
  const headers = new Headers(req.headers)
  const request = new Request(req.url, {
    method: req.method,
    headers,
    body: ['GET', 'HEAD'].includes(req.method) ? undefined : req.bodyRaw,
  })
  const identity = identityForApiKeyOrAnon(headers.get('x-api-key'), headers)
  const server = buildMcpServer({
    identity,
    publicBaseUrl: process.env.NEXT_PUBLIC_SITE_URL ?? '',
  })
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  })
  await server.connect(transport)
  return transport.handleRequest(request)
}
```
