"use client"

import {
  ToolbarSeparator as ToolbarSeparatorPrimitive,
  Toolbar as ToolbarPrimitive,
} from "@ui-sdk/react/toolbar"
import { cn } from "cn"
import type { ComponentProps } from "react"

function Toolbar({
  className,
  ...props
}: Omit<ComponentProps<typeof ToolbarPrimitive>, "className"> & { className?: string }) {
  return <ToolbarPrimitive className={cn("flex items-center gap-2", className)} {...props} />
}

function ToolbarSeparator({
  className,
  ...props
}: Omit<ComponentProps<typeof ToolbarSeparatorPrimitive>, "className"> & { className?: string }) {
  return (
    <ToolbarSeparatorPrimitive className={cn("mx-1 h-5 w-px shrink-0 bg-border", className)} {...props} />
  )
}

export { Toolbar, ToolbarSeparator }
export { ToolbarButton } from "@ui-sdk/react/toolbar"
