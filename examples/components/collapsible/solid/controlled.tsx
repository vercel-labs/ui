import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
  createCollapsibleController,
} from "@ui-sdk/solid/collapsible"
import { createSignal, For } from "solid-js"

const recoveryCodes = ["7KQ2-M9XD", "P4TR-8HZC", "W3NB-6JUE", "C5YF-2LSA"]

function Example() {
  const collapsible = createCollapsibleController()
  const [open, setOpen] = createSignal(false)
  const [reason, setReason] = createSignal("")

  return (
    <div data-slot="stack">
      <Collapsible
        open={open()}
        onOpenChange={(next, details) => {
          setOpen(next)
          setReason(details.reason)
        }}
        controller={collapsible}
      >
        <CollapsibleTrigger data-variant="secondary">
          Recovery codes
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </CollapsibleTrigger>
        <CollapsiblePanel>
          <div data-slot="stack">
            <p>Each code signs you in once if you lose your phone.</p>
            <ul data-slot="log">
              <For each={recoveryCodes}>{(code) => <li>{code}</li>}</For>
            </ul>
            <button data-variant="secondary" onClick={() => collapsible.close()}>
              Done
            </button>
          </div>
        </CollapsiblePanel>
      </Collapsible>
      <button data-variant="secondary" onClick={() => collapsible.toggle()}>
        Toggle from outside
      </button>
      <output data-slot="output">
        {open() ? "Open" : "Closed"}
        {reason() && `, last change: ${reason()}`}
      </output>
    </div>
  )
}

export { Example }
