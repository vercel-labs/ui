import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@ui-sdk/react/collapsible"
import { ChevronDownIcon } from "lucide-react"

function Example() {
  return (
    <Collapsible>
      <CollapsibleTrigger data-variant="secondary">
        Add a delivery note
        <ChevronDownIcon />
      </CollapsibleTrigger>
      <CollapsiblePanel keepMounted>
        <label data-slot="label">
          <span>Delivery note</span>
          <textarea placeholder="Leave it with the front desk…" />
        </label>
      </CollapsiblePanel>
    </Collapsible>
  )
}

export { Example }
