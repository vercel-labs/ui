"use client"

import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/react/resizable"

function Example() {
  return (
    <div dir="rtl" className="w-full max-w-md">
      <Resizable className="h-50 w-full max-w-md rounded-2xl border border-border">
        <ResizablePanel defaultSize={50} className="flex items-center justify-center p-6 text-sm font-medium">
          واحد
        </ResizablePanel>
        <ResizableHandle
          aria-label="تغيير حجم واحد"
          className="relative flex w-px items-center justify-center bg-border outline-none focus-visible:ring-3 focus-visible:ring-ring/30 data-hovering:bg-ring data-dragging:bg-ring aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full [&[aria-orientation=horizontal]>div]:rotate-90"
        >
          <div className="z-10 h-6 w-1 shrink-0 rounded-lg bg-border" />
        </ResizableHandle>
        <ResizablePanel defaultSize={50}>
          <Resizable orientation="vertical" className="h-full">
            <ResizablePanel
              defaultSize={25}
              className="flex items-center justify-center p-6 text-sm font-medium"
            >
              اثنان
            </ResizablePanel>
            <ResizableHandle
              aria-label="تغيير حجم اثنان"
              className="relative flex w-px items-center justify-center bg-border outline-none focus-visible:ring-3 focus-visible:ring-ring/30 data-hovering:bg-ring data-dragging:bg-ring aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full [&[aria-orientation=horizontal]>div]:rotate-90"
            >
              <div className="z-10 h-6 w-1 shrink-0 rounded-lg bg-border" />
            </ResizableHandle>
            <ResizablePanel
              defaultSize={75}
              className="flex items-center justify-center p-6 text-sm font-medium"
            >
              ثلاثة
            </ResizablePanel>
          </Resizable>
        </ResizablePanel>
      </Resizable>
    </div>
  )
}

export { Example }
