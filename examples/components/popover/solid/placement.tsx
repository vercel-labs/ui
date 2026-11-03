import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/solid/popover"
import { createSignal, For } from "solid-js"

const sides = ["top", "right", "bottom", "left"] as const
const aligns = ["start", "center", "end"] as const

function Example() {
  const [sideOffset, setSideOffset] = createSignal(8)
  const [alignOffset, setAlignOffset] = createSignal(0)
  const [collisionPadding, setCollisionPadding] = createSignal(8)

  const [side, setSide] = createSignal<(typeof sides)[number]>("bottom")
  const [align, setAlign] = createSignal<(typeof aligns)[number]>("center")

  return (
    <div data-slot="stack">
      <div data-slot="stack">
        <div data-slot="row" role="group" aria-label="Side">
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
        <div data-slot="row" role="group" aria-label="Align">
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
      <div data-slot="stack">
        <label data-slot="label">
          Side offset<span data-slot="hint">{sideOffset()}px</span>
          <input
            type="range"
            min={0}
            max={32}
            value={sideOffset()}
            onInput={(event) => setSideOffset(Number(event.currentTarget.value))}
          />
        </label>
        <label data-slot="label">
          Align offset<span data-slot="hint">{alignOffset()}px</span>
          <input
            type="range"
            min={-24}
            max={24}
            value={alignOffset()}
            onInput={(event) => setAlignOffset(Number(event.currentTarget.value))}
          />
        </label>
        <label data-slot="label">
          Collision padding<span data-slot="hint">{collisionPadding()}px</span>
          <input
            type="range"
            min={0}
            max={48}
            value={collisionPadding()}
            onInput={(event) => setCollisionPadding(Number(event.currentTarget.value))}
          />
        </label>
      </div>
      <Popover>
        <PopoverTrigger>Placement</PopoverTrigger>
        <PopoverContent
          side={side()}
          align={align()}
          sideOffset={sideOffset()}
          alignOffset={alignOffset()}
          collisionPadding={collisionPadding()}
        >
          <PopoverArrow />
          <PopoverTitle>
            {side()} {align()}
          </PopoverTitle>
          <PopoverDescription>Choose a side, alignment, and offsets above.</PopoverDescription>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export { Example }
