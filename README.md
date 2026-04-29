# Linkshort

Linkshort is a privacy-conscious URL shortener built with Next.js and Appwrite.
It creates six-character short links, strips common tracking parameters before
storing redirects, detects platform metadata, exposes REST endpoints, and ships
an MCP server so AI agents can clean or shorten links through the same backend.

## Core Features

- Shorten links at `/{slug}` with six-character slugs.
- Clean URLs by removing tracking parameters such as `utm_*`, `fbclid`,
  `gclid`, `msclkid`, `mc_cid`, `igshid`, `ref`, `ref_src`, and similar tags.
- Preserve destination-critical parameters such as YouTube `v` and `list`.
- Detect common platforms including YouTube, LinkedIn, Instagram, X/Twitter,
  Google Drive/Docs/Sheets/Forms, GitHub, Notion, Figma, Reddit, Amazon,
  WhatsApp, Telegram, Discord, Spotify, Pinterest, and generic web links.
- Rate-limit link creation to 2 requests per second per IP or API-key identity.
- Store data in Appwrite Databases and deploy on Appwrite Sites.
- Run a scheduled Appwrite Function to clean expired rate-limit rows.
- Provide MCP tools for AI agents: `create_short_link`, `clean_url`, and
  `get_link_info`.

## Stack

- Next.js App Router
- React
- TypeScript
- Appwrite Databases, Sites, and Functions
- `node-appwrite`
- Zod
- Nano ID
- Model Context Protocol SDK
- Vitest

## Project Structure

```text
src/app/                    Next.js App Router pages and API routes
src/app/[slug]/route.ts     Public short-link redirect route
src/app/api/v1/links/       REST endpoint for creating short links
src/app/api/v1/clean/       REST endpoint for URL cleaning
src/app/api/mcp/            Hosted MCP Streamable HTTP route
src/components/             Client UI components
src/lib/                    URL cleaning, Appwrite, rate limit, slug services
src/mcp/                    Shared MCP server and local stdio transport
functions/cleanup-rate-limits/
                             Scheduled Appwrite cleanup function
scripts/setup-appwrite.ts   Idempotent Appwrite schema setup script
tests/                      Unit tests
```

## Environment Variables

Create `.env` from `.env.example`:

```sh
cp .env.example .env
```

Required server-side variables:

```env
APPWRITE_ENDPOINT=https://sgp.cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=shortlinks
APPWRITE_API_KEY=
APPWRITE_DATABASE_ID=linkshort
APPWRITE_SHORT_LINKS_TABLE_ID=short_links
APPWRITE_API_KEYS_TABLE_ID=api_keys
APPWRITE_RATE_LIMITS_TABLE_ID=rate_limits
```

Public/runtime variables:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Optional local MCP variable:

```env
LINKSHORT_API_KEY=
```

`APPWRITE_API_KEY` must be treated as a server secret. Do not expose it in
client code or public repositories.

## Appwrite Setup

The project expects one Appwrite database and three collections:

- `short_links`
- `api_keys`
- `rate_limits`

Appwrite already provides `$id`, `$createdAt`, and `$updatedAt` on every
document. The schema intentionally does not create duplicate custom timestamp
attributes.

Provision or update the schema:

```sh
bun run appwrite:setup
```

## Local Development

Install dependencies:

```sh
bun install
```

Start the development server:

```sh
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

Useful checks:

```sh
bun run typecheck
bun run lint
bun run test
bun run build
```

## Website Usage

The homepage provides a paste-first form. Enter a long URL and Linkshort will:

1. Validate that the URL is `http` or `https`.
2. Remove known tracking parameters.
3. Detect the platform from the hostname.
4. Store the cleaned destination in Appwrite.
5. Return a short URL in the form `https://your-domain/{slug}`.

Redirects use `307 Temporary Redirect` so destinations can remain flexible later.
Click counts are stored as aggregate integers on the short-link document.

## REST API

Base URL:

```text
https://your-domain
```

For local development:

```text
http://localhost:3000
```

### Create Short Link

```http
POST /api/v1/links
Content-Type: application/json
Authorization: Bearer <optional-api-key>
```

Request:

```json
{
  "url": "https://example.com/path?utm_source=newsletter&keep=1"
}
```

Response `201`:

```json
{
  "slug": "aB3xQ9",
  "shortUrl": "https://your-domain/aB3xQ9",
  "originalUrl": "https://example.com/path?utm_source=newsletter&keep=1",
  "cleanedUrl": "https://example.com/path?keep=1",
  "platform": "web",
  "platformHost": "example.com",
  "createdAt": "2026-04-29T11:48:14.323+00:00"
}
```

Rate-limit headers are included:

```http
X-RateLimit-Limit: 2
X-RateLimit-Remaining: 1
X-RateLimit-Reset: 1777463294
```

### Clean URL Without Shortening

```http
POST /api/v1/clean
Content-Type: application/json
```

Request:

```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ&utm_source=share"
}
```

Response `200`:

```json
{
  "originalUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ&utm_source=share",
  "cleanedUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "host": "www.youtube.com",
  "platform": "youtube"
}
```

### Get Link Metadata

```http
GET /api/v1/links/{slug}
```

Response `200`:

