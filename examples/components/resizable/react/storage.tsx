"use client"

import { Resizable, ResizableHandle, ResizablePanel, type ResizableStorage } from "@ui-sdk/react/resizable"

const session: ResizableStorage = {
  getItem: (key) => sessionStorage.getItem(key),
  setItem: (key, value) => sessionStorage.setItem(key, value),
}

function Example() {
  return (
    <Resizable autoSaveId="docs-storage" storage={session}>
      <ResizablePanel id="session-files" defaultSize={30}>
        Files
      </ResizablePanel>
      <ResizableHandle aria-label="Resize files" />
      <ResizablePanel id="session-editor">Editor</ResizablePanel>
    </Resizable>
  )
}

export { Example }
