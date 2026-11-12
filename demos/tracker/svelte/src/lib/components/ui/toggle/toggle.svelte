<script lang="ts">
  import { Toggle } from "@ui-sdk/svelte/toggle"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  interface Props extends ComponentProps<typeof Toggle> {
    class?: string
  }

  let { class: className, ...rest }: Props = $props()
</script>

<Toggle
  class={cn(
    "inline-flex h-7 min-w-7 cursor-default items-center justify-center gap-1.5 rounded-[14px] px-1.5 text-sm font-medium text-muted-foreground outline-none select-none transition-[color,background-color,box-shadow] hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30 data-pressed:bg-background data-pressed:text-foreground data-pressed:shadow-xs motion-reduce:transition-none dark:data-pressed:bg-input/50 [&_svg]:size-4",
    className
  )}
  {...rest}
/>
