<script lang="ts">
  import { DialogBackdrop } from "@ui-sdk/svelte/dialog"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  interface Props extends ComponentProps<typeof DialogBackdrop> {
    class?: string
  }

  let { class: className, ...rest }: Props = $props()
</script>

<DialogBackdrop
  class={cn(
    "fixed inset-0 bg-black/30 transition-opacity duration-100 supports-backdrop-filter:backdrop-blur-sm data-starting-style:opacity-0 data-ending-style:opacity-0",
    className
  )}
  {...rest}
/>
