"use client"

import { HoverCardContent as HoverCardContentPrimitive } from "@ui-sdk/react/hover-card"
import { cn } from "cn"
import type { ComponentProps } from "react"
import { popup } from "./popover"

function HoverCardContent({
  className,
  ...props
}: Omit<ComponentProps<typeof HoverCardContentPrimitive>, "className"> & {
  className?: string
}) {
  return (
    <HoverCardContentPrimitive
      sideOffset={8}
      className={cn("flex w-64 flex-col gap-3", popup, className)}
      {...props}
    />
  )
}

export { HoverCardContent }
export { HoverCard, HoverCardTrigger } from "@ui-sdk/react/hover-card"
