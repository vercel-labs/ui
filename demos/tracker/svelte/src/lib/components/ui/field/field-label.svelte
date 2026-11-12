<script lang="ts">
  import { FieldLabel } from "@ui-sdk/svelte/field"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  interface Props extends ComponentProps<typeof FieldLabel> {
    class?: string
  }

  let { class: className, ...rest }: Props = $props()
</script>

<FieldLabel
  class={cn(
    "text-sm leading-none font-medium data-disabled:opacity-50",
    className
  )}
  {...rest}
/>
