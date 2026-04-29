import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { anonymousIdentity, apiKeyIdentity } from '@/lib/identity'
import { buildMcpServer } from './server'

async function main() {
  const apiKey = process.env.LINKSHORT_API_KEY
  const identity = apiKey
    ? apiKeyIdentity(apiKey)
    : anonymousIdentity(new Headers({ 'x-real-ip': 'stdio' }))

  const server = buildMcpServer({
    identity,
    publicBaseUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  })

  const transport = new StdioServerTransport()
  await server.connect(transport)
}

main().catch((err) => {
  console.error('[mcp/stdio] fatal:', err)
  process.exit(1)
})
