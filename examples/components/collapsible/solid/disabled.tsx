import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@ui-sdk/solid/collapsible"

function Example() {
  return (
    <div data-slot="stack">
      <Collapsible>
        <CollapsibleTrigger data-variant="secondary">
          Shipping details
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
          <p data-slot="hint">Standard shipping. Arrives in 3 to 5 business days.</p>
        </CollapsiblePanel>
      </Collapsible>
      <Collapsible disabled>
        <CollapsibleTrigger data-variant="secondary">
          <span>Gift options</span>
          <span data-slot="hint">Not available for this order</span>
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
          <p data-slot="hint">Add a gift message and wrapping.</p>
        </CollapsiblePanel>
      </Collapsible>
    </div>
  )
}

export { Example }
