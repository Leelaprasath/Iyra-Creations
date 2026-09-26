/**
 * Portfolio data — the single source for the gallery, project pages and sitemap.
 *
 * IMPORTANT: these entries are IYRA studio concept studies, not client work.
 * They are flagged `concept: true` and labelled as such everywhere they
 * appear. Replace or extend them with real case studies as they become
 * available; every field below is optional except id/slug/title/category/year.
 *
 * `details` keys render in this order on the project page when present:
 * overview, challenge, approach, design, technology, result.
 */
export const projects = [
  {
    id: 'p-solace',
    slug: 'solace-os',
    title: 'Solace OS',
    concept: true,
    category: 'SaaS Product',
    year: '2026',
    description:
      'A calm operating dashboard for wellness studios — scheduling, members and revenue in one quiet interface.',
    thumbnail: '/images/work/solace.svg',
    heroMedia: '/images/work/solace.svg',
    technologies: ['React', 'Design system', 'Data visualisation'],
    services: ['SaaS Product Development', 'UI/UX Design'],
    gallery: [],
    details: {
      overview: 'An exploration of how a studio management product can feel restful rather than busy.',
      challenge: 'Operational software is usually dense. The goal was clarity without hiding capability.',
      approach: 'One primary action per screen, progressive disclosure and a strict typographic scale.',
      design: 'A monochrome interface with IYRA orange reserved for the single most important signal.',
      technology: 'Component-driven React front-end with a tokenised design system.',
    },
  },
  {
    id: 'p-nocturne',
    slug: 'nocturne-audio',
    title: 'Nocturne Audio',
    concept: true,
    category: 'Brand Identity',
    year: '2026',
    description: 'An identity system for a speaker brand built around the shape of sound in a dark room.',
    thumbnail: '/images/work/nocturne.svg',
    heroMedia: '/images/work/nocturne.svg',
    technologies: ['Identity system', 'Motion guidelines'],
    services: ['Logo Design', 'Complete Branding'],
    gallery: [],
    details: {
      overview: 'A study in building a full identity from a single geometric idea: the sound wave as a circle.',
      challenge: 'Audio brands share one visual cliché. The mark needed to read as sound without a waveform.',
      approach: 'Concentric construction on a strict grid, extended into pattern, packaging and motion.',
      design: 'Black, warm white and a single orange pulse. Typography set tight and editorial.',
    },
  },
  {
    id: 'p-aurelia',
    slug: 'aurelia-atelier',
    title: 'Aurelia Atelier',
    concept: true,
    category: 'Website',
    year: '2026',
    description: 'An immersive website concept for a jewellery atelier, where light and material lead the story.',
    thumbnail: '/images/work/aurelia.svg',
    heroMedia: '/images/work/aurelia.svg',
    technologies: ['React', 'Three.js', 'GSAP'],
    services: ['Website Development', '3D Web Experiences'],
    gallery: [],
    details: {
      overview: 'A concept for presenting handmade pieces with the patience of a gallery.',
      challenge: 'Luxury sites are often slow. The experience had to feel rich and still load fast.',
      approach: 'Real-time light on lightweight geometry, with a DOM-first layout that works without WebGL.',
      technology: 'React, Three.js and GSAP with tiered rendering quality.',
    },
  },
  {
    id: 'p-anaya',
    slug: 'anaya-name-reveal',
    title: 'ANAYA',
    concept: true,
    category: 'Name Reveal Video',
    year: '2026',
    description: 'A cinematic name reveal concept — particles gather from darkness into a name and a new chapter.',
    thumbnail: '/images/work/anaya.svg',
    heroMedia: '/images/work/anaya.svg',
    technologies: ['Particle systems', 'Real-time typography'],
    services: ['Name Reveal Videos', 'Motion Design'],
    gallery: [],
    details: {
      overview: 'The demonstration piece behind the name reveal on this site, built as a reusable engine.',
      approach: 'Each letter is sampled into particles and revealed on its own beat, then held in light.',
      design: 'Darkness, a single warm light and generous silence between beats.',
    },
  },
]

export const getProject = (slug) => projects.find((p) => p.slug === slug)

export const getNextProject = (slug) => {
  const i = projects.findIndex((p) => p.slug === slug)
  return projects[(i + 1) % projects.length]
}
