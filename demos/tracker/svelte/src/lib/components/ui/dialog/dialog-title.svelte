<script lang="ts">
  import { DialogTitle } from "@ui-sdk/svelte/dialog"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  interface Props extends ComponentProps<typeof DialogTitle> {
    class?: string
  }

  let { class: className, ...rest }: Props = $props()
</script>

<DialogTitle
  class={cn("text-base leading-none font-medium", className)}
  {...rest}
/>
