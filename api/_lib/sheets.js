/**
 * Shared helper for talking to the Google Apps Script web app that owns the
 * enquiries Sheet. Files in api/_lib are not exposed as routes by Vercel.
 */

const TIMEOUT_MS = 10000

export function sheetsConfigured() {
  return Boolean(process.env.GOOGLE_SHEETS_WEBHOOK_URL && process.env.GOOGLE_SHEETS_SECRET)
}

/** POSTs `body` (plus the shared secret) to Apps Script; resolves to its JSON reply or throws. */
export async function callSheet(body) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(process.env.GOOGLE_SHEETS_WEBHOOK_URL, {
      method: 'POST',
      // text/plain keeps Apps Script happy; the script parses the JSON itself.
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ ...body, secret: process.env.GOOGLE_SHEETS_SECRET }),
      redirect: 'follow',
      signal: controller.signal,
    })
    const result = await res.json().catch(() => null)
    if (!res.ok || !result?.ok) {
      throw new Error(`Sheet request failed (${res.status}): ${result?.error || 'no JSON reply'}`)
    }
    return result
  } finally {
    clearTimeout(timer)
  }
}

/** Vercel parses JSON bodies, but be tolerant of a raw string. Returns null when invalid. */
export function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body)
    } catch {
      return null
    }
  }
  return {}
}
