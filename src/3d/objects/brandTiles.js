import { LOGO_PARTS, LOGO_TAGLINE, LOGO_VIEWBOX } from '../../brand/logo'
import { BRAND } from '../materials/palette'
import { createCanvasTexture } from '../utils/textures'

/** Tile texture size (matches the 1.05 × 1.3 world tile aspect). */
const TW = 256
const TH = 316
const FONT = "'Inter Variable', Inter, system-ui, sans-serif"

/** Draws the IYRA logo into a 2D canvas, `width` px wide, centred at (cx, cy). */
export function drawLogo(ctx, cx, cy, width, color, withTagline = true) {
  const k = width / LOGO_VIEWBOX.width
  ctx.save()
  ctx.translate(cx - (LOGO_VIEWBOX.width / 2) * k, cy - (LOGO_VIEWBOX.height / 2) * k)
  ctx.scale(k, k)
  ctx.translate(-LOGO_VIEWBOX.x, -LOGO_VIEWBOX.y)
  ctx.fillStyle = color
  LOGO_PARTS.forEach((p) => ctx.fill(new Path2D(p.d), 'evenodd'))
  if (withTagline) {
    ctx.font = `${LOGO_TAGLINE.size}px Georgia, 'Times New Roman', serif`
    ctx.textAlign = 'center'
    if ('letterSpacing' in ctx) ctx.letterSpacing = `${LOGO_TAGLINE.letterSpacing}px`
    ctx.fillText(LOGO_TAGLINE.text, LOGO_TAGLINE.x, LOGO_TAGLINE.y)
  }
  ctx.restore()
}

const label = (ctx, text, y = TH - 18, color = 'rgba(255,255,255,0.55)') => {
  ctx.font = `500 11px ${FONT}`
  if ('letterSpacing' in ctx) ctx.letterSpacing = '2px'
  ctx.fillStyle = color
  ctx.fillText(text.toUpperCase(), 16, y)
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px'
}

