"use client"

import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/react/resizable"

function Example() {
  return (
    <Resizable>
      <ResizablePanel defaultSize={25}>Sidebar</ResizablePanel>
      <ResizableHandle aria-label="Resize sidebar">
        <div />
      </ResizableHandle>
      <ResizablePanel defaultSize={75}>Content</ResizablePanel>
    </Resizable>
  )
}

export { Example }
