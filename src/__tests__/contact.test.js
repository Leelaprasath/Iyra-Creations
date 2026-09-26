import { describe, expect, it, vi } from 'vitest'
import { EMPTY_CONTACT, validateContact, validateField } from '../components/forms/validation'
import { buildMailto, ContactNotConfiguredError, submitContact } from '../services/contactAdapter'

const valid = {
  ...EMPTY_CONTACT,
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  service: 'Branding',
  message: 'We need a complete identity for a new studio.',
}

describe('contact validation', () => {
  it('accepts a complete enquiry', () => {
    expect(validateContact(valid)).toEqual({})
  })
  it('requires name, email, service and message', () => {
    expect(Object.keys(validateContact(EMPTY_CONTACT)).sort()).toEqual(['email', 'message', 'name', 'service'])
  })
  it('rejects malformed email and phone', () => {
    expect(validateField('email', 'ada@')).toBeTruthy()
    expect(validateField('phone', 'call me')).toBeTruthy()
    expect(validateField('phone', '+91 98765 43210')).toBe('')
  })
  it('requires a meaningful message', () => {
    expect(validateField('message', 'hi')).toBeTruthy()
  })
})

describe('contact adapter', () => {
  it('refuses to pretend when no endpoint is configured', async () => {
    await expect(submitContact(valid, { endpoint: '' })).rejects.toBeInstanceOf(ContactNotConfiguredError)
  })
  it('posts JSON to the configured endpoint', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: true })
    await submitContact(valid, { endpoint: 'https://api.example.com/contact', fetchImpl })
    const [url, init] = fetchImpl.mock.calls[0]
    expect(url).toBe('https://api.example.com/contact')
    expect(JSON.parse(init.body)).toMatchObject({ name: 'Ada Lovelace', source: 'iyra-website' })
  })
  it('surfaces server errors', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: false, status: 500 })
    await expect(submitContact(valid, { endpoint: 'https://x.test', fetchImpl })).rejects.toThrow('500')
  })
  it('builds a mailto fallback only when an address exists', () => {
    expect(buildMailto(valid, '')).toBe('')
    expect(buildMailto(valid, 'hello@example.com')).toMatch(/^mailto:hello@example\.com\?subject=/)
  })
})
