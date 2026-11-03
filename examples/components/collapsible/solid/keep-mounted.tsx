import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@ui-sdk/solid/collapsible"

function Example() {
  return (
    <Collapsible>
      <CollapsibleTrigger data-variant="secondary">
        Add a delivery note
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
