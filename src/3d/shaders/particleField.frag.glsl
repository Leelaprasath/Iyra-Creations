uniform vec3 uColor;
uniform vec3 uAccent;

varying float vAlpha;
varying float vWarm;

void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d);
  gl_FragColor = vec4(mix(uColor, uAccent, vWarm), a * vAlpha);
  #include <colorspace_fragment>
}
