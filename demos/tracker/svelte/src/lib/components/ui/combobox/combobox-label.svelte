<script lang="ts">
  import { ComboboxLabel } from "@ui-sdk/svelte/combobox"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  interface Props extends ComponentProps<typeof ComboboxLabel> {
    class?: string
  }

  let { class: className, ...rest }: Props = $props()
</script>

<ComboboxLabel
  class={cn("text-sm leading-none font-medium", className)}
  {...rest}
/>
