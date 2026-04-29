'use client'

import { useState } from 'react'

type CreateResponse = {
  slug: string
  shortUrl: string
  cleanedUrl: string
  originalUrl: string
  platform: string
  platformHost: string
  createdAt: string
}

export function LinkForm() {
  const [url, setUrl] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<CreateResponse | null>(null)
  const [status, setStatus] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    setError(null)
    setResult(null)
    setStatus('')
    try {
      const res = await fetch('/api/v1/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const body = (await res.json()) as CreateResponse | { error: string }
      if (!res.ok || 'error' in body) {
        setError('error' in body ? body.error : 'Something went wrong.')
        return
      }
      setResult(body)
    } catch {
      setError('Network error. Try again.')
    } finally {
      setBusy(false)
    }
  }

  async function copy() {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result.shortUrl)
      setStatus('Copied to clipboard')
      setTimeout(() => setStatus(''), 1800)
    } catch {
      setStatus('Press ⌘/Ctrl-C to copy')
    }
  }

  function reset() {
    setUrl('')
    setResult(null)
    setError(null)
    setStatus('')
  }

  return (
    <div>
      <form className="link-form" onSubmit={submit} aria-label="Shorten a URL">
        <label htmlFor="url-input" className="visually-hidden" hidden>
          URL to shorten
        </label>
        <div className="row">
          <input
            id="url-input"
            type="url"
            placeholder="Paste a long URL — LinkedIn, YouTube, Drive, anywhere"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            autoFocus
          />
          <button type="submit" disabled={busy || url.length === 0}>
            {busy ? 'Shortening…' : 'Shorten'}
          </button>
          {result && (
            <button type="button" className="secondary" onClick={reset}>
              New
            </button>
          )}
        </div>
        <p className="status" role="status" aria-live="polite">
          {status}
        </p>
      </form>

      {error && (
        <div className="result error" role="alert">
          {error}
        </div>
      )}

      {result && (
        <div className="result" aria-live="polite">
          <div className="short-url">
            <a href={result.shortUrl} target="_blank" rel="noreferrer">
              {result.shortUrl}
            </a>
            <button type="button" className="copy-btn" onClick={copy}>
              Copy
            </button>
          </div>
          <dl className="kv">
            <dt>Platform</dt>
            <dd>{result.platform}</dd>
            <dt>Original</dt>
            <dd>{result.originalUrl}</dd>
            <dt>Cleaned</dt>
            <dd>{result.cleanedUrl}</dd>
          </dl>
          {result.cleanedUrl !== result.originalUrl && (
            <p className="callout" style={{ marginTop: '1rem' }}>
              We removed tracking parameters before storing this link.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
