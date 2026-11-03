import { HoverCard, HoverCardArrow, HoverCardContent, HoverCardTrigger } from "@ui-sdk/solid/hover-card"
import { createSignal, For } from "solid-js"

const sides = ["top", "right", "bottom", "left"] as const
const aligns = ["start", "center", "end"] as const
const alan = {
  handle: "alan",
  name: "Alan Turing",
  bio: "Described the universal machine every computer descends from.",
}

function Example() {
  const [side, setSide] = createSignal<(typeof sides)[number]>("bottom")
  const [align, setAlign] = createSignal<(typeof aligns)[number]>("center")

  return (
    <div data-slot="stack">
      <div data-slot="grid">
        <span data-slot="hint">side</span>
        <div data-slot="row" role="group" aria-label="side">
          <For each={sides}>
            {(value) => (
              <button
                type="button"
                data-size="sm"
                aria-pressed={side() === value ? "true" : "false"}
                onClick={() => setSide(value)}
              >
                {value}
              </button>
            )}
          </For>
        </div>
        <span data-slot="hint">align</span>
        <div data-slot="row" role="group" aria-label="align">
          <For each={aligns}>
            {(value) => (
              <button
                type="button"
                data-size="sm"
                aria-pressed={align() === value ? "true" : "false"}
                onClick={() => setAlign(value)}
              >
                {value}
              </button>
            )}
          </For>
        </div>
      </div>
      <HoverCard>
        <HoverCardTrigger href="https://example.com/people/alan">@{alan.handle}</HoverCardTrigger>
        <HoverCardContent side={side()} align={align()} sideOffset={10} arrowPadding={12}>
          <HoverCardArrow />
          <p>{alan.name}</p>
          <p>{alan.bio}</p>
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}

export { Example }
