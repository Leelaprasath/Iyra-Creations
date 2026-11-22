import { SITE } from '../config/site'

/**
 * Official IYRA social / messaging profiles, shown in the footer.
 * Shape: { id, label, href }
 */
export const socialLinks = [
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    href: `https://wa.me/${SITE.phone.digits}?text=${encodeURIComponent(SITE.whatsappMessage)}`,
  },
  {
    id: 'instagram',
    label: 'Instagram',
    href: 'https://www.instagram.com/iyracreations_/',
  },
]
