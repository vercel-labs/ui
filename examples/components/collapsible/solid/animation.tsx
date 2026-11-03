import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@ui-sdk/solid/collapsible"
import { createSignal, For } from "solid-js"

const notes = [
  "Search now matches file contents, not only names.",
  "Shared links remember the folder they were opened from.",
  "Uploads resume after the connection drops.",
]

function Example() {
  const [settled, setSettled] = createSignal("")
  return (
    <div>
      <Collapsible onOpenChangeComplete={(open) => setSettled(open ? "opening" : "closing")}>
        <CollapsibleTrigger data-variant="secondary">
          Release notes
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
          <ul>
            <For each={notes}>{(note) => <li>{note}</li>}</For>
          </ul>
        </CollapsiblePanel>
      </Collapsible>
      <output data-slot="output">{settled() ? `Finished ${settled()}` : "Not animated yet"}</output>
    </div>
  )
}

export { Example }
