"use client"

import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/react/resizable"
import { Folder, Search } from "lucide-react"

function Example() {
  return (
    <Resizable className="h-50 w-full max-w-md rounded-2xl border border-border">
      <ResizablePanel
        defaultSize={30}
        minSize={25}
        collapsible
        collapsedSize="56px"
        className="group flex flex-col gap-1 p-2 text-sm"
      >
        <span className="flex h-8 items-center gap-2 rounded-xl bg-muted px-2.5 font-medium group-data-collapsed:justify-center group-data-collapsed:px-0">
          <Folder className="size-4 shrink-0" />
          <span className="truncate group-data-collapsed:hidden">Files</span>
        </span>
        <span className="flex h-8 items-center gap-2 rounded-xl px-2.5 text-muted-foreground group-data-collapsed:justify-center group-data-collapsed:px-0">
          <Search className="size-4 shrink-0" />
          <span className="truncate group-data-collapsed:hidden">Search</span>
        </span>
      </ResizablePanel>
      <ResizableHandle
        aria-label="Resize sidebar"
        className="relative flex w-px items-center justify-center bg-border outline-none focus-visible:ring-3 focus-visible:ring-ring/30 data-hovering:bg-ring data-dragging:bg-ring aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full [&[aria-orientation=horizontal]>div]:rotate-90"
      >
        <div className="z-10 h-6 w-1 shrink-0 rounded-lg bg-border" />
      </ResizableHandle>
      <ResizablePanel className="flex items-center justify-center p-6 text-sm font-medium">
        Editor
      </ResizablePanel>
    </Resizable>
  )
}

export { Example }
