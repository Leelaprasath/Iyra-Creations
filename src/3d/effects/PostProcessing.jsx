import { Bloom, EffectComposer, Noise, ToneMapping, Vignette } from '@react-three/postprocessing'
import { BlendFunction, ToneMappingMode } from 'postprocessing'

/**
 * Subtle, tier-gated finishing: bloom only on genuinely bright pixels
 * (emissive orange, particles), fine film grain, soft vignette.
 * Tone mapping is an explicit pass because render targets skip renderer tone mapping.
 */
export function PostProcessing({ config, highQuality }) {
  const effects = [
    config.bloom && (
      <Bloom
        key="bloom"
        mipmapBlur
        intensity={0.85}
        luminanceThreshold={0.74}
        luminanceSmoothing={0.22}
        radius={0.72}
      />
    ),
    <ToneMapping key="tone" mode={ToneMappingMode.NEUTRAL} />,
    // Grain after tone mapping: in HDR space it tints over-bright highlights.
    config.noise && <Noise key="noise" blendFunction={BlendFunction.OVERLAY} opacity={0.06} />,
    config.vignette && <Vignette key="vignette" offset={0.28} darkness={0.72} />,
  ].filter(Boolean)

  return (
    <EffectComposer multisampling={highQuality ? 4 : 0} enableNormalPass={false}>
      {effects}
    </EffectComposer>
  )
}
