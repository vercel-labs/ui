import { NumberInput, NumberInputControl } from "@ui-sdk/solid/number-input"
import { Toolbar, ToolbarButton, ToolbarInput } from "@ui-sdk/solid/toolbar"

function Example() {
  return (
    <Toolbar aria-label="Text">
      <ToolbarButton data-variant="secondary" aria-label="Bold">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8" />
        </svg>
      </ToolbarButton>
      <NumberInput defaultValue={14} min={8} max={72}>
        <ToolbarInput render={(props) => <NumberInputControl {...props} aria-label="Font size" />} />
      </NumberInput>
      <ToolbarInput aria-label="Find" placeholder="Find…" />
      <ToolbarButton data-variant="secondary" aria-label="Search">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="m21 21-4.34-4.34" />
          <circle cx="11" cy="11" r="8" />
        </svg>
      </ToolbarButton>
    </Toolbar>
  )
}

export { Example }
