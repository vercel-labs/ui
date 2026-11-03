import * as React from "react"
import { bindAvoidKeyboard } from "@ui-sdk/core"

const groceries = "Groceries\n- oat milk\n- lemons"

const count = (text: string) => text.split("\n").filter((line) => line.startsWith("-")).length

function Example() {
  const [items, setItems] = React.useState(count(groceries))
  const lift = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => bindAvoidKeyboard(lift.current!), [])
  return (
    <div className="relative flex h-60 w-full max-w-80 flex-col rounded-xl border border-border p-3 text-sm">
      <textarea
        aria-label="Groceries"
        rows={4}
        defaultValue={groceries}
        onChange={(event) => setItems(count(event.target.value))}
        className="resize-none bg-transparent text-base outline-none"
      />
      <p className="m-0 text-xs text-muted-foreground">
        On a phone, tap the list, then scroll the page with the keyboard open.
      </p>
      <div ref={lift} className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-4">
        <p
          aria-live="polite"
          className="m-0 rounded-full bg-foreground px-3 py-1.5 text-xs text-background shadow-lg"
        >
          {items === 1 ? "1 item" : `${items} items`} · Saved
        </p>
      </div>
    </div>
  )
}

export { Example }
