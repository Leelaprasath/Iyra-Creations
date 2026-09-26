import { createRandom } from '../../utils/random'

export const TEXT_FONT_FAMILY = 'Inter Variable'
const BASE_PX = 220

/** Resolves once the display weight of Inter is available to canvas 2D. */
export function loadTextFont(weight = 800) {
  if (typeof document === 'undefined' || !document.fonts) return Promise.resolve()
  return document.fonts.load(`${weight} ${BASE_PX}px "${TEXT_FONT_FAMILY}"`).catch(() => {})
}

/**
 * Rasterises lines of text and samples filled pixels into particle targets.
 *
 * lines: [{ text, size = 1 (relative), tracking = 0 (em), weight = 800 }]
 * Returns world-space targets centred on the origin, scaled so the widest
 * line spans `width` units, plus the glyph index of every particle (letters
 * are counted across all lines, spaces excluded) for letter-by-letter reveals.
 */
export function sampleText({ lines, width = 4, step = 3, maxPoints = 6000, lineGap = 0.18, seed = 3 }) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d', { willReadFrequently: true })

  const fontFor = (l) => `${l.weight ?? 800} ${BASE_PX * (l.size ?? 1)}px "${TEXT_FONT_FAMILY}"`
  const layout = lines.map((l) => {
    ctx.font = fontFor(l)
    const px = BASE_PX * (l.size ?? 1)
    const tracking = (l.tracking ?? 0) * px
    const chars = [...l.text]
    const widths = chars.map((c) => ctx.measureText(c).width)
    const lineWidth = widths.reduce((s, w) => s + w, 0) + tracking * (chars.length - 1)
    return { ...l, px, tracking, chars, widths, lineWidth }
  })

  const pad = 20
  const maxLineWidth = Math.max(...layout.map((l) => l.lineWidth))
  const totalHeight = layout.reduce((s, l, i) => s + l.px + (i ? lineGap * BASE_PX : 0), 0)
  canvas.width = Math.ceil(maxLineWidth + pad * 2)
  canvas.height = Math.ceil(totalHeight + pad * 2)

  ctx.fillStyle = '#fff'
  ctx.textBaseline = 'top'
  const glyphBoxes = []
  let y = pad
  let letter = 0
  layout.forEach((l, lineIndex) => {
    ctx.font = fontFor(l)
    let x = pad + (maxLineWidth - l.lineWidth) / 2
    l.chars.forEach((c, i) => {
      ctx.fillText(c, x, y)
      if (c.trim()) {
        glyphBoxes.push({ x0: x, x1: x + l.widths[i], y0: y, y1: y + l.px * 1.05, letter, lineIndex })
        letter += 1
      }
      x += l.widths[i] + l.tracking
    })
    y += l.px + lineGap * BASE_PX
  })

  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const found = []
  for (let py = 0; py < canvas.height; py += step) {
    for (let px = 0; px < canvas.width; px += step) {
      if (data[(py * canvas.width + px) * 4 + 3] < 128) continue
      const box = glyphBoxes.find((b) => px >= b.x0 && px < b.x1 + 1 && py >= b.y0 && py < b.y1)
      found.push(px, py, box ? box.letter : 0, box ? box.lineIndex : 0)
    }
  }

  // Deterministic subsample when over budget (keeps letter coverage even).
  let indices = Array.from({ length: found.length / 4 }, (_, i) => i)
  if (indices.length > maxPoints) {
    const rand = createRandom(seed)
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1))
      ;[indices[i], indices[j]] = [indices[j], indices[i]]
    }
    indices = indices.slice(0, maxPoints)
  }

  const scale = width / maxLineWidth
  const cx = canvas.width / 2
  const cy = canvas.height / 2
  const count = indices.length
  const targets = new Float32Array(count * 3)
  const letters = new Float32Array(count)
  const lineIds = new Float32Array(count)
  indices.forEach((src, i) => {
    targets[i * 3] = (found[src * 4] - cx) * scale
    targets[i * 3 + 1] = -(found[src * 4 + 1] - cy) * scale
    targets[i * 3 + 2] = 0
    letters[i] = found[src * 4 + 2]
    lineIds[i] = found[src * 4 + 3]
  })

  return { targets, letters, lineIds, count, letterCount: letter, width, height: canvas.height * scale }
}

const LOGO_PX_PER_UNIT = 2.4

/**
 * Samples the IYRA logo (src/brand/logo.js) into particle targets. Each part's
 * `order` becomes the particle's glyph index, so a reveal can form I → Y → R →
 * A → frame → CREATIONS in sequence. Same return shape as sampleText.
 */
export function sampleLogo({ parts, tagline, viewBox, width = 4, step = 3, maxPoints = 6000, seed = 3 }) {
  const k = LOGO_PX_PER_UNIT
  const canvas = document.createElement('canvas')
  canvas.width = Math.ceil(viewBox.width * k)
  canvas.height = Math.ceil(viewBox.height * k)
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  const orders = [...new Set([...parts.map((p) => p.order), tagline.order])].sort((a, b) => a - b)

  const found = []
  for (const order of orders) {
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.setTransform(k, 0, 0, k, -viewBox.x * k, -viewBox.y * k)
    ctx.fillStyle = '#fff'
    parts.filter((p) => p.order === order).forEach((p) => ctx.fill(new Path2D(p.d), 'evenodd'))
    if (tagline.order === order) {
      ctx.font = `${tagline.size}px Georgia, 'Times New Roman', serif`
      ctx.textAlign = 'center'
      if ('letterSpacing' in ctx) ctx.letterSpacing = `${tagline.letterSpacing}px`
      ctx.fillText(tagline.text, tagline.x, tagline.y)
    }
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)
    for (let py = 0; py < canvas.height; py += step) {
      for (let px = 0; px < canvas.width; px += step) {
        if (data[(py * canvas.width + px) * 4 + 3] >= 128) found.push(px, py, order)
      }
    }
  }

  let indices = Array.from({ length: found.length / 3 }, (_, i) => i)
  if (indices.length > maxPoints) {
    const rand = createRandom(seed)
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1))
      ;[indices[i], indices[j]] = [indices[j], indices[i]]
    }
    indices = indices.slice(0, maxPoints)
  }

  const scale = width / canvas.width
  const count = indices.length
  const targets = new Float32Array(count * 3)
  const letters = new Float32Array(count)
  indices.forEach((src, i) => {
    targets[i * 3] = (found[src * 3] - canvas.width / 2) * scale
    targets[i * 3 + 1] = -(found[src * 3 + 1] - canvas.height / 2) * scale
    letters[i] = found[src * 3 + 2]
  })
  return { targets, letters, count, letterCount: orders.length, width, height: canvas.height * scale }
}
