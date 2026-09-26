attribute vec3 aStart;
attribute vec4 aRandom;
attribute float aLetter;

uniform float uTime;
uniform float uMotion;
uniform float uForm;
uniform float uReveal;
uniform float uDisperse;
uniform float uDust;
uniform float uAlpha;
uniform float uSize;
uniform float uPixelRatio;

varying float vAlpha;
varying float vHeat;
varying float vAccent;

void main() {
  // A letter may only form once the reveal counter has passed its index.
  float letterGate = clamp(uReveal - aLetter, 0.0, 1.0);
  float progress = min(uForm, letterGate);

  // Per-particle stagger, eased.
  float delay = aRandom.x * 0.4;
  float t = smoothstep(delay, delay + 0.6, progress);

  vec3 p = mix(aStart, position, t);

  // Curved flight path: a sideways arc that vanishes on arrival.
  float arc = sin(t * 3.14159);
  p += (aRandom.yzw - 0.5) * arc * 1.6;

  // Settled particles breathe slightly; unformed dust drifts.
  float time = uTime * uMotion;
  p.xy += vec2(sin(time * 0.8 + aRandom.y * 40.0), cos(time * 0.7 + aRandom.z * 40.0)) * mix(0.08, 0.006, t) * uMotion;

  // Release: burst outward from the glyph centre line.
  vec3 dir = normalize(vec3(position.xy + (aRandom.xy - 0.5) * 0.6, 0.6 + aRandom.z));
  p += dir * uDisperse * (2.0 + aRandom.y * 7.0);

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float depth = max(-mv.z, 0.1);
  gl_PointSize = uSize * (0.6 + aRandom.z * 0.9) * uPixelRatio * (9.0 / depth) * mix(1.4, 1.0, t);

  float formed = smoothstep(0.0, 0.35, t);
  float dust = uDust * 0.22 * (0.4 + aRandom.w);
  vAlpha = max(formed, dust) * uAlpha * (1.0 - uDisperse) * (0.55 + aRandom.z * 0.45);
  vHeat = arc;
  vAccent = step(0.88, aRandom.w);
}
