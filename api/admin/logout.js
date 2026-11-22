import { clearedCookie } from '../_lib/auth.js'

export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }
  res.setHeader('Set-Cookie', clearedCookie())
  return res.status(200).json({ ok: true })
}
