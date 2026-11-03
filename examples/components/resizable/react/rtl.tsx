"use client"

import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/react/resizable"

function Example() {
  return (
    <div dir="rtl">
      <Resizable>
        <ResizablePanel defaultSize={50}>واحد</ResizablePanel>
        <ResizableHandle aria-label="تغيير حجم واحد">
          <div />
        </ResizableHandle>
        <ResizablePanel defaultSize={50}>
          <Resizable orientation="vertical">
            <ResizablePanel defaultSize={25}>اثنان</ResizablePanel>
            <ResizableHandle aria-label="تغيير حجم اثنان">
              <div />
            </ResizableHandle>
            <ResizablePanel defaultSize={75}>ثلاثة</ResizablePanel>
          </Resizable>
        </ResizablePanel>
      </Resizable>
    </div>
  )
}

export { Example }
