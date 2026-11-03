"use client"

import { useShortcut } from "@ui-sdk/react/shortcuts"
import { createToolbarController, Toolbar, ToolbarButton } from "@ui-sdk/react/toolbar"
import * as React from "react"

function Example() {
  const [toolbar] = React.useState(createToolbarController)
  const [action, setAction] = React.useState("nothing yet")
  useShortcut("alt+f10", () => toolbar.focus(), { allowInInput: true })
  return (
    <div data-slot="stack">
      <textarea aria-label="Notes" placeholder="Type, then press Alt+F10" />
      <Toolbar controller={toolbar} aria-label="Notes">
        {["Bold", "Italic", "Link"].map((label) => (
          <ToolbarButton data-variant="secondary" key={label} onClick={() => setAction(label.toLowerCase())}>
            {label}
          </ToolbarButton>
        ))}
      </Toolbar>
      <div data-slot="row">
        <button data-variant="secondary" type="button" onClick={() => toolbar.focus()}>
          Focus toolbar
        </button>
        <output data-slot="output">Last: {action}</output>
      </div>
    </div>
  )
}

export { Example }
