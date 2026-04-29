import { LinkForm } from '@/components/link-form'
import Link from 'next/link'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

const FAQ = [
  {
    q: 'Why another link shortener?',
    a: 'Most shorteners track you. This one strips utm_* and friends before the redirect ever happens, and the source is open enough to audit.',
  },
  {
    q: 'Are short links permanent?',
    a: 'They live as long as the project does. We use a temporary redirect (307) so you can change a destination later without breaking links.',
  },
  {
    q: 'Is there a rate limit?',
    a: 'Two link creations per second per IP or API key. Reads (the redirects) are not limited.',
  },
  {
    q: 'How is this different from a paid plan elsewhere?',
    a: 'You get the website, REST API, and MCP server for AI agents from one codebase, deployed on Appwrite. No analytics-on-by-default, no paywall.',
  },
]

const PLATFORM_EXAMPLES = [
  {
    label: 'YouTube',
    host: 'youtube.com',
    note: 'Preserves v= and list= params.',
  },
  {
    label: 'Google Drive',
    host: 'drive.google.com',
    note: 'Keeps file IDs and view modes.',
  },
  {
    label: 'LinkedIn',
    host: 'linkedin.com',
    note: 'Strips trk= and ref= cleanly.',
  },
  { label: 'X / Twitter', host: 'x.com', note: 'Drops s=, t=, and ref_src=.' },
  {
    label: 'Instagram',
    host: 'instagram.com',
    note: 'Removes igshid= and igsh=.',
  },
  { label: 'Notion', host: 'notion.site', note: 'Keeps the page slug intact.' },
]

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Linkshort',
  url: SITE_URL,
  image: `${SITE_URL}/logo.png`,
  description:
    'A quiet, editorial link shortener. Strips trackers, detects platforms, ships an MCP server for AI agents.',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  publisher: {
    '@type': 'Organization',
    name: 'Linkshort',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
  },
}

const FAQ_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_LD) }}
      />

      <section className="hero">
        <div className="shell">
          <p className="eyebrow">An editorial link shortener</p>
          <h1>Quiet links. No trackers. Just the URL.</h1>
          <p className="lede">
            Paste any URL. We strip the tracking params, detect the platform,
            and hand you a six-character short link backed by Appwrite. The same
            engine ships as a REST API and an MCP server.
          </p>
          <LinkForm />
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <p className="eyebrow">Cleaning</p>
          <h2>What gets stripped, what stays.</h2>
          <div className="grid-2">
            <div>
              <h3>Removed</h3>
              <p>
                <code>utm_*</code>, <code>fbclid</code>, <code>gclid</code>,{' '}
                <code>msclkid</code>, <code>mc_cid</code>, <code>igshid</code>,{' '}
                <code>ref</code>, <code>ref_src</code>, <code>spm</code>,{' '}
                <code>yclid</code>, and dozens more.
              </p>
            </div>
            <div>
              <h3>Preserved</h3>
              <p>
                YouTube <code>v</code>/<code>list</code>, Google Drive file IDs,
                document anchors, and any param the destination actually needs.
                Cleaning should never break a link.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <p className="eyebrow">Platforms</p>
          <h2>Recognised at a glance.</h2>
          <p style={{ maxWidth: '60ch', color: 'var(--ink-soft)' }}>
            Platform detection is metadata only — every short link still
            redirects from <code>/{`{slug}`}</code>. The platform helps you
            understand at a glance what kind of link you just shortened.
          </p>
          <div className="grid-3" style={{ marginTop: '2rem' }}>
            {PLATFORM_EXAMPLES.map((p) => (
              <article key={p.host} className="card">
                <h3>{p.label}</h3>
                <p className="platform-host">{p.host}</p>
                <p style={{ color: 'var(--ink-soft)', fontSize: '0.95rem' }}>
                  {p.note}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <p className="eyebrow">Programmable</p>
          <h2>Three doors into the same engine.</h2>
          <div className="grid-3">
            <article className="card">
              <h3>Website</h3>
              <p>Paste, copy, done. The form above.</p>
            </article>
            <article className="card">
              <h3>
                <Link href="/docs/api">REST API</Link>
              </h3>
              <p>
                <code>POST /api/v1/links</code> from any language. JSON in, JSON
                out, with the same rate limit as the website.
              </p>
            </article>
            <article className="card">
              <h3>
                <Link href="/docs/mcp">MCP server</Link>
              </h3>
              <p>
                Drop into Claude Desktop or any MCP-aware agent. Three tools:
                create, clean, and look up.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <p className="eyebrow">Trust</p>
          <h2>Boring, on purpose.</h2>
          <p style={{ maxWidth: '62ch' }}>
            No third-party analytics, no banner consent forms, no email signup
            wall. Click counts are aggregate integers stored against the link
            itself. Rate-limit identifiers are SHA-256 hashes, never raw IPs.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <p className="eyebrow">FAQ</p>
          <h2>Answers, not a sales pitch.</h2>
          <dl className="faq">
            {FAQ.map((item) => (
              <div key={item.q}>
                <dt>{item.q}</dt>
                <dd>{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  )
}