```json
{
  "slug": "aB3xQ9",
  "shortUrl": "https://your-domain/aB3xQ9",
  "cleanedUrl": "https://example.com/path?keep=1",
  "originalUrl": "https://example.com/path?utm_source=newsletter&keep=1",
  "platform": "web",
  "platformHost": "example.com",
  "clickCount": 0,
  "createdAt": "2026-04-29T11:48:14.323+00:00"
}
```

### Redirect

```http
GET /{slug}
```

Returns:

```http
307 Temporary Redirect
Location: <cleanedUrl>
```

### Health Check

```http
GET /api/health
```

Response `200`:

```json
{
  "status": "ok",
  "runtime": "unknown",
  "deployment": null,
  "time": "2026-04-29T11:47:00.819Z"
}
```

### Error Responses

Common errors:

- `400` invalid JSON, missing URL, unsupported protocol, or invalid URL.
- `404` unknown, malformed, reserved, inactive, or expired slug.
- `429` creation rate limit exceeded.
- `500` unexpected server/Appwrite failure.

Example:

```json
{
  "error": "Rate limit exceeded. Try again in a moment."
}
```

## Rate Limiting

Link creation is limited to 2 requests per second per identity.

Identity resolution:

1. `Authorization: Bearer <key>` or `x-api-key: <key>` creates an API-key
   identity.
2. Requests without an API key fall back to an anonymous IP-based identity.

The limiter uses Appwrite `rate_limits` documents with deterministic IDs per
scope, identity hash, and second. Counts are incremented atomically with
Appwrite document attribute increments.

## MCP Usage

Linkshort can be used by AI agents through MCP.

### Hosted Streamable HTTP

The hosted route is:

```text
https://your-domain/api/mcp
```

Example MCP client configuration:

```json
{
  "mcpServers": {
    "linkshort": {
      "type": "http",
      "url": "https://your-domain/api/mcp",
      "headers": {
        "x-api-key": "optional-api-key"
      }
    }
  }
}
```

### Local Stdio

Run the local stdio transport from the repository:

```sh
LINKSHORT_API_KEY=optional-api-key bun run mcp:stdio
```

For PowerShell:

```powershell
$env:LINKSHORT_API_KEY = "optional-api-key"
bun run mcp:stdio
```

### MCP Tools

#### `create_short_link`

Creates a short link from a URL and stores the cleaned destination.

Input:

```json
{
  "url": "https://example.com/?utm_source=agent&keep=1"
}
```

Output text contains JSON:

```json
{
  "slug": "aB3xQ9",
  "shortUrl": "https://your-domain/aB3xQ9",
  "cleanedUrl": "https://example.com/?keep=1",
  "platform": "web"
}
```

This tool uses the same Appwrite-backed creation rate limit as the website and
REST API.

#### `clean_url`

Strips tracking parameters without creating a short link.

Input:

```json
{
  "url": "https://example.com/?utm_campaign=spring&keep=1"
}
```

Output text contains JSON:

```json
{
  "originalUrl": "https://example.com/?utm_campaign=spring&keep=1",
  "cleanedUrl": "https://example.com/?keep=1",
  "host": "example.com",
  "platform": "web"
}
```

#### `get_link_info`

Looks up metadata for an existing short link.

Input:

```json
{
  "slug": "aB3xQ9"
}
```

Output text contains JSON:

```json
{
  "slug": "aB3xQ9",
  "cleanedUrl": "https://example.com/?keep=1",
  "originalUrl": "https://example.com/?utm_campaign=spring&keep=1",
  "platform": "web",
  "clickCount": 0,
  "createdAt": "2026-04-29T11:48:14.323+00:00"
}
```

## Implementation Notes

- `src/lib/url-cleaner.ts` owns validation and tracking-parameter removal.
- `src/lib/platforms.ts` owns platform detection.
- `src/lib/slug.ts` owns six-character slug generation and reserved slug checks.
- `src/lib/link-service.ts` owns link creation, lookup, and click counting.
- `src/lib/rate-limit.ts` owns the Appwrite-backed fixed-window limiter.
- `src/mcp/server.ts` registers MCP tools and reuses the same service layer.
- `src/app/api/mcp/route.ts` exposes the hosted MCP Streamable HTTP transport.
- `functions/cleanup-rate-limits/src/main.ts` deletes expired rate-limit rows.

The public short URL format intentionally stays as `/{slug}`. Platform names are
stored as metadata and are not embedded in redirect paths.

## Deployment

The intended production target is Appwrite:

- Appwrite Sites for the Next.js site, API routes, redirect route, and hosted MCP
  route.
- Appwrite Databases for short links, API keys, and rate-limit counters.
- Appwrite Functions for scheduled cleanup jobs.

Build settings:

```text
Install command: bun install
Build command: bun run build
Output directory: .next
Framework: Next.js
```

Before production launch, set `NEXT_PUBLIC_SITE_URL` to the real Appwrite/custom
domain so generated short links use the correct origin.

## Current Limitations

- API-key identities are parsed from request headers, but full API-key
  validation against the `api_keys` table should be added before offering public
  API keys.
- The rate limiter uses Appwrite documents instead of Redis. It fits the
  Appwrite-only goal, but production concurrency tests are still recommended.
- The MCP HTTP route is implemented through the Next.js App Router. A standalone
  Appwrite Function fallback can be added if a client needs longer-lived or
  sessionful transport behavior.

## License

Private project.
