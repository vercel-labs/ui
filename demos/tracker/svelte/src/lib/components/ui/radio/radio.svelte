<script lang="ts">
  import { Radio, RadioIndicator } from "@ui-sdk/svelte/radio"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  let {
    class: className,
    ...rest
  }: ComponentProps<typeof Radio> & { class?: string } = $props()
</script>

<Radio
  class={cn(
    "relative flex size-4 shrink-0 cursor-default items-center justify-center rounded-full bg-input/90 outline-none transition-shadow after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:ring-3 focus-visible:ring-ring/30 data-checked:bg-primary data-disabled:opacity-50 motion-reduce:transition-none",
    className
  )}
  {...rest}
>
  <RadioIndicator class="size-1.5 rounded-full bg-primary-foreground" />
</Radio>
