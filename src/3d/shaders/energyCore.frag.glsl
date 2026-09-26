uniform vec3 uColor;
uniform vec3 uHot;
uniform float uIntensity;

varying vec3 vNormal;
varying vec3 vViewDir;
varying float vNoise;

void main() {
  float fresnel = pow(1.0 - max(dot(normalize(vNormal), normalize(vViewDir)), 0.0), 2.2);
  // Dark molten centre, bright orange rim, hot white in noise ridges.
  vec3 col = mix(uColor * 0.18, uColor, fresnel);
  col = mix(col, uHot, smoothstep(0.55, 1.1, vNoise) * 0.8);
  col *= uIntensity;
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}
