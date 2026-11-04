"use client"

import { cn } from "cn"
import { Toggle as TogglePrimitive, ToggleGroup as ToggleGroupPrimitive } from "@ui-sdk/react/toggle"
import type { ComponentProps } from "react"

function ToggleGroup({
  className,
  ...props
}: Omit<ComponentProps<typeof ToggleGroupPrimitive>, "className"> & { className?: string }) {
  return (
    <ToggleGroupPrimitive
      className={cn("flex w-fit items-center gap-0.5 rounded-2xl bg-foreground/5 p-0.5", className)}
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
        "hit-area inline-flex size-7 items-center justify-center rounded-[14px] text-subtle outline-none transition-[color,background-color,box-shadow] select-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30 data-pressed:bg-background data-pressed:text-foreground data-pressed:shadow-xs dark:data-pressed:bg-foreground/10 [&_svg:not([class*='size-'])]:size-3.5",
        className,
      )}
      {...props}
    />
  )
}

export { Toggle, ToggleGroup }
