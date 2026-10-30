<script lang="ts">
  import { DialogBackdrop } from "@ui-sdk/svelte/dialog"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  let { class: className, ...rest }: ComponentProps<typeof DialogBackdrop> & { class?: string } = $props()
</script>

<DialogBackdrop
  class={cn(
    "fixed inset-0 bg-black/30 transition-opacity duration-100 supports-backdrop-filter:backdrop-blur-sm data-starting-style:opacity-0 data-ending-style:opacity-0",
    className,
  )}
  {...rest}
/>
