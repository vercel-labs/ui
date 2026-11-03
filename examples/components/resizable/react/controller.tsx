"use client"

import {
  createResizableController,
  Resizable,
  ResizableHandle,
  ResizablePanel,
} from "@ui-sdk/react/resizable"
import * as React from "react"

function Example() {
  const [editor] = React.useState(createResizableController)
  const [reading, setReading] = React.useState("")
  return (
    <div data-slot="stack">
      <Resizable controller={editor}>
        <ResizablePanel id="controller-sidebar" defaultSize={30} minSize={20} collapsible>
          Sidebar
        </ResizablePanel>
        <ResizableHandle aria-label="Resize sidebar" />
        <ResizablePanel>Editor</ResizablePanel>
      </Resizable>
      <div data-slot="row">
        <button data-variant="secondary" type="button" onClick={() => editor.collapse("controller-sidebar")}>
          Collapse
        </button>
        <button data-variant="secondary" type="button" onClick={() => editor.expand("controller-sidebar")}>
          Expand
        </button>
        <button
          data-variant="secondary"
          type="button"
          onClick={() => editor.resize("controller-sidebar", "240px")}
        >
          240px
        </button>
        <button
          data-variant="secondary"
          type="button"
          onClick={() =>
            setReading(
              `${editor.getLayout().map(Math.round).join(" / ")}${editor.isCollapsed(0) ? ", collapsed" : ""}`,
            )
          }
        >
          Read
        </button>
      </div>
      {reading && <output data-slot="output">{reading}</output>}
    </div>
  )
}

export { Example }
