import { createUniqueId } from "solid-js"
import { Toggle, ToggleIcon } from "@ui-sdk/solid/toggle"

function Example() {
  const hint = createUniqueId()
  return (
    <div data-slot="stack">
      <Toggle disabled focusableWhenDisabled aria-describedby={hint}>
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
            <path d="M12 17v5" />
            <path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z" />
          </svg>
        </ToggleIcon>
        Pin to top
      </Toggle>
      <p id={hint} data-slot="hint">
        Only owners can pin messages.
      </p>
    </div>
  )
}

export { Example }
