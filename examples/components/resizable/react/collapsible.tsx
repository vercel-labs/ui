"use client"

import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/react/resizable"
import { FolderIcon, SearchIcon } from "lucide-react"

function Example() {
  return (
    <Resizable>
      <ResizablePanel defaultSize={30} minSize={25} collapsible collapsedSize="56px">
        <span data-slot="row">
          <FolderIcon />
          <span>Files</span>
        </span>
        <span data-slot="row">
          <SearchIcon />
          <span>Search</span>
        </span>
      </ResizablePanel>
      <ResizableHandle aria-label="Resize sidebar">
        <div />
      </ResizableHandle>
      <ResizablePanel>Editor</ResizablePanel>
    </Resizable>
  )
}

export { Example }
