// #include noise (prepended in JS)
uniform float uTime;
uniform float uAmplitude;

varying vec3 vNormal;
varying vec3 vViewDir;
varying float vNoise;

void main() {
  float n = snoise(normal * 1.6 + vec3(uTime * 0.25));
  float n2 = snoise(normal * 4.0 - vec3(uTime * 0.4)) * 0.35;
  float displacement = (n + n2) * uAmplitude;
  vec3 p = position + normal * displacement;
  vNoise = n + n2;

  vec4 world = modelMatrix * vec4(p, 1.0);
  vNormal = normalize(mat3(modelMatrix) * normal);
  vViewDir = normalize(cameraPosition - world.xyz);
  gl_Position = projectionMatrix * viewMatrix * world;
}
