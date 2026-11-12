<script lang="ts">
  import { MenuItem } from "@ui-sdk/svelte/menu"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"
  import { item } from "./styles"

  interface Props extends ComponentProps<typeof MenuItem> {
    variant?: "default" | "destructive"
    class?: string
  }

  let { variant = "default", class: className, ...rest }: Props = $props()
</script>

<MenuItem
  class={cn(
    item,
    variant === "destructive" &&
      "text-destructive data-highlighted:bg-destructive/10 data-highlighted:text-destructive",
    className
  )}
  {...rest}
/>
