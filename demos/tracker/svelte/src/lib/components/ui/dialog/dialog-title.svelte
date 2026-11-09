<script lang="ts">
  import { DialogTitle } from "@ui-sdk/svelte/dialog"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  let {
    class: className,
    ...rest
  }: ComponentProps<typeof DialogTitle> & { class?: string } = $props()
</script>

<DialogTitle
  class={cn("text-base leading-none font-medium", className)}
  {...rest}
/>
