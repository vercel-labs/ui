<script lang="ts">
  import { SelectItemIcon } from "@ui-sdk/svelte/select"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  interface Props extends ComponentProps<typeof SelectItemIcon> {
    class?: string
  }

  let { class: className, ...rest }: Props = $props()
</script>

<SelectItemIcon
  class={cn(
    "flex text-muted-foreground group-data-highlighted:text-current",
    className
  )}
  {...rest}
/>
