"use client"

import { cn } from "cn"
import { TooltipContent as TooltipContentPrimitive } from "@ui-sdk/react/tooltip"
import type { ComponentProps } from "react"

function TooltipContent({
  className,
  ...props
}: Omit<ComponentProps<typeof TooltipContentPrimitive>, "className"> & {
  className?: string
}) {
  return (
    <TooltipContentPrimitive
      sideOffset={6}
      className={cn(
        "inline-flex origin-(--transform-origin) items-center gap-1.5 rounded-xl bg-foreground px-2.5 py-1 text-xs text-background transition-[opacity,scale] duration-100 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 data-instant:transition-none",
        className
      )}
      {...props}
    />
  )
}

export { TooltipContent }
export { Tooltip, TooltipTrigger } from "@ui-sdk/react/tooltip"
