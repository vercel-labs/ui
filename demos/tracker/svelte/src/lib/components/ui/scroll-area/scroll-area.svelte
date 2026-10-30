<script lang="ts">
  import {
    ScrollAreaContent,
    ScrollArea as ScrollAreaPrimitive,
    ScrollAreaScrollbar,
    ScrollAreaThumb,
    ScrollAreaViewport,
  } from "@ui-sdk/svelte/scroll-area"
  import { cn } from "cn"
  import type { Snippet } from "svelte"

  let { label, class: className, children }: { label?: string; class?: string; children: Snippet } = $props()
</script>

<ScrollAreaPrimitive class={cn("relative min-h-0", className)}>
  <ScrollAreaViewport
    aria-label={label}
    class="size-full rounded-[inherit] outline-none focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:ring-inset"
  >
    <ScrollAreaContent>{@render children()}</ScrollAreaContent>
  </ScrollAreaViewport>
  <ScrollAreaScrollbar
    class="flex w-2.5 p-px opacity-0 transition-opacity duration-150 data-visible:opacity-100 motion-reduce:transition-none"
  >
    <ScrollAreaThumb class="relative flex-1 rounded-full bg-border" />
  </ScrollAreaScrollbar>
</ScrollAreaPrimitive>
