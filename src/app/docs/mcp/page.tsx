import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MCP server',
  description:
    'Model Context Protocol server for Linkshort. Three tools for AI agents: create_short_link, clean_url, get_link_info.',
  alternates: { canonical: '/docs/mcp' },
}

const BREADCRUMB_LD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
    { '@type': 'ListItem', position: 2, name: 'MCP', item: '/docs/mcp' },
  ],
}

export default function McpDocsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_LD) }}
      />
      <section className="section">
        <div className="shell" style={{ maxWidth: 760 }}>
          <p className="eyebrow">MCP server</p>
          <h1>For AI agents that hate tracking params too.</h1>
          <p className="lede">
            Linkshort exposes the same engine as a Model Context Protocol
            server. Wire it into Claude Desktop, Cursor, or any MCP-aware
            client. The HTTP transport runs on Appwrite Sites; the stdio
            transport runs locally.
          </p>

          <h2>Hosted (Streamable HTTP)</h2>
          <pre>{`{
  "mcpServers": {
    "linkshort": {
      "type": "http",
      "url": "https://your-site/api/mcp",
      "headers": { "x-api-key": "optional-api-key" }
    }
  }
}`}</pre>

          <h2>Local (stdio)</h2>
          <pre>{`# Run from a clone of the repo
LINKSHORT_API_KEY=optional bun run mcp:stdio`}</pre>

          <h2>Tools</h2>
          <h3>create_short_link</h3>
          <p>
            Creates a short link from any URL. Strips tracking params before
            storing. Subject to the 2/second rate limit.
          </p>
          <h3>clean_url</h3>
          <p>
            Returns the cleaned URL plus detected platform metadata. Does not
            create a short link.
          </p>
          <h3>get_link_info</h3>
          <p>Looks up metadata for an existing slug.</p>
        </div>
      </section>
    </>
  )
}
