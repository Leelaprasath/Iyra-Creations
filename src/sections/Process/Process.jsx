import { StageArt } from '../../components/common/StageArt'
import { StickyChapter } from '../../components/common/StickyChapter'
import { processStages } from '../../data/process'

/** From idea to experience: one WebGL object evolves as the five stages pass. */
export function Process() {
  return (
    <StickyChapter
      sceneId="process"
      anchorId="process"
      index="How we work"
      eyebrow="Process"
      title={['From idea', 'to experience.']}
      stages={processStages.map((s) => ({ label: s.name, text: s.text }))}
      side="left"
      length={3}
      fallback={<StageArt id="process" />}
    />
  )
}
