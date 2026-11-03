import { HoverCard, HoverCardContent, HoverCardTrigger } from "@ui-sdk/solid/hover-card"
import { createSignal, For } from "solid-js"

const sideOffsets = [4, 12, 24]
const alignOffsets = [-16, 0, 16]
const paddings = [8, 48]

function Example() {
  const [sideOffset, setSideOffset] = createSignal(4)
  const [alignOffset, setAlignOffset] = createSignal(0)
  const [collisionPadding, setCollisionPadding] = createSignal(8)

  return (
    <div data-slot="stack">
      <div data-slot="grid">
        <span data-slot="hint">sideOffset</span>
        <div data-slot="row" role="group" aria-label="sideOffset">
          <For each={sideOffsets}>
            {(value) => (
              <button
                type="button"
                data-size="sm"
                aria-pressed={sideOffset() === value ? "true" : "false"}
                onClick={() => setSideOffset(value)}
              >
                {value}
              </button>
            )}
          </For>
        </div>
        <span data-slot="hint">alignOffset</span>
        <div data-slot="row" role="group" aria-label="alignOffset">
          <For each={alignOffsets}>
            {(value) => (
              <button
                type="button"
                data-size="sm"
                aria-pressed={alignOffset() === value ? "true" : "false"}
                onClick={() => setAlignOffset(value)}
              >
                {value}
              </button>
            )}
          </For>
        </div>
        <span data-slot="hint">collisionPadding</span>
        <div data-slot="row" role="group" aria-label="collisionPadding">
          <For each={paddings}>
            {(value) => (
              <button
                type="button"
                data-size="sm"
                aria-pressed={collisionPadding() === value ? "true" : "false"}
                onClick={() => setCollisionPadding(value)}
              >
                {value}
              </button>
            )}
          </For>
        </div>
      </div>
      <HoverCard>
        <HoverCardTrigger href="https://example.com/offsets">Offsets</HoverCardTrigger>
        <HoverCardContent
          align="start"
          sideOffset={sideOffset()}
          alignOffset={alignOffset()}
          collisionPadding={collisionPadding()}
        >
          <p>Offsets</p>
          <p data-slot="hint">
            {sideOffset()}px from the link, shifted {alignOffset()}px, {collisionPadding()}px from the edges.
          </p>
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}

export { Example }
