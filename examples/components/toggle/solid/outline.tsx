import { Toggle, ToggleIcon } from "@ui-sdk/solid/toggle"

export function Example() {
  return (
    <div data-slot="row">
      <Toggle data-variant="outline">
        <ToggleIcon>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <line x1="19" x2="10" y1="4" y2="4" />
            <line x1="14" x2="5" y1="20" y2="20" />
            <line x1="15" x2="9" y1="4" y2="20" />
          </svg>
        </ToggleIcon>
        Italic
      </Toggle>
      <Toggle data-variant="outline">
        <ToggleIcon>
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
        </ToggleIcon>
        Bold
      </Toggle>
    </div>
  )
}
