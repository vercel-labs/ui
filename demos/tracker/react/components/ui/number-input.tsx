"use client"

import {
  NumberInputControl,
  NumberInputDecrement,
  NumberInputGroup,
  NumberInputIncrement,
  NumberInput as NumberInputPrimitive,
} from "@ui-sdk/react/number-input"
import { cn } from "cn"
import { Minus, Plus } from "lucide-react"
import type { ComponentProps } from "react"

const step =
  "inline-flex size-6 shrink-0 cursor-default items-center justify-center rounded-xl text-muted-foreground outline-none select-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30 data-disabled:pointer-events-none data-disabled:opacity-50 motion-reduce:transition-none"

function NumberInput({
  className,
  ...props
}: Omit<
  ComponentProps<typeof NumberInputPrimitive>,
  "className" | "children"
> & { className?: string }) {
  return (
    <NumberInputPrimitive {...props}>
      <NumberInputGroup
        className={cn(
          "flex h-8 w-32 items-center gap-0.5 rounded-2xl border border-transparent bg-input/50 px-1 transition-[color,box-shadow] duration-200 has-[input:focus-visible]:border-ring has-[input:focus-visible]:ring-3 has-[input:focus-visible]:ring-ring/30 motion-reduce:transition-none",
          className
        )}
      >
        <NumberInputDecrement aria-label="Decrease" className={step}>
          <Minus aria-hidden="true" className="size-4" />
        </NumberInputDecrement>
        <NumberInputControl className="h-full w-full min-w-0 bg-transparent text-center text-base tabular-nums outline-none md:text-sm" />
        <NumberInputIncrement aria-label="Increase" className={step}>
          <Plus aria-hidden="true" className="size-4" />
        </NumberInputIncrement>
      </NumberInputGroup>
    </NumberInputPrimitive>
  )
}

export { NumberInput }
