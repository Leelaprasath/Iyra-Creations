// Generates public/brand/iyra-logo.svg and public/favicon.svg from src/brand/logo.js.
// Run: npm run brand
import { mkdirSync, writeFileSync } from 'node:fs'
import { LOGO_MARK_PARTS, LOGO_PARTS, LOGO_VIEWBOX } from '../src/brand/logo.js'

const { x, y, width, height } = LOGO_VIEWBOX
const paths = LOGO_PARTS.map((p) => `<path fill-rule="evenodd" d="${p.d}"/>`).join('')

const logo = (color) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${width} ${height}" fill="${color}" role="img" aria-label="IYRA Creations"><title>IYRA Creations</title>${paths}</svg>\n`

mkdirSync('public/brand', { recursive: true })
writeFileSync('public/brand/iyra-logo-white.svg', logo('#FFFFFF'))
writeFileSync('public/brand/iyra-logo-black.svg', logo('#000000'))

// Favicon: the framed IYRA letters (tagline dropped — unreadable at 16px) on black.
const letters = LOGO_MARK_PARTS.map((p) => `<path fill-rule="evenodd" d="${p.d}"/>`).join('')
const pad = 22
// Square canvas centred on the frame (x 50–460, y 184–346).
const side = 410 + pad * 2
const fx = 50 - pad
const fy = 265 - side / 2
writeFileSync(
  'public/favicon.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${fx} ${fy} ${side} ${side}"><rect x="${fx}" y="${fy}" width="${side}" height="${side}" rx="64" fill="#000"/><g fill="#fff">${letters}</g></svg>
`,
)
console.log('brand assets written')
