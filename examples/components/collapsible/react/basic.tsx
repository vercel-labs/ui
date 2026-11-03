import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@ui-sdk/react/collapsible"
import { ChevronDownIcon } from "lucide-react"

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
          <ChevronDownIcon />
        </CollapsibleTrigger>
        <CollapsiblePanel>
          <dl>
            {details.map((detail) => (
              <div data-slot="row" key={detail.label}>
                <dt>{detail.label}</dt>
                <dd>{detail.value}</dd>
              </div>
            ))}
          </dl>
        </CollapsiblePanel>
      </div>
    </Collapsible>
  )
}

export { Example }
