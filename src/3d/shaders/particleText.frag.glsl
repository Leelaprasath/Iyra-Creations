uniform vec3 uColor;
uniform vec3 uAccent;

varying float vAlpha;
varying float vHeat;
varying float vAccent;

void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.05, d);
  // Particles glow warm while travelling, settle to white; a few stay orange.
  vec3 col = mix(uColor, uAccent, clamp(vHeat * 0.9 + vAccent, 0.0, 1.0));
  gl_FragColor = vec4(col, a * vAlpha);
  #include <colorspace_fragment>
}
