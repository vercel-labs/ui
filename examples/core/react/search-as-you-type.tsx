import * as React from "react"
import { isComposing } from "@ui-sdk/core"

function Example() {
  const [value, setValue] = React.useState("")
  const [query, setQuery] = React.useState("")
  const [handled, setHandled] = React.useState(true)
  return (
    <div>
      <p role="status">{query ? `Results for “${query}”` : "Type to see results"}</p>
      <input
        type="search"
        aria-label="Filter"
        placeholder="Type to filter"
        value={value}
        onChange={(event) => {
          setValue(event.target.value)
          if (!handled || !isComposing(event)) setQuery(event.target.value)
        }}
        onCompositionEnd={(event) => setQuery(event.currentTarget.value)}
      />
      <label>
        <input type="checkbox" checked={handled} onChange={(event) => setHandled(event.target.checked)} />
        Wait for the input method
      </label>
    </div>
  )
}

export { Example }
