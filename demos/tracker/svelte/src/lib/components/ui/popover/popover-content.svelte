<script lang="ts">
  import { PopoverContent } from "@ui-sdk/svelte/popover"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  interface Props extends ComponentProps<typeof PopoverContent> {
    class?: string
  }

  let { class: className, ...rest }: Props = $props()
</script>

<PopoverContent
  sideOffset={8}
  class={cn(
    "flex w-72 flex-col gap-3 origin-(--transform-origin) rounded-3xl bg-popover p-4 text-sm text-popover-foreground shadow-lg ring-1 ring-foreground/5 outline-none transition-[opacity,scale] duration-100 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 motion-reduce:transition-none dark:ring-foreground/10",
    className
  )}
  {...rest}
/>
