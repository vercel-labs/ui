<script lang="ts">
  import { TooltipContent } from "@ui-sdk/svelte/tooltip"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  let { class: className, ...rest }: ComponentProps<typeof TooltipContent> & { class?: string } = $props()
</script>

<TooltipContent
  sideOffset={6}
  class={cn(
    "inline-flex w-fit max-w-xs origin-(--transform-origin) items-center gap-1.5 rounded-xl bg-foreground px-3 py-1.5 text-xs text-background transition-[opacity,scale] duration-100 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 data-instant:transition-none motion-reduce:transition-none",
    className,
  )}
  {...rest}
/>
