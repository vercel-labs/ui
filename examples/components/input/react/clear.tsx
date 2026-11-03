import { Input, InputClear, InputGroup } from "@ui-sdk/react/input"
import { SearchIcon, XIcon } from "lucide-react"
import * as React from "react"

export function Example() {
  const [query, setQuery] = React.useState("Lovelace")
  const [reason, setReason] = React.useState("")
  return (
    <div data-slot="stack">
      <InputGroup>
        <SearchIcon aria-hidden="true" />
        <Input
          type="search"
          aria-label="Search people"
          value={query}
          onValueChange={(value, details) => {
            setQuery(value)
            setReason(details.reason)
          }}
        />
        <InputClear aria-label="Clear search">
          <XIcon aria-hidden="true" />
        </InputClear>
      </InputGroup>
      <p data-slot="hint">{reason ? `Last change: ${reason}` : "Type, or clear the search."}</p>
    </div>
  )
}
