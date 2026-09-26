import * as THREE from 'three'

let offscreen = null

/**
 * Compiles `object`'s materials for the pipeline they will actually render in.
 *
 * three.js keys programs on the current render target (tone mapping and output
 * colour space differ between screen and off-screen targets). With
 * postprocessing, scenes render into the composer's off-screen buffer, so
 * compiling against the screen would compile the wrong variant and the real
 * one would still stall on first draw. `offscreenPipeline` selects the right one.
 */
export function compileForPipeline(gl, object, camera, scene, offscreenPipeline) {
  const previous = gl.getRenderTarget()
  if (offscreenPipeline) {
    offscreen ??= new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType })
    gl.setRenderTarget(offscreen)
  }
  // Programs are created synchronously inside the call; only readiness is awaited.
  const pending = gl.compileAsync
    ? gl.compileAsync(object, camera, scene)
    : (gl.compile(object, camera, scene), Promise.resolve())
  gl.setRenderTarget(previous)
  return pending
}
