import { readSession } from '../_lib/auth.js'
import { callSheet, sheetsConfigured } from '../_lib/sheets.js'

/** GET → { ok, email, rows } for a signed-in admin; 401 otherwise. */
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  const session = readSession(req)
  if (!session) return res.status(401).json({ ok: false, error: 'Not signed in' })
  if (!sheetsConfigured()) return res.status(500).json({ ok: false, error: 'Google Sheets is not configured' })

  try {
    const { rows = [] } = await callSheet({ action: 'list' })
    return res.status(200).json({ ok: true, email: session.email, rows })
  } catch (err) {
    console.error('admin: could not read enquiries', err)
    return res.status(502).json({ ok: false, error: 'Could not load enquiries from Google Sheets' })
  }
}
