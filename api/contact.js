/**
 * Vercel serverless function: receives the contact form (JSON POST from
 * src/services/contactAdapter.js) and forwards it to a Google Apps Script web
 * app that appends a row to the enquiries Google Sheet.
 *
 * Server-only environment variables (Vercel → Settings → Environment Variables):
 *   GOOGLE_SHEETS_WEBHOOK_URL  the Apps Script "Web app" URL (ends in /exec)
 *   GOOGLE_SHEETS_SECRET       shared secret, must match SECRET in the Apps Script
 *
 * Neither is exposed to the browser.
 */

const FIELDS = {
  name: 120,
  email: 254,
  phone: 40,
  company: 160,
  service: 120,
  budget: 80,
  message: 5000,
}
const REQUIRED = ['name', 'email', 'service', 'message']
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const TIMEOUT_MS = 10000

function clean(body) {
  const out = {}
  for (const [key, max] of Object.entries(FIELDS)) {
    out[key] = String(body?.[key] ?? '').trim().slice(0, max)
  }
  return out
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  const webhook = process.env.GOOGLE_SHEETS_WEBHOOK_URL
  const secret = process.env.GOOGLE_SHEETS_SECRET
  if (!webhook || !secret) {
    console.error('contact: GOOGLE_SHEETS_WEBHOOK_URL / GOOGLE_SHEETS_SECRET not set')
    return res.status(500).json({ ok: false, error: 'Not configured' })
  }

  let body = req.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      return res.status(400).json({ ok: false, error: 'Invalid JSON' })
    }
  }

  // Honeypot: bots fill hidden fields. Pretend success, store nothing.
  if (body?.website) return res.status(200).json({ ok: true })

  const data = clean(body)
  const missing = REQUIRED.filter((k) => !data[k])
  if (missing.length || !EMAIL_RE.test(data.email)) {
    return res.status(400).json({ ok: false, error: 'Invalid submission' })
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const upstream = await fetch(webhook, {
      method: 'POST',
      // text/plain keeps Apps Script happy; the script parses the JSON itself.
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        ...data,
        secret,
        source: 'iyra-website',
        page: String(req.headers.referer || '').slice(0, 300),
        userAgent: String(req.headers['user-agent'] || '').slice(0, 300),
      }),
      redirect: 'follow',
      signal: controller.signal,
    })
    const result = await upstream.json().catch(() => null)
    if (!upstream.ok || !result?.ok) {
      console.error('contact: sheet write failed', upstream.status, result)
      return res.status(502).json({ ok: false, error: 'Could not save enquiry' })
    }
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('contact: sheet request error', err)
    return res.status(502).json({ ok: false, error: 'Could not save enquiry' })
  } finally {
    clearTimeout(timer)
  }
}
