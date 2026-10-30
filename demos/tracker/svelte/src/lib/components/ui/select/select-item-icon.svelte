<script lang="ts">
  import { SelectItemIcon } from "@ui-sdk/svelte/select"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  let { class: className, ...rest }: ComponentProps<typeof SelectItemIcon> & { class?: string } = $props()
</script>

<SelectItemIcon
  class={cn(
    "flex text-muted-foreground group-data-highlighted:text-current",
    className,
  )}
  {...rest}
/>
