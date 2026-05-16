import {
  buildShortUrl,
  enforceCreateLimit,
  errorResponse,
  jsonResponse,
} from '@/lib/api-helpers'
import { createShortLink } from '@/lib/link-service'
import { rateLimitHeaders } from '@/lib/rate-limit'
import { z } from 'zod'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const CreateLinkBody = z.object({
  url: z.string().min(1).max(2048),
})

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return errorResponse(400, 'Invalid JSON body')
  }
  const parsed = CreateLinkBody.safeParse(body)
  if (!parsed.success) {
    return errorResponse(400, parsed.error.issues[0]?.message ?? 'Invalid body')
  }

  const limit = await enforceCreateLimit(req.headers)
  if (!limit.ok) return limit.response

  const result = await createShortLink(parsed.data.url, limit.identity)
  if (!result.ok) {
    return jsonResponse(
      { error: result.error },
      { status: result.status, headers: rateLimitHeaders(limit.result) }
    )
  }

  const url = new URL(req.url)
  return jsonResponse(
    {
      slug: result.row.slug,
      shortUrl: buildShortUrl(
        result.row.slug,
        result.row.platform,
        url,
        req.headers
      ),
      originalUrl: result.row.originalUrl,
      cleanedUrl: result.row.cleanedUrl,
      platform: result.row.platform,
      platformHost: result.row.platformHost,
      createdAt: result.row.$createdAt,
    },
    { status: 201, headers: rateLimitHeaders(limit.result) }
  )
}
