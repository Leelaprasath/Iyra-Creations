uniform float uTime;
uniform vec2 uPointer;
uniform float uPresence;
uniform float uPixelRatio;

varying float vAlpha;
varying float vWarm;

void main() {
  vec3 p = position;
  float w = sin(p.x * 0.55 + uTime * 0.6) * 0.35 + sin(p.z * 0.9 - uTime * 0.45) * 0.25 + sin((p.x + p.z) * 0.3 + uTime * 0.3) * 0.3;
  // The surface rises gently toward the pointer.
  float d = distance(p.xz, uPointer);
  w += exp(-d * d * 0.18) * 0.9;
  p.y += w;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float depth = max(-mv.z, 0.1);
  gl_PointSize = 2.2 * uPixelRatio * (8.0 / depth);

  float edge = smoothstep(8.0, 5.0, abs(position.x)) * smoothstep(3.5, 2.0, abs(position.z));
  vAlpha = (0.18 + smoothstep(0.2, 1.1, w) * 0.5) * edge * uPresence;
  vWarm = smoothstep(0.55, 1.1, w);
}
