<script lang="ts">
  import { MenuSubContent } from "@ui-sdk/svelte/menu"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  interface Props extends ComponentProps<typeof MenuSubContent> {
    class?: string
  }

  let { class: className, ...rest }: Props = $props()
</script>

<MenuSubContent
  class={cn(
    "max-h-(--available-height) min-w-44 origin-(--transform-origin) overflow-y-auto rounded-2xl bg-popover p-1 text-sm text-popover-foreground shadow-xl ring-1 ring-foreground/5 outline-none transition-[opacity,scale] duration-100 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 motion-reduce:transition-none dark:ring-foreground/10",
    className
  )}
  {...rest}
/>
