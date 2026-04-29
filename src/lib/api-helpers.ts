import 'server-only'
import { anonymousIdentity, apiKeyIdentity, extractApiKey, type Identity } from './identity'
import { platformPathSegment } from './platforms'
import { checkRateLimit, rateLimitHeaders, type RateLimitResult } from './rate-limit'

export function publicSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL
  if (fromEnv && fromEnv.length > 0) return fromEnv.replace(/\/$/, '')
  return ''
}

function forwardedOrigin(headers: Headers): string {
  const host = headers.get('x-forwarded-host') ?? headers.get('host')
  if (!host) return ''
  const proto = headers.get('x-forwarded-proto') ?? 'https'
  return `${proto.split(',')[0]?.trim() || 'https'}://${host.split(',')[0]?.trim()}`
}

export function requestOrigin(requestUrl: URL, headers?: Headers): string {
  return publicSiteUrl() || (headers ? forwardedOrigin(headers) : '') || requestUrl.origin
}

export function buildShortUrl(slug: string, platform: string, requestUrl: URL, headers?: Headers): string {
  const base = requestOrigin(requestUrl, headers)
  return `${base}/${platformPathSegment(platform)}/${slug}`
}

export function resolveIdentity(headers: Headers): Identity {
  const raw = extractApiKey(headers)
  if (raw) return apiKeyIdentity(raw)
  return anonymousIdentity(headers)
}

export type RateLimited =
  | { ok: true; identity: Identity; result: RateLimitResult }
  | { ok: false; response: Response }

export async function enforceCreateLimit(headers: Headers): Promise<RateLimited> {
  const identity = resolveIdentity(headers)
  const result = await checkRateLimit(identity)
  if (result.ok) return { ok: true, identity, result }
  const headersObj: Record<string, string> = {
    'Content-Type': 'application/json',
    'Retry-After': '1',
    ...rateLimitHeaders(result),
  }
  return {
    ok: false,
    response: new Response(
      JSON.stringify({ error: 'Rate limit exceeded. Try again in a moment.' }),
      { status: 429, headers: headersObj },
    ),
  }
}

export function jsonResponse(body: unknown, init?: ResponseInit): Response {
  const headers = new Headers(init?.headers)
  if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
  return new Response(JSON.stringify(body), { ...init, headers })
}

export function errorResponse(status: number, error: string): Response {
  return jsonResponse({ error }, { status })
}
