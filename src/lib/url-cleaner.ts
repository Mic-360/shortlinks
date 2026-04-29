const TRACKING_PARAM_PREFIXES = ['utm_', 'mc_', 'pk_', 'hsa_', '_hs', 'oly_', 'vero_']

const TRACKING_PARAM_EXACT = new Set([
  'fbclid',
  'gclid',
  'gclsrc',
  'dclid',
  'msclkid',
  'mc_cid',
  'mc_eid',
  'igshid',
  'igsh',
  'ref',
  'ref_src',
  'ref_url',
  'spm',
  'wt_mc',
  'wt.mc_id',
  'yclid',
  'ysclid',
  'twclid',
  'tt_medium',
  'tt_content',
  'trk',
  'trkCampaign',
  's_kwcid',
  'cmpid',
  '__s',
  '_ga',
  '_gl',
  'sc_campaign',
  'sc_channel',
  'sc_content',
  'sc_medium',
])

export type CleanResult = {
  ok: true
  originalUrl: string
  cleanedUrl: string
  host: string
} | {
  ok: false
  error: string
}

function isTracking(name: string): boolean {
  const lower = name.toLowerCase()
  if (TRACKING_PARAM_EXACT.has(lower)) return true
  return TRACKING_PARAM_PREFIXES.some((p) => lower.startsWith(p))
}

export function cleanUrl(input: string): CleanResult {
  if (typeof input !== 'string') return { ok: false, error: 'URL must be a string' }
  const trimmed = input.trim()
  if (trimmed.length === 0) return { ok: false, error: 'URL is required' }
  if (trimmed.length > 2048) return { ok: false, error: 'URL too long' }

  let parsed: URL
  try {
    parsed = new URL(trimmed)
  } catch {
    return { ok: false, error: 'Invalid URL' }
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { ok: false, error: 'Only http and https URLs are supported' }
  }
  if (!parsed.hostname) return { ok: false, error: 'URL must include a host' }

  parsed.hostname = parsed.hostname.toLowerCase()

  const params = parsed.searchParams
  const drop: string[] = []
  for (const [k] of params) {
    if (isTracking(k)) drop.push(k)
  }
  for (const k of drop) params.delete(k)

  if (parsed.hash === '#' || parsed.hash === '#!') parsed.hash = ''

  return {
    ok: true,
    originalUrl: trimmed,
    cleanedUrl: parsed.toString(),
    host: parsed.hostname,
  }
}
