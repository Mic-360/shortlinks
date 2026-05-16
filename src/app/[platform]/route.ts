import { getShortLink, recordClick } from '@/lib/link-service'
import { notFound } from 'next/navigation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ platform: string }> }
) {
  const { platform: slug } = await params
  const result = await getShortLink(slug)
  if (!result.ok) notFound()
  void recordClick(slug)
  return Response.redirect(result.row.cleanedUrl, 307)
}
