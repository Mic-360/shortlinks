import { z } from 'zod'
import { errorResponse, jsonResponse } from '@/lib/api-helpers'
import { detectPlatform } from '@/lib/platforms'
import { cleanUrl } from '@/lib/url-cleaner'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const Body = z.object({ url: z.string().min(1).max(2048) })

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return errorResponse(400, 'Invalid JSON body')
  }
  const parsed = Body.safeParse(body)
  if (!parsed.success) {
    return errorResponse(400, parsed.error.issues[0]?.message ?? 'Invalid body')
  }
  const result = cleanUrl(parsed.data.url)
  if (!result.ok) return errorResponse(400, result.error)
  return jsonResponse({
    originalUrl: result.originalUrl,
    cleanedUrl: result.cleanedUrl,
    host: result.host,
    platform: detectPlatform(result.host),
  })
}
