export type Platform =
  | 'linkedin'
  | 'youtube'
  | 'instagram'
  | 'twitter'
  | 'google_drive'
  | 'google_docs'
  | 'google_sheets'
  | 'google_forms'
  | 'google_maps'
  | 'facebook'
  | 'tiktok'
  | 'reddit'
  | 'github'
  | 'notion'
  | 'figma'
  | 'amazon'
  | 'medium'
  | 'whatsapp'
  | 'telegram'
  | 'discord'
  | 'spotify'
  | 'pinterest'
  | 'web'

const RULES: { platform: Platform; hosts: RegExp }[] = [
  { platform: 'linkedin', hosts: /(^|\.)linkedin\.com$|(^|\.)lnkd\.in$/i },
  { platform: 'youtube', hosts: /(^|\.)youtube\.com$|^youtu\.be$/i },
  { platform: 'instagram', hosts: /(^|\.)instagram\.com$/i },
  { platform: 'twitter', hosts: /(^|\.)(twitter|x)\.com$|(^|\.)t\.co$/i },
  { platform: 'google_drive', hosts: /(^|\.)drive\.google\.com$/i },
  { platform: 'google_docs', hosts: /(^|\.)docs\.google\.com$/i },
  { platform: 'google_sheets', hosts: /(^|\.)sheets\.google\.com$/i },
  { platform: 'google_forms', hosts: /(^|\.)forms\.google\.com$|(^|\.)forms\.gle$/i },
  { platform: 'google_maps', hosts: /(^|\.)(maps\.google\.com|goo\.gl|maps\.app\.goo\.gl)$/i },
  { platform: 'facebook', hosts: /(^|\.)(facebook\.com|fb\.me|fb\.watch)$/i },
  { platform: 'tiktok', hosts: /(^|\.)(tiktok\.com|vm\.tiktok\.com)$/i },
  { platform: 'reddit', hosts: /(^|\.)(reddit\.com|redd\.it)$/i },
  { platform: 'github', hosts: /(^|\.)github\.com$|(^|\.)gist\.github\.com$/i },
  { platform: 'notion', hosts: /(^|\.)notion\.(so|site)$/i },
  { platform: 'figma', hosts: /(^|\.)figma\.com$/i },
  { platform: 'amazon', hosts: /(^|\.)amazon\.[a-z.]+$|(^|\.)a\.co$/i },
  { platform: 'medium', hosts: /(^|\.)medium\.com$/i },
  { platform: 'whatsapp', hosts: /(^|\.)(whatsapp\.com|wa\.me)$/i },
  { platform: 'telegram', hosts: /(^|\.)(telegram\.org|t\.me)$/i },
  { platform: 'discord', hosts: /(^|\.)(discord\.com|discord\.gg)$/i },
  { platform: 'spotify', hosts: /(^|\.)spotify\.com$/i },
  { platform: 'pinterest', hosts: /(^|\.)(pinterest\.[a-z.]+|pin\.it)$/i },
]

export function detectPlatform(host: string): Platform {
  const h = host.toLowerCase()
  for (const r of RULES) {
    if (r.hosts.test(h)) return r.platform
  }
  return 'web'
}

const LABELS: Record<Platform, string> = {
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
  instagram: 'Instagram',
  twitter: 'X / Twitter',
  google_drive: 'Google Drive',
  google_docs: 'Google Docs',
  google_sheets: 'Google Sheets',
  google_forms: 'Google Forms',
  google_maps: 'Google Maps',
  facebook: 'Facebook',
  tiktok: 'TikTok',
  reddit: 'Reddit',
  github: 'GitHub',
  notion: 'Notion',
  figma: 'Figma',
  amazon: 'Amazon',
  medium: 'Medium',
  whatsapp: 'WhatsApp',
  telegram: 'Telegram',
  discord: 'Discord',
  spotify: 'Spotify',
  pinterest: 'Pinterest',
  web: 'Web',
}

export function platformLabel(p: Platform): string {
  return LABELS[p]
}
