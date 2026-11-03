import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@ui-sdk/react/collapsible"
import { Field, FieldControl, FieldLabel } from "@ui-sdk/react/field"
import { ChevronDownIcon } from "lucide-react"

function Example() {
  return (
    <Collapsible data-variant="card">
      <CollapsibleTrigger>
        <span data-slot="stack">
          <span>Add a delivery note</span>
          <span data-slot="hint">Optional, for the courier</span>
        </span>
        <ChevronDownIcon />
      </CollapsibleTrigger>
      <CollapsiblePanel keepMounted>
        <Field>
          <FieldLabel>Delivery note</FieldLabel>
          <FieldControl render={<textarea placeholder="Leave it with the front desk…" />} />
        </Field>
      </CollapsiblePanel>
    </Collapsible>
  )
}

export { Example }
