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
      className={cn("flex w-fit items-center gap-1", className)}
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
        "hit-area inline-flex size-8 items-center justify-center border border-transparent text-muted-foreground outline-none transition-colors select-none hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006bff] data-pressed:border-foreground data-pressed:text-foreground [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  )
}

export { Toggle, ToggleGroup }
