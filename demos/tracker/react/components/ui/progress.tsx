"use client"

import {
  Progress as ProgressPrimitive,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from "@ui-sdk/react/progress"
import { cn } from "cn"
import type { ComponentProps, ReactNode } from "react"

function Progress({
  value,
  max,
  format,
  label,
  className,
}: {
  value: number
  max?: number
  format?: ComponentProps<typeof ProgressPrimitive>["format"]
  label: ReactNode
  className?: string
}) {
  return (
    <ProgressPrimitive
      value={value}
      max={max}
      format={format}
      className={cn(
        "flex w-full flex-wrap items-center gap-x-3 gap-y-1.5",
        className
      )}
    >
      <ProgressLabel className="text-xs font-medium text-muted-foreground">
        {label}
      </ProgressLabel>
      <ProgressValue className="ms-auto text-xs text-muted-foreground tabular-nums" />
      <ProgressTrack className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <ProgressIndicator className="h-full bg-primary transition-[width] motion-reduce:transition-none" />
      </ProgressTrack>
    </ProgressPrimitive>
  )
}

export { Progress }
