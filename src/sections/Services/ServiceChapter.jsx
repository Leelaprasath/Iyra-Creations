import { useRef } from 'react'
import { StageArt } from '../../components/common/StageArt'
import { StickyChapter } from '../../components/common/StickyChapter'
import { track } from '../../utils/analytics'

/** One service told as a pinned chapter; the matching WebGL scene builds with the stages. */
export function ServiceChapter({ service, length = 3 }) {
  const viewed = useRef(false)
  return (
    <StickyChapter
      sceneId={service.sceneId}
      anchorId={service.anchor}
      index={service.index}
      eyebrow={service.name}
      title={service.title}
      copy={service.copy}
      stages={service.stages}
      side={service.side}
      length={length}
      fallback={<StageArt id={service.id} />}
      onStage={(stage) => {
        // Stage 0 is reported on mount; count a view once the visitor progresses into it.
        if (viewed.current || stage < 1) return
        viewed.current = true
        track('service_viewed', { service: service.id })
      }}
    />
  )
}
