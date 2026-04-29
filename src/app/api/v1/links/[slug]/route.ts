import { buildShortUrl, errorResponse, jsonResponse } from '@/lib/api-helpers'
import { getShortLink } from '@/lib/link-service'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const result = await getShortLink(slug)
  if (!result.ok) return errorResponse(result.status, result.error)

  const url = new URL(req.url)
  return jsonResponse({
    slug: result.row.slug,
    shortUrl: buildShortUrl(result.row.slug, result.row.platform, url, req.headers),
    cleanedUrl: result.row.cleanedUrl,
    originalUrl: result.row.originalUrl,
    platform: result.row.platform,
    platformHost: result.row.platformHost,
    clickCount: result.row.clickCount,
    createdAt: result.row.$createdAt,
  })
}
