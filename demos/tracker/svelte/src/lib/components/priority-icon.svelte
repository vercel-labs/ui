<script lang="ts" module>
  import {
    CircleAlert,
    Minus,
    SignalHigh,
    SignalLow,
    SignalMedium,
  } from "@lucide/svelte"

  const icons = {
    urgent: CircleAlert,
    high: SignalHigh,
    medium: SignalMedium,
    low: SignalLow,
    none: Minus,
  }
</script>

<script lang="ts">
  import { cn } from "cn"
  import { priorityOf, type Priority } from "tracker-data"

  interface Props {
    priority: Priority
    label?: boolean
    class?: string
  }

  let { priority, label = false, class: className }: Props = $props()

  const Icon = $derived(icons[priority])
</script>

<Icon
  {...label
    ? { role: "img", "aria-label": priorityOf(priority).label }
    : { "aria-hidden": true }}
  class={cn(
    "size-4 shrink-0 text-muted-foreground",
    priority === "urgent" && "text-destructive",
    className
  )}
/>
