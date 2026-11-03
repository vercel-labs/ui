import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@ui-sdk/solid/collapsible"
import { For } from "solid-js"

const details = [
  { label: "Shipping address", value: "221B Baker Street, London" },
  { label: "Items", value: "2 × Linen shirt" },
  { label: "Delivery", value: "Standard, arrives March 7" },
  { label: "Total", value: "$84.00" },
]

function Example() {
  return (
    <Collapsible>
      <div data-slot="row">
        <div data-slot="stack">
          <p>Order #4189</p>
          <p data-slot="hint">Placed on March 3</p>
        </div>
        <span data-slot="row">Shipped</span>
      </div>
      <div>
        <CollapsibleTrigger data-variant="secondary">
          Order details
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
          <dl>
            <For each={details}>
              {(detail) => (
                <div data-slot="row">
                  <dt>{detail.label}</dt>
                  <dd>{detail.value}</dd>
                </div>
              )}
            </For>
          </dl>
        </CollapsiblePanel>
      </div>
    </Collapsible>
  )
}

export { Example }
