import { adminConfigured, checkCredentials, sessionCookie } from '../_lib/auth.js'
import { readJson } from '../_lib/sheets.js'

const FAIL_DELAY_MS = 800

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }
  if (!adminConfigured()) {
    console.error('admin: ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_SESSION_SECRET not set')
    return res.status(500).json({ ok: false, error: 'Admin login is not configured' })
  }

  const body = readJson(req) || {}
  if (!checkCredentials(body.email, body.password)) {
    // Slow down guessing.
    await new Promise((r) => setTimeout(r, FAIL_DELAY_MS))
    return res.status(401).json({ ok: false, error: 'Incorrect email or password' })
  }

  const email = String(body.email).trim().toLowerCase()
  res.setHeader('Set-Cookie', sessionCookie(email))
  return res.status(200).json({ ok: true, email })
}
