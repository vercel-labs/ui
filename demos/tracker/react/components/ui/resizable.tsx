"use client"

import { ResizableHandle as ResizableHandlePrimitive } from "@ui-sdk/react/resizable"
import { cn } from "cn"
import type { ComponentProps } from "react"

function ResizableHandle({
  className,
  ...props
}: Omit<ComponentProps<typeof ResizableHandlePrimitive>, "className" | "children"> & { className?: string }) {
  return (
    <ResizableHandlePrimitive
      className={cn(
        "relative flex w-px items-center justify-center bg-border outline-none after:absolute after:inset-y-0 after:-inset-x-1 focus-visible:ring-3 focus-visible:ring-ring/30 data-dragging:bg-ring data-hovering:bg-ring",
        className,
      )}
      {...props}
    >
      <div className="z-10 h-6 w-1 shrink-0 rounded-lg bg-border" />
    </ResizableHandlePrimitive>
  )
}

export { ResizableHandle }
export { Resizable, ResizablePanel } from "@ui-sdk/react/resizable"
