import {
  HoverCard,
  HoverCardArrow,
  HoverCardContent,
  HoverCardTrigger,
} from "@ui-sdk/react/hover-card"
import * as React from "react"
import { createRoot } from "react-dom/client"
import {
  hoverCardContentOptions,
  hoverCardFixture,
  hoverCardOptions,
} from "tests/fixtures/hover-card.ts"

function Fixture() {
  const [action, setAction] = React.useState("")
  const fixture = hoverCardFixture
  return (
    <div className="fixture">
      <button>Before</button>
      <HoverCard
        {...hoverCardOptions()}
        onOpenChange={(open, { reason }) =>
          setAction(`${open ? "open" : "close"}: ${reason}`)
        }
      >
        <HoverCardTrigger href={fixture.href}>
          {fixture.trigger}
        </HoverCardTrigger>
        <HoverCardContent className="hover-card" {...hoverCardContentOptions()}>
          <HoverCardArrow className="arrow" />
          <p>
            <strong>{fixture.name}</strong>
          </p>
          <p>{fixture.bio}</p>
          <a href={fixture.linkHref}>{fixture.link}</a>
        </HoverCardContent>
      </HoverCard>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action}
      </output>
    </div>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(
    <React.StrictMode>
      <Fixture />
    </React.StrictMode>
  )
}

export { Fixture, mount }
