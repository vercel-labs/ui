<script lang="ts">
  import { MenuSeparator } from "@ui-sdk/svelte/menu"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  interface Props extends ComponentProps<typeof MenuSeparator> {
    class?: string
  }

  let { class: className, ...rest }: Props = $props()
</script>

<MenuSeparator
  class={cn("-mx-1 my-1 h-px bg-border/50", className)}
  {...rest}
/>
