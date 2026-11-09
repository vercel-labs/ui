<script lang="ts">
  import { ChevronDown } from "@lucide/svelte"
  import { ComboboxTrigger } from "@ui-sdk/svelte/combobox"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  let {
    class: className,
    ...rest
  }: ComponentProps<typeof ComboboxTrigger> & { class?: string } = $props()
</script>

<ComboboxTrigger
  class={cn(
    "group absolute end-1 top-1 inline-flex size-6 cursor-default items-center justify-center rounded-xl text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30 data-open:bg-muted motion-reduce:transition-none",
    className
  )}
  {...rest}
>
  <ChevronDown
    aria-hidden="true"
    class="size-4 transition-transform group-data-open:rotate-180"
  />
</ComboboxTrigger>
