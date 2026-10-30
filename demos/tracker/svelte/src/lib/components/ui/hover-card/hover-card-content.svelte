<script lang="ts">
  import { HoverCardContent } from "@ui-sdk/svelte/hover-card"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  let { class: className, ...rest }: ComponentProps<typeof HoverCardContent> & { class?: string } = $props()
</script>

<HoverCardContent
  sideOffset={8}
  class={cn(
    "flex w-64 flex-col gap-3 origin-(--transform-origin) rounded-3xl bg-popover p-4 text-sm text-popover-foreground shadow-lg ring-1 ring-foreground/5 outline-none transition-[opacity,scale] duration-100 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 motion-reduce:transition-none dark:ring-foreground/10",
    className,
  )}
  {...rest}
/>
