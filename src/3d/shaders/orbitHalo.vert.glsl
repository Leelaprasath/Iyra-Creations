attribute vec4 aRandom;

uniform float uTime;
uniform float uPixelRatio;
uniform float uSize;

varying float vAlpha;
varying float vWarm;

void main() {
  float r = length(position.xz);
  float angle = atan(position.z, position.x) + uTime * (0.35 / max(r, 0.5)) * (0.6 + aRandom.x * 0.6);
  vec3 p = vec3(cos(angle) * r, position.y + sin(uTime * 0.6 + aRandom.y * 6.28) * 0.04, sin(angle) * r);

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float depth = max(-mv.z, 0.1);
  gl_PointSize = min(uSize * (0.4 + aRandom.z) * uPixelRatio * (9.0 / depth), 5.0 * uPixelRatio);
  vAlpha = 0.25 + aRandom.w * 0.55;
  vWarm = step(0.7, aRandom.y);
}
