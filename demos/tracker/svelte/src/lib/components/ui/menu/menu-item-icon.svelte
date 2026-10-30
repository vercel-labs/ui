<script lang="ts">
  import { MenuItemIcon } from "@ui-sdk/svelte/menu"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  let { class: className, ...rest }: ComponentProps<typeof MenuItemIcon> & { class?: string } = $props()
</script>

<MenuItemIcon
  class={cn(
    "flex text-muted-foreground group-data-highlighted:text-current",
    className,
  )}
  {...rest}
/>
