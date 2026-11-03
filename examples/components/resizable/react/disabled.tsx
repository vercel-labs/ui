"use client"

import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/react/resizable"
import * as React from "react"

function Example() {
  const [disabled, setDisabled] = React.useState(false)
  return (
    <div data-slot="stack">
      <Resizable disabled={disabled}>
        <ResizablePanel>Fixed</ResizablePanel>
        <ResizableHandle disabled aria-label="Resize fixed" />
        <ResizablePanel>Two</ResizablePanel>
        <ResizableHandle aria-label="Resize two" />
        <ResizablePanel>Three</ResizablePanel>
      </Resizable>
      <label data-slot="label">
        <input type="checkbox" checked={disabled} onChange={(event) => setDisabled(event.target.checked)} />
        Disable the group
      </label>
    </div>
  )
}

export { Example }
