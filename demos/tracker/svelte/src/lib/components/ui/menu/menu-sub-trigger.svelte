<script lang="ts">
  import { ChevronRight } from "@lucide/svelte"
  import { MenuSubTrigger } from "@ui-sdk/svelte/menu"
  import { cn } from "cn"
  import type { ComponentProps, Snippet } from "svelte"
  import { item } from "./styles"

  let {
    class: className,
    children,
    ...rest
  }: ComponentProps<typeof MenuSubTrigger> & {
    class?: string
    children?: Snippet
  } = $props()
</script>

<MenuSubTrigger class={cn(item, "data-open:bg-accent", className)} {...rest}>
  {@render children?.()}
  <ChevronRight
    aria-hidden="true"
    class="ms-auto text-muted-foreground rtl:rotate-180"
  />
</MenuSubTrigger>
