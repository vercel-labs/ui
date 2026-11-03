import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/solid/tooltip"
import { createSignal, For } from "solid-js"

const icon = (markup: string) => () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    innerHTML={markup}
  />
)
const Bold = icon('<path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8" />')
const Code = icon('<path d="m16 18 6-6-6-6" /><path d="m8 6-6 6 6 6" />')
const Italic = icon(
  '<line x1="19" x2="10" y1="4" y2="4" /><line x1="14" x2="5" y1="20" y2="20" /><line x1="15" x2="9" y1="4" y2="20" />',
)
const Link = icon(
  '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />',
)
const Underline = icon('<path d="M6 4v6a6 6 0 0 0 12 0V4" /><line x1="4" x2="20" y1="20" y2="20" />')

const tools = [
  { icon: Bold, label: "Bold" },
  { icon: Italic, label: "Italic" },
  { icon: Underline, label: "Underline" },
  { icon: Link, label: "Link" },
  { icon: Code, label: "Code" },
]

const delays = [0, 600, 1200]
const closeDelays = [0, 300]

function Example() {
  const [delay, setDelay] = createSignal(600)
  const [closeDelay, setCloseDelay] = createSignal(0)
  const [enabled, setEnabled] = createSignal(true)

  return (
    <div data-slot="stack">
      <div data-slot="grid">
        <span data-slot="hint">delay</span>
        <div data-slot="row" role="group" aria-label="delay">
          <For each={delays}>
            {(value) => (
              <button
                type="button"
                data-size="sm"
                aria-pressed={delay() === value ? "true" : "false"}
                onClick={() => setDelay(value)}
              >
                {value}
              </button>
            )}
          </For>
        </div>
        <span data-slot="hint">closeDelay</span>
        <div data-slot="row" role="group" aria-label="closeDelay">
          <For each={closeDelays}>
            {(value) => (
              <button
                type="button"
                data-size="sm"
                aria-pressed={closeDelay() === value ? "true" : "false"}
                onClick={() => setCloseDelay(value)}
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
          checked={enabled()}
          onChange={(event) => setEnabled(event.currentTarget.checked)}
        />
        Show tooltips
      </label>
      <div data-slot="row" role="group" aria-label="Formatting">
        <For each={tools}>
          {(tool) => (
            <Tooltip delay={delay()} closeDelay={closeDelay()} disabled={!enabled()}>
              <TooltipTrigger>
                <tool.icon />
              </TooltipTrigger>
              <TooltipContent>{tool.label}</TooltipContent>
            </Tooltip>
          )}
        </For>
      </div>
    </div>
  )
}

export { Example }
