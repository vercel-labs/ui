"use client"

import { Toggle as TogglePrimitive, ToggleGroup as ToggleGroupPrimitive } from "@ui-sdk/react/toggle"
import { cn } from "cn"
import type { ComponentProps } from "react"

function ToggleGroup({
  className,
  ...props
}: Omit<ComponentProps<typeof ToggleGroupPrimitive>, "className"> & { className?: string }) {
  return (
    <ToggleGroupPrimitive
      className={cn("flex w-fit items-center gap-0.5 rounded-2xl bg-muted p-0.5", className)}
      {...props}
    />
  )
}

function Toggle({
  className,
  ...props
}: Omit<ComponentProps<typeof TogglePrimitive>, "className"> & { className?: string }) {
  return (
    <TogglePrimitive
      className={cn(
        "inline-flex h-7 min-w-7 cursor-default items-center justify-center gap-1.5 rounded-[14px] px-1.5 text-sm font-medium text-muted-foreground outline-none select-none transition-[color,background-color,box-shadow] hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30 data-pressed:bg-background data-pressed:text-foreground data-pressed:shadow-xs motion-reduce:transition-none dark:data-pressed:bg-input/50 [&_svg]:size-4",
        className,
      )}
      {...props}
    />
  )
}

export { Toggle, ToggleGroup }
