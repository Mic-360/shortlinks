import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import './globals.css'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
const SITE_NAME = 'Linkshort'
const DESCRIPTION =
  'A quiet, editorial link shortener. Strips trackers, detects platforms, ships an MCP server for AI agents.'
const OG_IMAGE = '/opengraph-image'
const LOGO_IMAGE = '/logo.png'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — clean, short links`,
    template: `%s · ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  category: 'technology',
  keywords: [
    'link shortener',
    'url cleaner',
    'tracker-free links',
    'mcp link shortener',
    'short url',
    'utm stripper',
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: { canonical: '/' },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: `${SITE_NAME} — clean, short links`,
    description: DESCRIPTION,
    url: SITE_URL,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — clean, short links`,
      },
      {
        url: LOGO_IMAGE,
        width: 1254,
        height: 1254,
        alt: `${SITE_NAME} logo`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — clean, short links`,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
  },
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: 'default',
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport: Viewport = {
  themeColor: '#7a8b6f',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <header className="site-header">
          <div className="shell">
            <Link href="/" className="brand" aria-label={`${SITE_NAME} home`}>
              <span className="brand-mark" aria-hidden="true" />
              {SITE_NAME}
            </Link>
            <nav className="primary" aria-label="Primary">
              <Link href="/docs/api">API</Link>
              <Link href="/docs/mcp">MCP</Link>
              <a href="https://github.com" rel="noreferrer">
                GitHub
              </a>
            </nav>
          </div>
        </header>
        <main id="main">{children}</main>
        <footer className="site-footer">
          <div className="shell">
            <span>
              © {new Date().getFullYear()} {SITE_NAME}. Built on Appwrite.
            </span>
            <span>
              <Link href="/docs/api">API</Link> ·{' '}
              <Link href="/docs/mcp">MCP</Link>
            </span>
          </div>
        </footer>
      </body>
    </html>
  )
}
