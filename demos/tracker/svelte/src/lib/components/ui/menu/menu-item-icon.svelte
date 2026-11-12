<script lang="ts">
  import { MenuItemIcon } from "@ui-sdk/svelte/menu"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  interface Props extends ComponentProps<typeof MenuItemIcon> {
    class?: string
  }

  let { class: className, ...rest }: Props = $props()
</script>

<MenuItemIcon
  class={cn(
    "flex text-muted-foreground group-data-highlighted:text-current",
    className
  )}
  {...rest}
/>
