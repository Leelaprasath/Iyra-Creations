import * as THREE from 'three'
import noise from '../shaders/noise.glsl?raw'
import vertex from '../shaders/energyCore.vert.glsl?raw'
import fragment from '../shaders/energyCore.frag.glsl?raw'
import { COLORS } from './palette'

/**
 * Organic emissive "idea" material: noise-displaced surface with an orange
 * fresnel rim. Bright enough to bloom; not tone-mapped so the brand orange
 * stays true.
 */
export function createEnergyMaterial({ amplitude = 0.12, intensity = 1.6 } = {}) {
  return new THREE.ShaderMaterial({
    vertexShader: `${noise}\n${vertex}`,
    fragmentShader: fragment,
    toneMapped: false,
    uniforms: {
      uTime: { value: 0 },
      uAmplitude: { value: amplitude },
      uIntensity: { value: intensity },
      uColor: { value: COLORS.orange.clone() },
      uHot: { value: COLORS.orangeHot.clone().lerp(COLORS.white, 0.35) },
    },
  })
}
