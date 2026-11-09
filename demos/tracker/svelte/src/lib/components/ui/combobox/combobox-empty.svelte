<script lang="ts">
  import { ComboboxEmpty } from "@ui-sdk/svelte/combobox"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  let {
    class: className,
    ...rest
  }: ComponentProps<typeof ComboboxEmpty> & { class?: string } = $props()
</script>

<ComboboxEmpty
  class={cn(
    "py-2 text-center text-sm text-muted-foreground empty:hidden",
    className
  )}
  {...rest}
/>
