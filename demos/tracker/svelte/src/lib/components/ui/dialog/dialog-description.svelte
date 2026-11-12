<script lang="ts">
  import { DialogDescription } from "@ui-sdk/svelte/dialog"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  interface Props extends ComponentProps<typeof DialogDescription> {
    class?: string
  }

  let { class: className, ...rest }: Props = $props()
</script>

<DialogDescription
  class={cn("text-sm text-muted-foreground", className)}
  {...rest}
/>
