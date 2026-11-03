"use client"

import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/react/resizable"

function Example() {
  return (
    <Resizable defaultLayout={[30, 70]}>
      <ResizablePanel>Files</ResizablePanel>
      <ResizableHandle aria-label="Resize files" />
      <ResizablePanel>Editor</ResizablePanel>
    </Resizable>
  )
}

export { Example }
