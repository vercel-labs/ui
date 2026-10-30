"use client"

import {
  ScrollAreaContent,
  ScrollArea as ScrollAreaPrimitive,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "@ui-sdk/react/scroll-area"
import { cn } from "cn"
import type { ReactNode } from "react"

function ScrollArea({
  label,
  className,
  children,
}: {
  label?: string
  className?: string
  children: ReactNode
}) {
  return (
    <ScrollAreaPrimitive className={cn("relative min-h-0", className)}>
      <ScrollAreaViewport
        aria-label={label}
        className="size-full rounded-[inherit] outline-none focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:ring-inset"
      >
        <ScrollAreaContent>{children}</ScrollAreaContent>
      </ScrollAreaViewport>
      <ScrollAreaScrollbar className="flex w-2.5 p-px opacity-0 transition-opacity duration-150 data-visible:opacity-100 motion-reduce:transition-none">
        <ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
      </ScrollAreaScrollbar>
    </ScrollAreaPrimitive>
  )
}

export { ScrollArea }
