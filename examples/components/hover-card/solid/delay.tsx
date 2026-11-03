import { HoverCard, HoverCardContent, HoverCardTrigger } from "@ui-sdk/solid/hover-card"
import { createSignal, For } from "solid-js"

const timings = [
  { label: "Instant", delay: 0, closeDelay: 0 },
  { label: "Default", delay: 600, closeDelay: 300 },
  { label: "Patient", delay: 1200, closeDelay: 600 },
]

function Example() {
  const [enabled, setEnabled] = createSignal(true)

  return (
    <div data-slot="stack">
      <div data-slot="row">
        <For each={timings}>
          {(timing) => (
            <HoverCard delay={timing.delay} closeDelay={timing.closeDelay} disabled={!enabled()}>
              <HoverCardTrigger href={`https://example.com/${timing.label.toLowerCase()}`}>
                {timing.label}
              </HoverCardTrigger>
              <HoverCardContent>
                <p>{timing.label}</p>
                <p data-slot="hint">
                  Opens after {timing.delay}ms and closes {timing.closeDelay}ms after the pointer leaves.
                </p>
              </HoverCardContent>
            </HoverCard>
          )}
        </For>
      </div>
      <label data-slot="label">
        <input
          type="checkbox"
          checked={enabled()}
          onChange={(event) => setEnabled(event.currentTarget.checked)}
        />
        Show cards
      </label>
    </div>
  )
}

export { Example }
