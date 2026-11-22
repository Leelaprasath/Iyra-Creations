import crypto from 'node:crypto'

/**
 * Admin login for the enquiries panel. One admin account, configured with
 * server-only env vars:
 *   ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_SESSION_SECRET (long random string)
 * A successful login sets a signed, HttpOnly session cookie (8 hours).
 */

const COOKIE = 'iyra_admin'
const MAX_AGE_S = 8 * 60 * 60

export function adminConfigured() {
  const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_SESSION_SECRET } = process.env
  return Boolean(ADMIN_EMAIL && ADMIN_PASSWORD && ADMIN_SESSION_SECRET)
}

const sha256 = (value) => crypto.createHash('sha256').update(String(value)).digest()
// Hash first so inputs of any length compare in constant time.
const safeEqual = (a, b) => crypto.timingSafeEqual(sha256(a), sha256(b))
const sign = (data) => crypto.createHmac('sha256', process.env.ADMIN_SESSION_SECRET).update(data).digest('base64url')

export function checkCredentials(email, password) {
  const emailOk = safeEqual(String(email || '').trim().toLowerCase(), process.env.ADMIN_EMAIL.trim().toLowerCase())
  const passwordOk = safeEqual(String(password || ''), process.env.ADMIN_PASSWORD)
  return emailOk && passwordOk
}

function cookieAttrs(maxAge) {
  return `Path=/api/admin; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`
}

export function sessionCookie(email) {
  const payload = Buffer.from(JSON.stringify({ email, exp: Date.now() + MAX_AGE_S * 1000 })).toString('base64url')
  return `${COOKIE}=${payload}.${sign(payload)}; ${cookieAttrs(MAX_AGE_S)}`
}

export function clearedCookie() {
  return `${COOKIE}=; ${cookieAttrs(0)}`
}

function readCookie(req, name) {
  if (req.cookies && name in req.cookies) return req.cookies[name]
  const header = req.headers?.cookie || ''
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=')
    if (k === name) return v.join('=')
  }
  return ''
}

/** Returns the session ({ email, exp }) when the cookie is valid and unexpired, else null. */
export function readSession(req) {
  if (!adminConfigured()) return null
  const [payload, mac] = readCookie(req, COOKIE).split('.')
  if (!payload || !mac || !safeEqual(mac, sign(payload))) return null
  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString())
    return session.exp > Date.now() ? session : null
  } catch {
    return null
  }
}
