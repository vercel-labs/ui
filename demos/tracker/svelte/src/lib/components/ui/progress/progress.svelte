<script lang="ts">
  import {
    ProgressIndicator,
    ProgressLabel,
    Progress as ProgressPrimitive,
    ProgressTrack,
    ProgressValue,
  } from "@ui-sdk/svelte/progress"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  let {
    value,
    max,
    format,
    label,
    class: className,
  }: {
    value: number
    max?: number
    format?: ComponentProps<typeof ProgressPrimitive>["format"]
    label: string
    class?: string
  } = $props()
</script>

<ProgressPrimitive {value} {max} {format} class={cn("flex w-full flex-wrap items-center gap-x-3 gap-y-1.5", className)}>
  <ProgressLabel class="text-xs font-medium text-muted-foreground">{label}</ProgressLabel>
  <ProgressValue class="ms-auto text-xs text-muted-foreground tabular-nums" />
  <ProgressTrack class="h-1.5 w-full overflow-hidden rounded-full bg-muted">
    <ProgressIndicator class="h-full bg-primary transition-[width] motion-reduce:transition-none" />
  </ProgressTrack>
</ProgressPrimitive>
