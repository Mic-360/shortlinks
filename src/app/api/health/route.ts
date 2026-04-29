import { jsonResponse } from '@/lib/api-helpers'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  return jsonResponse({
    status: 'ok',
    runtime: process.env.APPWRITE_SITE_RUNTIME_NAME ?? 'unknown',
    deployment: process.env.APPWRITE_SITE_DEPLOYMENT ?? null,
    time: new Date().toISOString(),
  })
}
