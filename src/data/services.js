/**
 * The five IYRA services. `sceneId` links a service to its WebGL scene and its
 * DOM chapter (`data-scene`). `stages` drive both the 3D build-up and the
 * DOM stage rail, so the two always agree.
 */
export const services = [
  {
    id: 'web',
    sceneId: 'web',
    anchor: 'service-web',
    index: '01',
    name: 'Website Development',
    title: ['We build', 'digital experiences.'],
    copy: 'High-performance digital experiences designed to communicate your brand, engage users and convert attention into action.',
    stages: ['Frame', 'Layout', 'Typography', 'Imagery', 'Interaction', 'Final website'],
    side: 'left',
  },
  {
    id: 'saas',
    sceneId: 'saas',
    anchor: 'service-saas',
    index: '02',
    name: 'SaaS Product Development',
    title: ['From idea', 'to product.'],
    copy: 'We design and develop scalable SaaS products that transform ideas into production-ready digital platforms.',
    stages: ['Idea', 'System', 'Interface', 'Product', 'Scale'],
    side: 'right',
  },
  {
    id: 'logo',
    sceneId: 'logo',
    anchor: 'service-logo',
    index: '03',
    name: 'Logo Design',
    title: ['Make your', 'identity memorable.'],
    copy: 'Every mark starts as a system of points, lines and proportion — refined until it is instantly yours.',
    stages: ['Grid', 'Geometry', 'Type', 'Symbol', 'Identity'],
    side: 'left',
  },
  {
    id: 'branding',
    sceneId: 'branding',
    anchor: 'service-branding',
    index: '04',
    name: 'Complete Branding',
    title: ['Build a', 'recognizable world.'],
    copy: 'We create cohesive visual identities that help businesses become recognizable, memorable and consistent.',
    stages: ['Mark', 'Colour', 'Typography', 'Pattern', 'Touchpoints', 'Ecosystem'],
    side: 'right',
  },
  {
    id: 'namereveal',
    sceneId: 'namereveal',
    anchor: 'service-name-reveal',
    index: '05',
    name: 'Name Reveal Videos',
    title: ['Make the', 'moment unforgettable.'],
    copy: 'Cinematic name reveals crafted with light, particles and typography — for the moments that deserve more than a caption.',
    stages: ['Darkness', 'Light', 'Letters', 'Name', 'Moment'],
    side: 'center',
  },
]

export const serviceChoices = [
  'Website Development',
  'SaaS Product',
  'Logo Design',
  'Branding',
  'Name Reveal Video',
  'Other',
]
