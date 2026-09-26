/** Contact form model + validation (pure; unit tested). */
export const EMPTY_CONTACT = {
  name: '',
  email: '',
  phone: '',
  company: '',
  service: '',
  budget: '',
  message: '',
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE = /^\+?[\d\s().-]{7,20}$/
export const MESSAGE_MIN = 20
export const MESSAGE_MAX = 4000

export function validateField(field, value) {
  const v = String(value ?? '').trim()
  switch (field) {
    case 'name':
      if (!v) return 'Please tell us your name.'
      if (v.length < 2) return 'Your name looks too short.'
      return ''
    case 'email':
      if (!v) return 'We need an email address to reply.'
      if (!EMAIL.test(v)) return 'Please enter a valid email address, like name@company.com.'
      return ''
    case 'phone':
      if (v && !PHONE.test(v)) return 'Please enter a valid phone number, or leave it empty.'
      return ''
    case 'service':
      if (!v) return 'Choose the service you are interested in.'
      return ''
    case 'message':
      if (!v) return 'Tell us a little about your project.'
      if (v.length < MESSAGE_MIN) return `A few more details help — at least ${MESSAGE_MIN} characters.`
      if (v.length > MESSAGE_MAX) return `Please keep it under ${MESSAGE_MAX} characters.`
      return ''
    default:
      return ''
  }
}

/** Returns { field: message } for every invalid field (empty object when valid). */
export function validateContact(values) {
  const errors = {}
  for (const field of Object.keys(EMPTY_CONTACT)) {
    const error = validateField(field, values[field])
    if (error) errors[field] = error
  }
  return errors
}

/** Trimmed payload sent to the submission adapter. */
export function toPayload(values) {
  return Object.fromEntries(Object.entries(values).map(([k, v]) => [k, String(v ?? '').trim()]))
}
