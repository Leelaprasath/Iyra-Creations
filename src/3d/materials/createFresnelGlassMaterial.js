import * as THREE from 'three'
import { COLORS } from './palette'

/**
 * Cheap "glass" for tiers without transmission/environment: a view-dependent
 * rim (white edge fading to a faint orange inner glow). One pass, no render
 * targets, no environment map.
 */
export function createFresnelGlassMaterial({
  rim = COLORS.white,
  inner = COLORS.orange,
  power = 2.6,
  opacity = 0.55,
} = {}) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uRim: { value: rim.clone() },
      uInner: { value: inner.clone() },
      uPower: { value: power },
      uOpacity: { value: opacity },
    },
    vertexShader: /* glsl */ `
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        vec4 world = modelMatrix * vec4(position, 1.0);
        vNormal = normalize(mat3(modelMatrix) * normal);
        vView = normalize(cameraPosition - world.xyz);
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uRim;
      uniform vec3 uInner;
      uniform float uPower;
      uniform float uOpacity;
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        float f = pow(1.0 - max(dot(normalize(vNormal), normalize(vView)), 0.0), uPower);
        vec3 col = mix(uInner * 0.08, uRim, f);
        gl_FragColor = vec4(col, (0.04 + f) * uOpacity);
        #include <colorspace_fragment>
      }
    `,
  })
}
