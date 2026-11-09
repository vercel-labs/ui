"use client"

import {
  SliderControl,
  SliderIndicator,
  Slider as SliderPrimitive,
  SliderThumb,
  SliderTrack,
  SliderValue,
} from "@ui-sdk/react/slider"
import { cn } from "cn"
import type { ComponentProps, ReactNode } from "react"

function Slider({
  label,
  className,
  ...props
}: Omit<ComponentProps<typeof SliderPrimitive>, "className" | "children"> & {
  label: ReactNode
  className?: string
}) {
  return (
    <SliderPrimitive
      className={cn("flex flex-col gap-2", className)}
      {...props}
    >
      <div className="flex items-center justify-between text-sm">
        {label}
        <SliderValue className="text-muted-foreground tabular-nums" />
      </div>
      <SliderControl className="flex w-full items-center py-2 select-none data-disabled:opacity-50">
        <SliderTrack className="h-1 w-full rounded-2xl bg-input/90">
          <SliderIndicator className="rounded-2xl bg-primary" />
          <SliderThumb className="block size-4 shrink-0 cursor-default rounded-2xl bg-white shadow-md ring-1 ring-black/10 transition-shadow duration-200 hover:ring-4 hover:ring-ring/30 has-focus-visible:ring-4 has-focus-visible:ring-ring/30 data-dragging:ring-4 data-dragging:ring-ring/30 motion-reduce:transition-none" />
        </SliderTrack>
      </SliderControl>
    </SliderPrimitive>
  )
}

export { Slider }
