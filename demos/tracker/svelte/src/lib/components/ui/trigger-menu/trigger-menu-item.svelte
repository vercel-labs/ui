<script lang="ts">
  import { TriggerMenuItem } from "@ui-sdk/svelte/trigger-menu"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  interface Props extends ComponentProps<typeof TriggerMenuItem> {
    class?: string
  }

  let { class: className, ...rest }: Props = $props()
</script>

<TriggerMenuItem
  class={cn(
    "flex min-h-7 cursor-default items-center gap-2 rounded-xl px-2 py-1.5 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
    className
  )}
  {...rest}
/>
