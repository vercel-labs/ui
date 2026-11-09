<script lang="ts">
  import { ComboboxChips } from "@ui-sdk/svelte/combobox"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  let {
    class: className,
    ...rest
  }: ComponentProps<typeof ComboboxChips> & { class?: string } = $props()
</script>

<ComboboxChips
  class={cn(
    "relative flex min-h-8 w-full flex-wrap items-center gap-1 rounded-2xl border border-transparent bg-input/50 bg-clip-padding py-1 ps-1 pe-8 text-sm transition-[color,box-shadow] duration-200 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30 motion-reduce:transition-none",
    className
  )}
  {...rest}
/>
