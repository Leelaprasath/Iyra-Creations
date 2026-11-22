/** Deployment-specific values come from environment variables (see .env.example). */
const env = import.meta.env ?? {}

export const SITE = {
  name: 'IYRA Creations',
  url: env.VITE_SITE_URL || '',
  contactEmail: env.VITE_CONTACT_EMAIL || 'iyracreationss@gmail.com',
  contactEndpoint: env.VITE_CONTACT_ENDPOINT || '',
  /** Display format and the digits-only form used for tel: and WhatsApp links. */
  phone: { display: '+91 76958 21566', digits: '917695821566' },
  whatsappMessage: "Hi Iyra Creations, I'd like to discuss a project.",
}
