"use client"

import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/react/resizable"
import * as React from "react"

function Example() {
  const [disabled, setDisabled] = React.useState(false)
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Resizable
        disabled={disabled}
        className="h-50 w-full rounded-2xl border border-border data-disabled:opacity-50"
      >
        <ResizablePanel className="flex items-center justify-center p-6 text-sm font-medium">
          Fixed
        </ResizablePanel>
        <ResizableHandle
          disabled
          aria-label="Resize fixed"
          className="relative flex w-px items-center justify-center bg-border outline-none focus-visible:ring-3 focus-visible:ring-ring/30 data-hovering:bg-ring data-dragging:bg-ring aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full data-disabled:opacity-50"
        />
        <ResizablePanel className="flex items-center justify-center p-6 text-sm font-medium">
          Two
        </ResizablePanel>
        <ResizableHandle
          aria-label="Resize two"
          className="relative flex w-px items-center justify-center bg-border outline-none focus-visible:ring-3 focus-visible:ring-ring/30 data-hovering:bg-ring data-dragging:bg-ring aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full data-disabled:opacity-50"
        />
        <ResizablePanel className="flex items-center justify-center p-6 text-sm font-medium">
          Three
        </ResizablePanel>
      </Resizable>
      <label className="flex w-fit items-center gap-2 text-sm">
        <input
          type="checkbox"
          className="size-4 accent-primary"
          checked={disabled}
          onChange={(event) => setDisabled(event.target.checked)}
        />
        Disable the group
      </label>
    </div>
  )
}

export { Example }
