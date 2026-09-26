/**
 * IYRA Creations logo geometry — a vector redraw of the supplied logo:
 * an open bracket frame, heavy "IYRA" letterforms and "CREATIONS" in a
 * classic serif, set in the gap of the frame's lower edge.
 *
 * Single source for the DOM logo (components/ui/Logo), the favicon and the
 * particle intro (3d/particles/sampleLogo). If an official vector file is
 * provided, replace these paths with it.
 */
export const LOGO_VIEWBOX = { x: 40, y: 170, width: 430, height: 186 }

/** Filled shapes, in reveal order. `order` groups parts for staggered particle formation. */
export const LOGO_PARTS = [
  { id: 'I', order: 0, d: 'M76 206H102V305H76Z' },
  { id: 'Y', order: 1, d: 'M107 206H137L160 246L183 206H213L173 263V305H147V263Z' },
  {
    id: 'R',
    order: 2,
    d: 'M219 206H276C301 206 313 221 313 235C313 251 302 261 286 264L324 305H293L260 266H245V305H219ZM245 226V247H272C282 247 287 242 287 236C287 230 282 226 272 226Z',
  },
  { id: 'A', order: 3, d: 'M354 206H385L426 305H398L390 284H347L340 305H327ZM355 264H383L369 227Z' },
  { id: 'frameLeft', order: 4, d: 'M50 185H328L334 194H59V305H150V313H50Z' },
  { id: 'frameRight', order: 4, d: 'M343 185H460V313H355V305H451V194H349Z' },
]

export const LOGO_TAGLINE = {
  text: 'CREATIONS',
  x: 255,
  y: 344,
  size: 25,
  letterSpacing: 2.5,
  order: 5,
  fontFamily: "'Cinzel', 'Trajan Pro', Georgia, 'Times New Roman', serif",
}
