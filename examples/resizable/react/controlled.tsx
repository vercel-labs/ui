"use client"

import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/react/resizable"
import * as React from "react"

function Example() {
  const [layout, setLayout] = React.useState([30, 70])
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Resizable
        layout={layout}
        onLayoutChange={setLayout}
        className="h-50 w-full rounded-2xl border border-border"
      >
        <ResizablePanel minSize={20} className="flex items-center justify-center p-6 text-sm font-medium">
          Files
        </ResizablePanel>
        <ResizableHandle
          aria-label="Resize files"
          className="relative flex w-px items-center justify-center bg-border outline-none focus-visible:ring-3 focus-visible:ring-ring/30 data-hovering:bg-ring data-dragging:bg-ring aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full"
        />
        <ResizablePanel minSize={20} className="flex items-center justify-center p-6 text-sm font-medium">
          Editor
        </ResizablePanel>
      </Resizable>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="inline-flex h-8 shrink-0 cursor-default items-center justify-center gap-1.5 rounded-2xl border border-transparent bg-secondary px-3 text-sm font-medium whitespace-nowrap text-secondary-foreground outline-none select-none transition-colors hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:translate-y-px motion-reduce:transition-none motion-reduce:transform-none"
          onClick={() => setLayout([20, 80])}
        >
          Narrow
        </button>
        <button
          type="button"
          className="inline-flex h-8 shrink-0 cursor-default items-center justify-center gap-1.5 rounded-2xl border border-transparent bg-secondary px-3 text-sm font-medium whitespace-nowrap text-secondary-foreground outline-none select-none transition-colors hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:translate-y-px motion-reduce:transition-none motion-reduce:transform-none"
          onClick={() => setLayout([50, 50])}
        >
          Even
        </button>
      </div>
      <output className="text-sm text-muted-foreground tabular-nums">
        {layout.map(Math.round).join(" / ")}
      </output>
    </div>
  )
}

export { Example }
