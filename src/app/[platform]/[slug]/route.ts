import { getShortLink, recordClick } from '@/lib/link-service'
import { isPlatformPathSegment, platformPathSegment } from '@/lib/platforms'
import { notFound } from 'next/navigation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ platform: string; slug: string }> }
) {
  const { platform, slug } = await params
  if (!isPlatformPathSegment(platform)) notFound()

  const result = await getShortLink(slug)
  if (!result.ok) notFound()
  if (platformPathSegment(result.row.platform) !== platform) notFound()

  void recordClick(slug)
  return Response.redirect(result.row.cleanedUrl, 307)
}
