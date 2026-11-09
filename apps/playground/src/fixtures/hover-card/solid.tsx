import {
  HoverCard,
  HoverCardArrow,
  HoverCardContent,
  HoverCardTrigger,
} from "@ui-sdk/solid/hover-card"
import { render } from "@solidjs/web"
import { createSignal } from "solid-js"
import {
  hoverCardContentOptions,
  hoverCardFixture,
  hoverCardOptions,
} from "tests/fixtures/hover-card.ts"

function Fixture() {
  const [action, setAction] = createSignal("")
  const fixture = hoverCardFixture
  // Read here, not at module level, so the server reads each request's URL.
  const options = hoverCardOptions()
  return (
    <div class="fixture">
      <button>Before</button>
      <HoverCard
        {...options}
        onOpenChange={(open, { reason }) =>
          setAction(`${open ? "open" : "close"}: ${reason}`)
        }
      >
        <HoverCardTrigger href={fixture.href}>
          {fixture.trigger}
        </HoverCardTrigger>
        <HoverCardContent class="hover-card" {...hoverCardContentOptions()}>
          <HoverCardArrow class="arrow" />
          <p>
            <strong>{fixture.name}</strong>
          </p>
          <p>{fixture.bio}</p>
          <a href={fixture.linkHref}>{fixture.link}</a>
        </HoverCardContent>
      </HoverCard>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action()}
      </output>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { Fixture, mount }
