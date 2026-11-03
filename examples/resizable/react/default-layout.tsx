"use client"

import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/react/resizable"

function Example() {
  return (
    <Resizable defaultLayout={[30, 70]} className="h-50 w-full max-w-md rounded-2xl border border-border">
      <ResizablePanel className="flex items-center justify-center p-6 text-sm font-medium">
        Files
      </ResizablePanel>
      <ResizableHandle
        aria-label="Resize files"
        className="relative flex w-px items-center justify-center bg-border outline-none focus-visible:ring-3 focus-visible:ring-ring/30 data-hovering:bg-ring data-dragging:bg-ring aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full"
      />
      <ResizablePanel className="flex items-center justify-center p-6 text-sm font-medium">
        Editor
      </ResizablePanel>
    </Resizable>
  )
}

export { Example }
