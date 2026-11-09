"use client"

import {
  Checkbox as CheckboxPrimitive,
  CheckboxIndicator,
} from "@ui-sdk/react/checkbox"
import { cn } from "cn"
import { Check, Minus } from "lucide-react"
import type { ComponentProps } from "react"

function Checkbox({
  className,
  ...props
}: Omit<ComponentProps<typeof CheckboxPrimitive>, "className" | "children"> & {
  className?: string
}) {
  return (
    <CheckboxPrimitive
      className={cn(
        "relative flex size-4 shrink-0 cursor-default items-center justify-center rounded-[5px] bg-input/90 text-primary-foreground outline-none transition-shadow after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:ring-3 focus-visible:ring-ring/30 data-checked:bg-primary data-indeterminate:bg-primary data-disabled:opacity-50 motion-reduce:transition-none",
        className
      )}
      {...props}
    >
      <CheckboxIndicator className="group grid place-content-center">
        <Check
          aria-hidden="true"
          className="size-3.5 group-data-indeterminate:hidden"
        />
        <Minus
          aria-hidden="true"
          className="hidden size-3.5 group-data-indeterminate:block"
        />
      </CheckboxIndicator>
    </CheckboxPrimitive>
  )
}

export { Checkbox }
export { CheckboxGroup } from "@ui-sdk/react/checkbox"
