import { Environment, Lightformer } from '@react-three/drei'
import { BRAND } from '../materials/palette'

/**
 * Procedural studio environment for reflections — no HDR download.
 * Rendered once (frames={1}) at low resolution: a soft white softbox above,
 * a thin white strip at the side and a warm IYRA orange panel behind.
 */
export function MainEnvironment() {
  return (
    <Environment frames={1} resolution={128} background={false}>
      <Lightformer form="rect" intensity={2.2} color={BRAND.white} position={[0, 5, -2]} rotation-x={Math.PI / 2} scale={[10, 4, 1]} />
      <Lightformer form="rect" intensity={1.2} color={BRAND.white} position={[6, 0, 2]} rotation-y={-Math.PI / 2} scale={[0.6, 8, 1]} />
      <Lightformer form="rect" intensity={3} color={BRAND.orange} position={[-5, -1, -4]} rotation-y={Math.PI / 4} scale={[6, 3, 1]} />
      <Lightformer form="ring" intensity={1.5} color={BRAND.orange} position={[0, -4, 3]} scale={3} />
    </Environment>
  )
}
