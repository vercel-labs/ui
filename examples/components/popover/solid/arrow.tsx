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
  const [open, setOpen] = createSignal(false)
  const [side, setSide] = createSignal<(typeof sides)[number]>("bottom")
  const [align, setAlign] = createSignal<(typeof aligns)[number]>("start")
  let controls: HTMLDivElement | undefined

  return (
    <div data-slot="stack">
      <div data-slot="stack" ref={controls}>
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
      <Popover
        open={open()}
        onOpenChange={(next, details) => {
          const target = details.event?.target
          if (!next && target instanceof Node && controls?.contains(target)) return details.cancel()
          setOpen(next)
        }}
      >
        <PopoverTrigger aria-label="Help">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <path d="M12 17h.01" />
          </svg>
        </PopoverTrigger>
        <PopoverContent side={side()} align={align()} sideOffset={10} arrowPadding={12}>
          <PopoverArrow />
          <PopoverTitle>Keyboard shortcuts</PopoverTitle>
          <PopoverDescription>Press ? anywhere to see every shortcut.</PopoverDescription>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export { Example }
