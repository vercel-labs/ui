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
    <div>
      <dl>
        {rows.map(([name, value]) => (
          <React.Fragment key={name}>
            <dt>{name}</dt>
            <dd>{value}</dd>
          </React.Fragment>
        ))}
      </dl>
      <div>
        <button
          type="button"
          aria-expanded={open}
          onPointerEnter={hovers ? () => setOpen(true) : undefined}
          onPointerLeave={hovers ? () => setOpen(false) : undefined}
          onClick={() => setOpen((open) => !open)}
        >
          {kind.hover === "unknown"
            ? "Shipping"
            : hovers
              ? "Shipping (hover for details)"
              : "Shipping (tap for details)"}
        </button>
        {open && <p role="status">Free over $50. Arrives in 2 to 4 days.</p>}
      </div>
    </div>
  )
}

export { Example }
