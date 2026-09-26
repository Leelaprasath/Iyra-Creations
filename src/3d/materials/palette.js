import * as THREE from 'three'

/** Brand colours as hex strings (JSX props) and shared THREE.Color instances (shaders). */
export const BRAND = {
  orange: '#DB622B',
  orangeHot: '#FF8A4C',
  white: '#FFFFFF',
  /** Off-white for interface surfaces: stays below the bloom threshold. */
  paper: '#D6D6D6',
  ink: '#0A0A0A',
  graphite: '#181818',
  steel: '#A1A1A1',
}

export const COLORS = {
  orange: new THREE.Color(BRAND.orange),
  orangeHot: new THREE.Color(BRAND.orangeHot),
  white: new THREE.Color(BRAND.white),
  graphite: new THREE.Color(BRAND.graphite),
}
