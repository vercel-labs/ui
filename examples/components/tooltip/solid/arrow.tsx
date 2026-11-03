import { Tooltip, TooltipArrow, TooltipContent, TooltipTrigger } from "@ui-sdk/solid/tooltip"
import { createSignal, For } from "solid-js"

const sides = ["top", "right", "bottom", "left"] as const
const aligns = ["start", "center", "end"] as const

function Example() {
  const [open, setOpen] = createSignal(false)
  const [pinned, setPinned] = createSignal(false)
  const [side, setSide] = createSignal<(typeof sides)[number]>("top")
  const [align, setAlign] = createSignal<(typeof aligns)[number]>("center")

  return (
    <div data-slot="stack">
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
        <label data-slot="label">
          <input
            type="checkbox"
            checked={pinned()}
            onChange={(event) => setPinned(event.currentTarget.checked)}
          />
          Keep open
        </label>
      </div>
      <Tooltip
        open={pinned() || open()}
        onOpenChange={(next, details) => {
          setOpen(next)
          if (!next && pinned()) details.cancel()
        }}
      >
        <TooltipTrigger>
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
        </TooltipTrigger>
        <TooltipContent side={side()} align={align()} sideOffset={8} arrowPadding={8}>
          <TooltipArrow />
          Keyboard shortcuts
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

export { Example }
