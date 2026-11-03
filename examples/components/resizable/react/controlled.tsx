"use client"

import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/react/resizable"
import * as React from "react"

function Example() {
  const [layout, setLayout] = React.useState([30, 70])
  return (
    <div data-slot="stack">
      <Resizable layout={layout} onLayoutChange={setLayout}>
        <ResizablePanel minSize={20}>Files</ResizablePanel>
        <ResizableHandle aria-label="Resize files" />
        <ResizablePanel minSize={20}>Editor</ResizablePanel>
      </Resizable>
      <div data-slot="row">
        <button data-variant="secondary" type="button" onClick={() => setLayout([20, 80])}>
          Narrow
        </button>
        <button data-variant="secondary" type="button" onClick={() => setLayout([50, 50])}>
          Even
        </button>
      </div>
      <output data-slot="output">{layout.map(Math.round).join(" / ")}</output>
    </div>
  )
}

export { Example }
