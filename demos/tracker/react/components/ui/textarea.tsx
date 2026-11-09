"use client"

import { Textarea as TextareaPrimitive } from "@ui-sdk/react/textarea"
import { cn } from "cn"
import type { ComponentProps } from "react"
import { control } from "./field"

function Textarea({
  className,
  ...props
}: Omit<ComponentProps<typeof TextareaPrimitive>, "className"> & {
  className?: string
}) {
  return (
    <TextareaPrimitive
      className={cn(control, "h-auto min-h-20 resize-none py-2", className)}
      {...props}
    />
  )
}

export { Textarea }
