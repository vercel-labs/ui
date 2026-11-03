import * as React from "react"
import { isComposing } from "@ui-sdk/core"

function Example() {
  const [value, setValue] = React.useState("")
  const [query, setQuery] = React.useState("")
  const [handled, setHandled] = React.useState(true)
  return (
    <div className="flex w-full max-w-80 flex-col gap-3 text-sm">
      <p role="status" className="m-0 min-h-5">
        {query ? `Results for “${query}”` : "Type to see results"}
      </p>
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
        className="rounded-lg border border-border bg-background px-3 py-2 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <label className="flex items-center gap-2 text-muted-foreground">
        <input type="checkbox" checked={handled} onChange={(event) => setHandled(event.target.checked)} />
        Wait for the input method
      </label>
    </div>
  )
}

export { Example }
