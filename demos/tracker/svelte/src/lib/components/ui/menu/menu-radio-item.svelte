<script lang="ts">
  import { Check } from "@lucide/svelte"
  import { MenuItemIndicator, MenuRadioItem } from "@ui-sdk/svelte/menu"
  import { cn } from "cn"
  import type { ComponentProps, Snippet } from "svelte"
  import { item } from "./styles"

  interface Props extends ComponentProps<typeof MenuRadioItem> {
    class?: string
    children?: Snippet
  }

  let { class: className, children, ...rest }: Props = $props()
</script>

<MenuRadioItem class={cn(item, "pe-8", className)} {...rest}>
  {@render children?.()}
  <MenuItemIndicator
    class="absolute end-2 flex size-4 items-center justify-center"
  >
    <Check class="size-4" />
  </MenuItemIndicator>
</MenuRadioItem>
