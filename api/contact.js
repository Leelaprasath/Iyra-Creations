import { callSheet, readJson, sheetsConfigured } from './_lib/sheets.js'

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

  if (!sheetsConfigured()) {
    console.error('contact: GOOGLE_SHEETS_WEBHOOK_URL / GOOGLE_SHEETS_SECRET not set')
    return res.status(500).json({ ok: false, error: 'Not configured' })
  }

  const body = readJson(req)
  if (!body) return res.status(400).json({ ok: false, error: 'Invalid JSON' })

  // Honeypot: bots fill hidden fields. Pretend success, store nothing.
  if (body.website) return res.status(200).json({ ok: true })

  const data = clean(body)
  const missing = REQUIRED.filter((k) => !data[k])
  if (missing.length || !EMAIL_RE.test(data.email)) {
    return res.status(400).json({ ok: false, error: 'Invalid submission' })
  }

  try {
    await callSheet({
      ...data,
      source: 'iyra-website',
      page: String(req.headers.referer || '').slice(0, 300),
      userAgent: String(req.headers['user-agent'] || '').slice(0, 300),
    })
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('contact: sheet write failed', err)
    return res.status(502).json({ ok: false, error: 'Could not save enquiry' })
  }
}
