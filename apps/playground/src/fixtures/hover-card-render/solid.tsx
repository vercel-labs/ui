import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@ui-sdk/solid/hover-card"
import { render } from "@solidjs/web"

function Fixture() {
  return (
    <div class="fixture">
      <button>Before</button>
      <HoverCard delay={100} closeDelay={100}>
        <HoverCardTrigger
          href="#repo"
          class={(state) => (state.open ? "is-open" : "is-closed")}
          render={(props, state) => (
            <a {...props}>
              ui-sdk <span aria-hidden="true">{state.open ? "▲" : "▼"}</span>
            </a>
          )}
        />
        <HoverCardContent
          class="hover-card"
          render={(props) => <section {...props} aria-label="Repository" />}
        >
          A headless UI kit.
        </HoverCardContent>
      </HoverCard>
      <button>After</button>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { mount }
