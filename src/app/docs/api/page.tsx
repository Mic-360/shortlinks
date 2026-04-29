import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'REST API',
  description:
    'JSON API for the Linkshort link shortener. Create short links, clean URLs, and look up metadata.',
  alternates: { canonical: '/docs/api' },
}

const BREADCRUMB_LD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
    { '@type': 'ListItem', position: 2, name: 'API', item: '/docs/api' },
  ],
}

export default function ApiDocsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_LD) }}
      />
      <section className="section">
        <div className="shell" style={{ maxWidth: 760 }}>
          <p className="eyebrow">REST API</p>
          <h1>JSON in, JSON out.</h1>
          <p className="lede">
            Every endpoint runs inside Appwrite Sites. Rate limit: 2 creations
            per second per IP or API key.
          </p>

          <h2>POST /api/v1/links</h2>
          <p>Create a short link.</p>
          <pre>{`curl -X POST https://shortlinks.bhaumicsingh.tech/api/v1/links \
  -H 'Content-Type: application/json' \\
          -H 'Authorization: Bearer <optional-linkshort-api-key>' \
          -d '{"url":"https://drive.google.com/file/d/example/view?usp=drive_link"}'`}</pre>
          <pre>{`{
  "slug": "aB3xQ9",
          "shortUrl": "https://shortlinks.bhaumicsingh.tech/google_drive/aB3xQ9",
          "originalUrl": "https://drive.google.com/file/d/example/view?usp=drive_link",
          "cleanedUrl": "https://drive.google.com/file/d/example/view",
          "platform": "google_drive",
          "platformHost": "drive.google.com",
  "createdAt": "2026-01-01T00:00:00.000Z"
}`}</pre>

          <h2>GET /api/v1/links/:slug</h2>
          <p>Read metadata for an existing link.</p>

          <h2>GET /:platform/:slug</h2>
          <p>
            Follow a generated short link, for example{' '}
            <code>/google_drive/aB3xQ9</code>. Older slug-only links continue to
            redirect for compatibility.
          </p>

          <h2>POST /api/v1/clean</h2>
          <p>
            Strip tracking params without creating a short link. Useful as a
            preview step before saving.
          </p>

          <h2>GET /api/health</h2>
          <p>Lightweight readiness probe.</p>

          <h2>Errors</h2>
          <p>
            <code>400</code> — invalid URL or body. <code>404</code> — slug not
            found, expired, or reserved. <code>429</code> — rate limit, with{' '}
            <code>Retry-After: 1</code>.
          </p>
        </div>
      </section>
    </>
  )
}
