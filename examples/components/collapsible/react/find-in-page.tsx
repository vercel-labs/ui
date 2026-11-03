import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@ui-sdk/react/collapsible"
import { ChevronDownIcon } from "lucide-react"

function Example() {
  return (
    <div data-slot="stack">
      <Collapsible>
        <CollapsibleTrigger data-variant="secondary">
          Ingredients
          <ChevronDownIcon />
        </CollapsibleTrigger>
        <CollapsiblePanel hiddenUntilFound>
          <p data-slot="hint">Flour, butter, brown sugar, eggs, a pinch of cardamom and sea salt.</p>
        </CollapsiblePanel>
      </Collapsible>
    </div>
  )
}

export { Example }
