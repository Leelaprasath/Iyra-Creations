// Generates public/brand/iyra-logo.svg and public/favicon.svg from src/brand/logo.js.
// Run: npm run brand
import { mkdirSync, writeFileSync } from 'node:fs'
import { LOGO_PARTS, LOGO_TAGLINE, LOGO_VIEWBOX } from '../src/brand/logo.js'

const { x, y, width, height } = LOGO_VIEWBOX
const paths = LOGO_PARTS.map((p) => `<path fill-rule="evenodd" d="${p.d}"/>`).join('')
const tagline = `<text x="${LOGO_TAGLINE.x}" y="${LOGO_TAGLINE.y}" text-anchor="middle" font-family="${LOGO_TAGLINE.fontFamily.replace(/'/g, '')}" font-size="${LOGO_TAGLINE.size}" letter-spacing="${LOGO_TAGLINE.letterSpacing}">${LOGO_TAGLINE.text}</text>`

const logo = (color) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${width} ${height}" fill="${color}" role="img" aria-label="IYRA Creations"><title>IYRA Creations</title>${paths}${tagline}</svg>\n`

mkdirSync('public/brand', { recursive: true })
writeFileSync('public/brand/iyra-logo-white.svg', logo('#FFFFFF'))
writeFileSync('public/brand/iyra-logo-black.svg', logo('#000000'))

// Favicon: the framed IYRA letters (tagline dropped — unreadable at 16px) on black.
const letters = LOGO_PARTS.map((p) => `<path fill-rule="evenodd" d="${p.d}"/>`).join('')
const pad = 22
// Square canvas centred on the frame (x 50–460, y 185–313).
const side = 410 + pad * 2
const fx = 50 - pad
const fy = 249 - side / 2
writeFileSync(
  'public/favicon.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${fx} ${fy} ${side} ${side}"><rect x="${fx}" y="${fy}" width="${side}" height="${side}" rx="64" fill="#000"/><g fill="#fff">${letters}</g></svg>
`,
)
console.log('brand assets written')
