<script lang="ts">
  import { TabsTab } from "@ui-sdk/svelte/tabs"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  let {
    class: className,
    ...rest
  }: ComponentProps<typeof TabsTab> & { class?: string } = $props()
</script>

<TabsTab
  class={cn(
    "relative z-10 inline-flex h-6.5 cursor-default items-center justify-center gap-1.5 rounded-2xl px-2.5 text-sm font-medium whitespace-nowrap text-foreground/60 outline-none transition-[color,box-shadow] hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30 data-selected:text-foreground",
    className
  )}
  {...rest}
/>