const DRAW = {
  mark(ctx) {
    ctx.fillStyle = '#050505'
    ctx.fillRect(0, 0, TW, TH)
    drawLogo(ctx, TW / 2, TH / 2 - 10, 200, BRAND.white)
    label(ctx, 'Primary mark')
  },
  colour(ctx) {
    const bands = [BRAND.orange, '#050505', BRAND.paper]
    bands.forEach((c, i) => {
      ctx.fillStyle = c
      ctx.fillRect(0, (i * TH) / 3, TW, TH / 3)
    })
    ctx.font = `600 12px ${FONT}`
    ;[
      ['#DB622B', '#000'],
      ['#000000', 'rgba(255,255,255,0.7)'],
      ['#FFFFFF', '#000'],
    ].forEach(([hex, col], i) => {
      ctx.fillStyle = col
      ctx.fillText(hex, 16, (i + 1) * (TH / 3) - 14)
    })
  },
  type(ctx) {
    ctx.fillStyle = '#0b0b0b'
    ctx.fillRect(0, 0, TW, TH)
    ctx.fillStyle = BRAND.white
    ctx.font = `800 118px ${FONT}`
    ctx.fillText('Aa', 14, 150)
    ctx.font = `400 15px ${FONT}`
    ctx.fillStyle = 'rgba(255,255,255,0.65)'
    ctx.fillText('Inter — Display 800', 16, 196)
    ctx.fillText('ABCDEFGHIJKLM', 16, 222)
    ctx.fillText('0123456789', 16, 246)
    label(ctx, 'Typography')
  },
  pattern(ctx) {
    ctx.fillStyle = '#080808'
    ctx.fillRect(0, 0, TW, TH)
    ctx.strokeStyle = BRAND.orange
    ctx.lineWidth = 3
    // The Y's chevron, repeated as a brand pattern.
    for (let y = -10; y < TH + 20; y += 34) {
      for (let x = (y / 34) % 2 ? 0 : 17; x < TW + 20; x += 34) {
        ctx.beginPath()
        ctx.moveTo(x - 10, y - 6)
        ctx.lineTo(x, y + 6)
        ctx.lineTo(x + 10, y - 6)
        ctx.stroke()
      }
    }
  },
  card(ctx) {
    ctx.fillStyle = '#111'
    ctx.fillRect(0, 0, TW, TH)
    ctx.fillStyle = BRAND.paper
    ctx.fillRect(20, 70, TW - 40, 130)
    drawLogo(ctx, TW / 2, 122, 130, '#050505')
    ctx.fillStyle = BRAND.orange
    ctx.fillRect(20, 196, TW - 40, 4)
    label(ctx, 'Business card')
  },
  social(ctx) {
    const g = ctx.createLinearGradient(0, 0, TW, TH)
    g.addColorStop(0, '#1a0b05')
    g.addColorStop(1, BRAND.orange)
    ctx.fillStyle = g
    ctx.fillRect(0, 0, TW, TH)
    drawLogo(ctx, TW / 2, TH / 2 - 20, 170, BRAND.white)
    ctx.font = `700 16px ${FONT}`
    ctx.fillStyle = BRAND.white
    ctx.fillText('Now creating.', 16, TH - 40)
    label(ctx, 'Social', TH - 18, 'rgba(255,255,255,0.8)')
  },
  packaging(ctx) {
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, TW, TH)
    // Isometric box: front, side, top faces.
    const face = (pts, fill) => {
      ctx.beginPath()
      pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
      ctx.closePath()
      ctx.fillStyle = fill
      ctx.fill()
    }
    face(
      [
        [60, 110],
        [150, 140],
        [150, 250],
        [60, 220],
      ],
      '#1d1d1d',
    )
    face(
      [
        [150, 140],
        [210, 110],
        [210, 220],
        [150, 250],
      ],
      '#111',
    )
    face(
      [
        [60, 110],
        [120, 80],
        [210, 110],
        [150, 140],
      ],
      '#2a2a2a',
    )
    face(
      [
        [60, 180],
        [150, 210],
        [150, 226],
        [60, 196],
      ],
      BRAND.orange,
    )
    face(
      [
        [150, 210],
        [210, 180],
        [210, 196],
        [150, 226],
      ],
      '#a34518',
    )
    ctx.save()
    ctx.transform(1, 0.33, 0, 1, 0, 0)
    drawLogo(ctx, 105, 118, 70, BRAND.white, false)
    ctx.restore()
    label(ctx, 'Packaging')
  },
  app(ctx) {
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, TW, TH)
    ctx.fillStyle = '#161616'
    ctx.beginPath()
    ctx.roundRect(58, 24, 140, 260, 22)
    ctx.fill()
    drawLogo(ctx, 128, 70, 80, BRAND.white, false)
    ctx.fillStyle = 'rgba(255,255,255,0.6)'
    ;[110, 124, 138].forEach((y, i) => ctx.fillRect(76, y, 104 - i * 22, 5))
    ctx.fillStyle = '#222'
    ctx.fillRect(76, 158, 104, 64)
    ctx.fillStyle = BRAND.orange
    ctx.fillRect(76, 238, 104, 26)
    label(ctx, 'Digital interface')
  },
}

export const TILE_ORDER = ['mark', 'colour', 'type', 'pattern', 'card', 'social', 'packaging', 'app']
/** Stage in which each tile is designed: mark · colour · typography · pattern · touchpoints. */
export const TILE_STAGE = { mark: 0, colour: 1, type: 2, pattern: 3, card: 4, social: 4, packaging: 4, app: 4 }

/** Creates every brand tile texture. Caller disposes. */
export function createBrandTextures() {
  return Object.fromEntries(TILE_ORDER.map((key) => [key, createCanvasTexture(TW, TH, (ctx) => DRAW[key](ctx))]))
}
