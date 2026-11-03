import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/solid/tooltip"
import { createSignal, For } from "solid-js"

const aligns = ["start", "center", "end"] as const
const sideOffsets = [4, 12, 24]
const alignOffsets = [-16, 0, 16]
const paddings = [8, 48]

function Example() {
  const [align, setAlign] = createSignal<(typeof aligns)[number]>("start")
  const [sideOffset, setSideOffset] = createSignal(4)
  const [alignOffset, setAlignOffset] = createSignal(0)
  const [collisionPadding, setCollisionPadding] = createSignal(8)

  return (
    <div data-slot="stack">
      <div data-slot="grid">
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
      <Tooltip>
        <TooltipTrigger>Offsets</TooltipTrigger>
        <TooltipContent
          align={align()}
          sideOffset={sideOffset()}
          alignOffset={alignOffset()}
          collisionPadding={collisionPadding()}
        >
          {align()}, {sideOffset()}px away, shifted {alignOffset()}px
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

export { Example }
