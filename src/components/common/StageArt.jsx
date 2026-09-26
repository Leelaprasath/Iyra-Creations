import styles from './StageArt.module.css'

/**
 * Lightweight SVG renditions of each chapter's 3D story for the fallback tier.
 * Layers carry a stage index (--s); they appear as the chapter's --stage
 * (set by StickyChapter) passes them, so the fallback still tells the story.
 */
const O = '#DB622B'
const W = '#FFFFFF'
const LINE = 'rgba(255,255,255,0.35)'

function Layer({ s, children }) {
  return (
    <g className={styles.layer} style={{ '--s': s }}>
      {children}
    </g>
  )
}

const ART = {
  web: (
    <>
      <Layer s={0}>
        <rect x="40" y="60" width="320" height="220" fill="none" stroke={LINE} />
        <line x1="40" y1="84" x2="360" y2="84" stroke={LINE} />
        <circle cx="54" cy="72" r="3" fill={LINE} />
        <circle cx="66" cy="72" r="3" fill={LINE} />
      </Layer>
      <Layer s={1}>
        <rect x="60" y="100" width="280" height="90" fill="none" stroke={LINE} strokeDasharray="4 4" />
        <rect x="60" y="202" width="86" height="60" fill="none" stroke={LINE} strokeDasharray="4 4" />
        <rect x="157" y="202" width="86" height="60" fill="none" stroke={LINE} strokeDasharray="4 4" />
        <rect x="254" y="202" width="86" height="60" fill="none" stroke={LINE} strokeDasharray="4 4" />
      </Layer>
      <Layer s={2}>
        <rect x="76" y="118" width="150" height="14" fill={W} />
        <rect x="76" y="140" width="110" height="14" fill={W} />
        <rect x="76" y="164" width="90" height="5" fill={LINE} />
      </Layer>
      <Layer s={3}>
        <rect x="240" y="108" width="92" height="74" fill={O} opacity="0.75" />
      </Layer>
      <Layer s={4}>
        <rect x="76" y="176" width="54" height="8" fill={O} />
        <path d="M150 180 l10 26 4-10 10-4z" fill={W} />
      </Layer>
      <Layer s={5}>
        <rect x="40" y="60" width="320" height="220" fill="none" stroke={O} strokeWidth="1.5" />
      </Layer>
    </>
  ),
  saas: (
    <>
      <Layer s={0}>
        <circle cx="200" cy="170" r="6" fill={O} />
      </Layer>
      <Layer s={1}>
        <rect x="60" y="70" width="60" height="200" fill="none" stroke={LINE} />
        <rect x="132" y="70" width="208" height="30" fill="none" stroke={LINE} />
      </Layer>
      <Layer s={2}>
        {[0, 1, 2].map((i) => (
          <rect key={i} x={132 + i * 72} y="112" width="64" height="44" fill="#181818" stroke={LINE} />
        ))}
      </Layer>
      <Layer s={3}>
        {[30, 60, 45, 80, 65, 95].map((h, i) => (
          <rect key={i} x={140 + i * 32} y={262 - h} width="18" height={h} fill={i === 5 ? O : '#444'} />
        ))}
      </Layer>
      <Layer s={4}>
        <rect
          x="70"
          y="84"
          width="200"
          height="200"
          fill="none"
          stroke={LINE}
          transform="translate(26 -26)"
          opacity="0.4"
        />
      </Layer>
    </>
  ),
  logo: (
    <>
      <Layer s={0}>
        {Array.from({ length: 49 }, (_, i) => (
          <circle key={i} cx={110 + (i % 7) * 30} cy={80 + Math.floor(i / 7) * 30} r="1.6" fill={LINE} />
        ))}
      </Layer>
      <Layer s={1}>
        <circle cx="200" cy="170" r="96" fill="none" stroke={LINE} />
        <line x1="110" y1="80" x2="290" y2="260" stroke={LINE} />
        <line x1="290" y1="80" x2="110" y2="260" stroke={LINE} />
      </Layer>
      <Layer s={2}>
        <rect x="140" y="110" width="20" height="120" fill="none" stroke={W} />
        <path d="M180 110h26l14 40 14-40h26l-28 72v48h-24v-48z" fill="none" stroke={W} />
      </Layer>
      <Layer s={3}>
        <rect x="140" y="110" width="20" height="120" fill={W} />
        <path d="M180 110h26l14 40 14-40h26l-28 72v48h-24v-48z" fill={O} />
      </Layer>
      <Layer s={4}>
        <text x="200" y="290" textAnchor="middle" fill={W} fontSize="22" fontWeight="800" letterSpacing="8">
          IYRA
        </text>
      </Layer>
    </>
  ),
  branding: (
    <>
      <Layer s={0}>
        <rect x="60" y="70" width="110" height="110" fill="#0a0a0a" stroke={LINE} />
        <rect x="95" y="100" width="8" height="50" fill={W} />
        <path d="M110 100h11l6 18 6-18h11l-12 30v20h-10v-20z" fill={O} />
      </Layer>
      <Layer s={1}>
        <rect x="185" y="70" width="46" height="110" fill={O} />
        <rect x="236" y="70" width="46" height="110" fill="#000" stroke={LINE} />
        <rect x="287" y="70" width="46" height="110" fill={W} />
      </Layer>
      <Layer s={2}>
        <text x="62" y="250" fill={W} fontSize="54" fontWeight="800">
          Aa
        </text>
      </Layer>
      <Layer s={3}>
        {Array.from({ length: 12 }, (_, i) => (
          <path key={i} d={`M${160 + (i % 4) * 22} ${200 + Math.floor(i / 4) * 22}l6 8 6-8`} stroke={O} fill="none" />
        ))}
      </Layer>
      <Layer s={4}>
        <rect x="260" y="196" width="80" height="48" fill="#111" stroke={LINE} />
        <rect x="268" y="206" width="20" height="4" fill={O} />
      </Layer>
      <Layer s={5}>
        <rect x="50" y="60" width="300" height="200" fill="none" stroke={O} />
      </Layer>
    </>
  ),
  process: (
    <>
      <Layer s={0}>
        <circle cx="200" cy="170" r="5" fill={O} />
      </Layer>
      <Layer s={1}>
        <circle cx="200" cy="170" r="80" fill="none" stroke={LINE} strokeDasharray="2 6" />
      </Layer>
      <Layer s={2}>
        <polygon points="200,90 270,130 270,210 200,250 130,210 130,130" fill="none" stroke={W} strokeOpacity="0.6" />
        <path d="M200 90v160M130 130l140 80M270 130l-140 80" stroke={LINE} />
      </Layer>
      <Layer s={3}>
        <polygon points="200,110 252,140 252,200 200,230 148,200 148,140" fill="#181818" stroke={LINE} />
      </Layer>
      <Layer s={4}>
        <polygon points="200,90 270,130 270,210 200,250 130,210 130,130" fill="none" stroke={O} strokeWidth="2" />
      </Layer>
    </>
  ),
}

export function StageArt({ id }) {
  const art = ART[id]
  if (!art) return null
  return (
    <svg className={styles.art} viewBox="0 0 400 340" role="presentation">
      {art}
    </svg>
  )
}
