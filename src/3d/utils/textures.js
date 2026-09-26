import * as THREE from 'three'

/**
 * Small runtime-drawn textures (no image downloads). Callers own the returned
 * texture and must dispose it on unmount.
 */
export function createCanvasTexture(width, height, draw) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  draw(canvas.getContext('2d'), width, height)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

/** A warm "hero image": orange light blooming out of black, with a horizon line. */
export function drawHeroImage(ctx, w, h) {
  ctx.fillStyle = '#050505'
  ctx.fillRect(0, 0, w, h)
  const g = ctx.createRadialGradient(w * 0.62, h * 0.55, 0, w * 0.62, h * 0.55, w * 0.55)
  g.addColorStop(0, '#ffb58f')
  g.addColorStop(0.18, '#DB622B')
  g.addColorStop(0.55, 'rgba(219,98,43,0.18)')
  g.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
  ctx.strokeStyle = 'rgba(255,255,255,0.35)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(w * 0.62, h * 0.55, h * 0.3, 0, Math.PI * 2)
  ctx.stroke()
}
