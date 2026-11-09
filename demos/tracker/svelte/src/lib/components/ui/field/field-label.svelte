<script lang="ts">
  import { FieldLabel } from "@ui-sdk/svelte/field"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  let {
    class: className,
    ...rest
  }: ComponentProps<typeof FieldLabel> & { class?: string } = $props()
</script>

<FieldLabel
  class={cn(
    "text-sm leading-none font-medium data-disabled:opacity-50",
    className
  )}
  {...rest}
/>
