import {
  Progress as ProgressPrimitive,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from "@ui-sdk/solid/progress"
import { cn } from "cn"
import type { ComponentProps } from "solid-js"
import type { JSX } from "@solidjs/web"

function Progress(props: {
  value: number
  max?: number
  format?: ComponentProps<typeof ProgressPrimitive>["format"]
  label: JSX.Element
  class?: string
}) {
  return (
    <ProgressPrimitive
      value={props.value}
      max={props.max}
      format={props.format}
      class={cn(
        "flex w-full flex-wrap items-center gap-x-3 gap-y-1.5",
        props.class
      )}
    >
      <ProgressLabel class="text-xs font-medium text-muted-foreground">
        {props.label}
      </ProgressLabel>
      <ProgressValue class="ms-auto text-xs text-muted-foreground tabular-nums" />
      <ProgressTrack class="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <ProgressIndicator class="h-full bg-primary transition-[width] motion-reduce:transition-none" />
      </ProgressTrack>
    </ProgressPrimitive>
  )
}

export { Progress }
