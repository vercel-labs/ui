"use client"

import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/react/resizable"

function Example() {
  return (
    <Resizable>
      <ResizablePanel defaultSize={50}>One</ResizablePanel>
      <ResizableHandle aria-label="Resize one"></ResizableHandle>
      <ResizablePanel defaultSize={50}>
        <Resizable orientation="vertical">
          <ResizablePanel defaultSize={25}>Two</ResizablePanel>
          <ResizableHandle aria-label="Resize two"></ResizableHandle>
          <ResizablePanel defaultSize={75}>Three</ResizablePanel>
        </Resizable>
      </ResizablePanel>
    </Resizable>
  )
}

export { Example }
