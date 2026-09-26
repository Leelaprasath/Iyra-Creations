import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { COLORS } from '../materials/palette'

/**
 * Soft additive light (radial falloff on a camera-facing plane) — a cheap
 * stand-in for volumetric glow. Drive `material.uniforms.uIntensity`.
 * `stretch` > 1 makes a horizontal light streak.
 */
export function Glow({ ref, size = 4, color = COLORS.orange, intensity = 1, stretch = 1, ...props }) {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
        uniforms: {
          uColor: { value: color.clone() },
          uIntensity: { value: intensity },
          uStretch: { value: stretch },
        },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 uColor;
          uniform float uIntensity;
          uniform float uStretch;
          varying vec2 vUv;
          void main() {
            vec2 p = (vUv - 0.5) * 2.0;
            p.y *= uStretch;
            float d = length(p);
            float a = pow(max(1.0 - d, 0.0), 2.4) * uIntensity;
            gl_FragColor = vec4(uColor * a, a);
            #include <colorspace_fragment>
          }
        `,
      }),
    // Colour/stretch are construction-time settings; intensity is driven per frame.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  useEffect(() => () => material.dispose(), [material])

  return (
    <mesh ref={ref} material={material} {...props}>
      <planeGeometry args={[size, size / stretch]} />
    </mesh>
  )
}
