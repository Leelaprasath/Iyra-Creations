import { services } from '../data/services'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { About } from '../sections/About/About'
import { Philosophy } from '../sections/About/Philosophy'
import { Capabilities } from '../sections/Capabilities/Capabilities'
import { Contact } from '../sections/Contact/Contact'
import { FinalCTA } from '../sections/Contact/FinalCTA'
import { Hero } from '../sections/Hero/Hero'
import { NameReveal } from '../sections/NameReveal/NameReveal'
import { Process } from '../sections/Process/Process'
import { ServiceChapter } from '../sections/Services/ServiceChapter'
import { ServicesIntro } from '../sections/Services/ServicesIntro'
import { Work } from '../sections/Work/Work'

/** Chapters told as pinned scenes (the name reveal has its own section). */
const chapters = services.filter((s) => s.id !== 'namereveal')

/**
 * The journey, in the order of config/scenes.js:
 * darkness → IYRA forms → creation → services → capabilities → work →
 * process → story → name reveal → contact.
 */
export default function HomePage() {
  useDocumentMeta({})
  return (
    <>
      <Hero />
      <ServicesIntro />
      {chapters.map((service) => (
        <ServiceChapter key={service.id} service={service} />
      ))}
      <Capabilities />
      <Work />
      <Process />
      <About />
      <Philosophy />
      <NameReveal />
      <FinalCTA />
      <Contact />
    </>
  )
}
