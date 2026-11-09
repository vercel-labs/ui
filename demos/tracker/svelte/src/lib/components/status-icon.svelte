<script lang="ts" module>
  import {
    Circle,
    CircleCheck,
    CircleDashed,
    CircleDotDashed,
    CircleX,
  } from "@lucide/svelte"

  const icons = {
    backlog: CircleDashed,
    todo: Circle,
    "in-progress": CircleDotDashed,
    done: CircleCheck,
    canceled: CircleX,
  }
</script>

<script lang="ts">
  import { cn } from "cn"
  import { statusOf, type Status } from "tracker-data"

  let {
    status,
    label = false,
    class: className,
  }: { status: Status; label?: boolean; class?: string } = $props()

  const Icon = $derived(icons[status])
</script>

<Icon
  {...label
    ? { role: "img", "aria-label": statusOf(status).label }
    : { "aria-hidden": true }}
  class={cn(
    "size-4 shrink-0 text-muted-foreground",
    status === "in-progress" && "text-amber-500",
    status === "done" && "text-emerald-600 dark:text-emerald-400",
    className
  )}
/>
