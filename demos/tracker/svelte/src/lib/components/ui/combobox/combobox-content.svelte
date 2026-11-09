<script lang="ts">
  import { ComboboxContent } from "@ui-sdk/svelte/combobox"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  let {
    class: className,
    ...rest
  }: ComponentProps<typeof ComboboxContent> & { class?: string } = $props()
</script>

<ComboboxContent
  class={cn(
    "w-(--anchor-width) min-w-44 max-h-[min(18rem,var(--available-height))] origin-(--transform-origin) scroll-py-1 overflow-x-hidden overflow-y-auto rounded-2xl bg-popover p-1 text-sm text-popover-foreground shadow-lg ring-1 ring-foreground/5 outline-none transition-[opacity,scale] duration-100 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 motion-reduce:transition-none dark:ring-foreground/10",
    className
  )}
  {...rest}
/>
