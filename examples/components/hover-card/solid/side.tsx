import { HoverCard, HoverCardContent, HoverCardTrigger } from "@ui-sdk/solid/hover-card"
import { For } from "solid-js"

const sides = ["left", "top", "bottom", "right"] as const

function Example() {
  return (
    <div data-slot="row">
      <For each={sides}>
        {(side) => (
          <HoverCard>
            <HoverCardTrigger href={`https://example.com/${side}`}>{side}</HoverCardTrigger>
            <HoverCardContent side={side}>
              <p>{side}</p>
              <p data-slot="hint">The card opens on this side of the link.</p>
            </HoverCardContent>
          </HoverCard>
        )}
      </For>
    </div>
  )
}

export { Example }
