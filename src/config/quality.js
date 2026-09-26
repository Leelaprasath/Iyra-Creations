/**
 * Rendering quality tiers. Every scene reads its budget from here — never
 * hard-code particle counts or effect toggles inside a scene.
 */
export const TIERS = ['fallback', 'low', 'medium', 'high']

export const QUALITY = {
  high: {
    dpr: [1, 1.5],
    ambientParticles: 1800,
    textParticleStep: 2,
    maxTextParticles: 9000,
    postprocessing: { bloom: true, noise: true, vignette: true },
    glass: true,
    // Reflection environment (PMREM). Costs ~1–1.5 s of shader compilation, so high tier only.
    environment: true,
    geometryDetail: 1,
  },
  medium: {
    dpr: [1, 1.25],
    ambientParticles: 900,
    textParticleStep: 3,
    maxTextParticles: 5000,
    postprocessing: { bloom: true, noise: false, vignette: true },
    glass: false,
    environment: false,
    geometryDetail: 0.75,
  },
  low: {
    dpr: [1, 1],
    ambientParticles: 400,
    textParticleStep: 4,
    maxTextParticles: 2600,
    postprocessing: null,
    glass: false,
    environment: false,
    geometryDetail: 0.5,
  },
}

export function lowerTier(tier) {
  const i = TIERS.indexOf(tier)
  // Runtime degradation stops at "low"; "fallback" is only chosen up-front.
  return i > 1 ? TIERS[i - 1] : tier
}

export function isValidTier(value) {
  return TIERS.includes(value)
}
