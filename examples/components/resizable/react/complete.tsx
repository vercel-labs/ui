"use client"

import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/react/resizable"
import * as React from "react"

function Example() {
  const [moves, setMoves] = React.useState(0)
  const [saved, setSaved] = React.useState("nothing yet")
  return (
    <div data-slot="stack">
      <Resizable
        onLayoutChange={() => setMoves((count) => count + 1)}
        onLayoutCommit={(layout, details) =>
          setSaved(`${layout.map(Math.round).join(" / ")} after ${details.reason}`)
        }
      >
        <ResizablePanel defaultSize={40}>Files</ResizablePanel>
        <ResizableHandle aria-label="Resize files" />
        <ResizablePanel>Editor</ResizablePanel>
      </Resizable>
      <output data-slot="output">
        {moves} changes, saved {saved}
      </output>
    </div>
  )
}

export { Example }
