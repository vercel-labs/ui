import { Input, InputClear, InputGroup } from "@ui-sdk/solid/input"
import { createSignal } from "solid-js"

export function Example() {
  const [query, setQuery] = createSignal("Lovelace")
  const [reason, setReason] = createSignal("")
  return (
    <div data-slot="stack">
      <InputGroup>
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
        <Input
          type="search"
          aria-label="Search people"
          value={query()}
          onValueChange={(value, details) => {
            setQuery(value)
            setReason(details.reason)
          }}
        />
        <InputClear aria-label="Clear search">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </InputClear>
      </InputGroup>
      <p data-slot="hint">{reason() ? `Last change: ${reason()}` : "Type, or clear the search."}</p>
    </div>
  )
}
