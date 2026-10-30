<script lang="ts">
  import { CommandItem } from "@ui-sdk/svelte/command"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  let { class: className, ...rest }: ComponentProps<typeof CommandItem> & { class?: string } = $props()
</script>

<CommandItem
  class={cn(
    "group flex min-h-8 cursor-default items-center gap-2 rounded-xl px-2 py-1.5 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
    className,
  )}
  {...rest}
/>
