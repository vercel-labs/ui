<script lang="ts">
  import { ComboboxInput } from "@ui-sdk/svelte/combobox"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  interface Props extends ComponentProps<typeof ComboboxInput> {
    class?: string
  }

  let { class: className, ...rest }: Props = $props()
</script>

<ComboboxInput
  class={cn(
    "h-6 min-w-8 flex-1 bg-transparent px-1.5 text-base outline-none placeholder:text-muted-foreground md:text-sm",
    className
  )}
  {...rest}
/>
