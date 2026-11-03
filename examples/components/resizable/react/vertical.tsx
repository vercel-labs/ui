"use client"

import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/react/resizable"

function Example() {
  return (
    <Resizable orientation="vertical">
      <ResizablePanel defaultSize={25}>Header</ResizablePanel>
      <ResizableHandle aria-label="Resize header" />
      <ResizablePanel defaultSize={75}>Content</ResizablePanel>
    </Resizable>
  )
}

export { Example }
