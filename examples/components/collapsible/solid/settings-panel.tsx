import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@ui-sdk/solid/collapsible"

function Example() {
  return (
    <Collapsible>
      <p>Radius</p>
      <p data-slot="hint">Set the corner radius of the element.</p>
      <div data-slot="row">
        <label data-slot="label">
          <span>Radius</span>
          <input type="number" min={0} value={8} />
        </label>
        <CollapsibleTrigger data-variant="secondary">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          Edit each axis
        </CollapsibleTrigger>
      </div>
      <CollapsiblePanel>
        <div data-slot="grid">
          <label data-slot="label">
            <span>Radius X</span>
            <input type="number" min={0} value={8} />
          </label>
          <label data-slot="label">
            <span>Radius Y</span>
            <input type="number" min={0} value={8} />
          </label>
        </div>
      </CollapsiblePanel>
    </Collapsible>
  )
}

export { Example }
