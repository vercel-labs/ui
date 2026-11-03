import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@ui-sdk/solid/collapsible"

function Example() {
  return (
    <div data-slot="stack">
      <Collapsible>
        <CollapsibleTrigger data-variant="secondary">
          Ingredients
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
        <CollapsiblePanel hiddenUntilFound>
          <p data-slot="hint">Flour, butter, brown sugar, eggs, a pinch of cardamom and sea salt.</p>
        </CollapsiblePanel>
      </Collapsible>
    </div>
  )
}

export { Example }
