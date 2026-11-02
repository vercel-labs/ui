import * as React from "react"
import { createPointerKind } from "@ui-sdk/core"
import { usePreference } from "@ui-sdk/react/preferences"

const pointerKind = createPointerKind()

function Example() {
  const kind = usePreference(pointerKind)
  const [open, setOpen] = React.useState(false)
  const hovers = kind.hover === "hover"
  const rows = [
    ["pointer", kind.pointer],
    ["hover", kind.hover],
    ["anyPointer", kind.anyPointer],
    ["anyHover", kind.anyHover],
  ]
  return (
    <div className="flex w-full max-w-80 flex-col gap-4 text-sm">
      <dl className="m-0 grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-xs">
        {rows.map(([name, value]) => (
          <React.Fragment key={name}>
            <dt className="text-muted-foreground">{name}</dt>
            <dd className="m-0">{value}</dd>
          </React.Fragment>
        ))}
      </dl>
      <div className="flex flex-col items-start gap-2">
        <button
          type="button"
          aria-expanded={open}
          onPointerEnter={hovers ? () => setOpen(true) : undefined}
          onPointerLeave={hovers ? () => setOpen(false) : undefined}
          onClick={() => setOpen((open) => !open)}
          className="rounded-lg border border-border px-3 py-2"
        >
          {kind.hover === "unknown"
            ? "Shipping"
            : hovers
              ? "Shipping (hover for details)"
              : "Shipping (tap for details)"}
        </button>
        {open && (
          <p role="status" className="m-0 rounded-lg bg-muted px-3 py-2 text-xs">
            Free over $50. Arrives in 2 to 4 days.
          </p>
        )}
      </div>
    </div>
  )
}

export { Example }
