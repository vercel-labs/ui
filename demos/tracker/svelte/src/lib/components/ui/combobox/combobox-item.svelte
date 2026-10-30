<script lang="ts">
  import { Check } from "@lucide/svelte"
  import { ComboboxItem, ComboboxItemIndicator } from "@ui-sdk/svelte/combobox"
  import { cn } from "cn"
  import type { ComponentProps, Snippet } from "svelte"

  let {
    class: className,
    children,
    ...rest
  }: ComponentProps<typeof ComboboxItem> & { class?: string; children?: Snippet } =
    $props()
</script>

<ComboboxItem class={cn("relative flex min-h-7 w-full cursor-default items-center gap-2 rounded-xl py-1.5 ps-2 pe-8 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:shrink-0", className)} {...rest}>
  {@render children?.()}
  <ComboboxItemIndicator class="absolute end-2 flex size-4 items-center justify-center">
    <Check aria-hidden="true" class="size-4" />
  </ComboboxItemIndicator>
</ComboboxItem>
