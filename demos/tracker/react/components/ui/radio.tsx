"use client"

import {
  Radio as RadioPrimitive,
  RadioGroup as RadioGroupPrimitive,
  RadioIndicator,
} from "@ui-sdk/react/radio"
import { cn } from "cn"
import type { ComponentProps } from "react"

function RadioGroup({
  className,
  ...props
}: Omit<ComponentProps<typeof RadioGroupPrimitive>, "className"> & {
  className?: string
}) {
  return (
    <RadioGroupPrimitive
      className={cn("flex flex-col gap-3", className)}
      {...props}
    />
  )
}

function Radio({
  className,
  ...props
}: Omit<ComponentProps<typeof RadioPrimitive>, "className" | "children"> & {
  className?: string
}) {
  return (
    <RadioPrimitive
      className={cn(
        "relative flex size-4 shrink-0 cursor-default items-center justify-center rounded-full bg-input/90 outline-none transition-shadow after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:ring-3 focus-visible:ring-ring/30 data-checked:bg-primary data-disabled:opacity-50 motion-reduce:transition-none",
        className
      )}
      {...props}
    >
      <RadioIndicator className="size-1.5 rounded-full bg-primary-foreground" />
    </RadioPrimitive>
  )
}

export { Radio, RadioGroup }
