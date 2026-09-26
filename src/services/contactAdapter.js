import { SITE } from '../config/site'

/**
 * Contact submission adapter — the single place to connect the form to an
 * API, serverless function or form service. Configure VITE_CONTACT_ENDPOINT to
 * an endpoint that accepts a JSON POST. Until then submissions are NOT sent and
 * the form tells the visitor so (never a fake success).
 */
export class ContactNotConfiguredError extends Error {
  constructor() {
    super('Contact endpoint is not configured')
    this.name = 'ContactNotConfiguredError'
  }
}

const TIMEOUT_MS = 15000

export async function submitContact(payload, { endpoint = SITE.contactEndpoint, fetchImpl = globalThis.fetch } = {}) {
  if (!endpoint) throw new ContactNotConfiguredError()

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetchImpl(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ ...payload, source: 'iyra-website' }),
      signal: controller.signal,
    })
    if (!res.ok) throw new Error(`Contact request failed with status ${res.status}`)
    return true
  } finally {
    clearTimeout(timer)
  }
}

/** mailto: fallback carrying the visitor's message, used when no endpoint is configured. */
export function buildMailto(payload, email = SITE.contactEmail) {
  if (!email) return ''
  const subject = `Project enquiry — ${payload.service || 'IYRA Creations'}`
  const body = [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    payload.phone ? `Phone: ${payload.phone}` : null,
    payload.company ? `Company: ${payload.company}` : null,
    payload.service ? `Service: ${payload.service}` : null,
    payload.budget ? `Budget: ${payload.budget}` : null,
    '',
    payload.message,
  ]
    .filter((line) => line !== null)
    .join('\n')
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
