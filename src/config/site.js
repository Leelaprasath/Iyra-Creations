/** Deployment-specific values come from environment variables (see .env.example). */
const env = import.meta.env ?? {}

export const SITE = {
  name: 'IYRA Creations',
  url: env.VITE_SITE_URL || '',
  contactEmail: env.VITE_CONTACT_EMAIL || '',
  contactEndpoint: env.VITE_CONTACT_ENDPOINT || '',
}
