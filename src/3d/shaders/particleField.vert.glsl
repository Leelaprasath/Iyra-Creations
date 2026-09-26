attribute vec4 aRandom;

uniform float uTime;
uniform float uMotion;
uniform float uPixelRatio;
uniform float uSize;

varying float vAlpha;
varying float vWarm;

void main() {
  vec3 p = position;
  float t = uTime * uMotion;
  p.x += sin(t * 0.11 + aRandom.x * 6.2831) * 0.45 * uMotion;
  p.y += cos(t * 0.09 + aRandom.y * 6.2831) * 0.35 * uMotion;
  p.z += sin(t * 0.07 + aRandom.z * 6.2831) * 0.3 * uMotion;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;

  float depth = -mv.z;
  gl_PointSize = min(uSize * (0.35 + aRandom.z) * uPixelRatio * (10.0 / max(depth, 0.1)), 5.0 * uPixelRatio);

  float twinkle = mix(1.0, 0.55 + 0.45 * sin(t * (0.6 + aRandom.w) + aRandom.x * 20.0), uMotion);
  vAlpha = smoothstep(32.0, 7.0, depth) * smoothstep(0.6, 3.0, depth) * twinkle * (0.2 + aRandom.z * 0.45);
  vWarm = step(0.86, aRandom.w);
}
