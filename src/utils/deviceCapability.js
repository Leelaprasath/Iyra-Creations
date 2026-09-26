import { isValidTier } from '../config/quality'

const SOFTWARE_RENDERER = /swiftshader|llvmpipe|software|basic render/i

/** Probe WebGL once; returns null when WebGL is unavailable. */
export function probeWebGL() {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
    if (!gl) return null
    const info = gl.getExtension('WEBGL_debug_renderer_info')
    const renderer = info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : ''
    const result = {
      webgl2: typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext,
      renderer: String(renderer),
    }
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    return result
  } catch {
    return null
  }
}

/**
 * Pure tier decision (unit tested). Conservative: phones start at low/medium,
 * only capable desktops get "high". Runtime monitoring can still step down.
 */
export function resolveTier({ webgl, cores = 4, memory = 4, layout, saveData = false, override }) {
  if (override && isValidTier(override)) return override
  if (!webgl) return 'fallback'
  if (SOFTWARE_RENDERER.test(webgl.renderer)) return 'low'
  if (saveData) return 'low'
  if (layout === 'mobile') return cores >= 6 && memory >= 6 ? 'medium' : 'low'
  if (layout === 'tablet') return 'medium'
  if (cores >= 8 && memory >= 8) return 'high'
  return 'medium'
}

export function detectFeatures(layout) {
  const params = new URLSearchParams(window.location.search)
  return {
    webgl: probeWebGL(),
    cores: navigator.hardwareConcurrency || 4,
    // deviceMemory is Chromium-only; assume a capable machine elsewhere.
    memory: navigator.deviceMemory || 8,
    layout,
    saveData: Boolean(navigator.connection?.saveData),
    override: params.get('quality'),
  }
}
