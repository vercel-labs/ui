<script lang="ts">
  import { Check } from "@lucide/svelte"
  import { SelectItem, SelectItemIndicator } from "@ui-sdk/svelte/select"
  import { cn } from "cn"
  import type { ComponentProps, Snippet } from "svelte"

  interface Props extends ComponentProps<typeof SelectItem> {
    class?: string
    children?: Snippet
  }

  let { class: className, children, ...rest }: Props = $props()
</script>

<SelectItem
  class={cn(
    "group relative flex min-h-7 w-full cursor-default items-center gap-2 rounded-xl py-1.5 ps-2 pe-8 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:shrink-0 [&_svg]:size-4",
    className
  )}
  {...rest}
>
  {@render children?.()}
  <SelectItemIndicator
    class="absolute end-2 flex size-4 items-center justify-center"
  >
    <Check aria-hidden="true" />
  </SelectItemIndicator>
</SelectItem>
