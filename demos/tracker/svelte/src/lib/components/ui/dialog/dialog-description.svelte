<script lang="ts">
  import { DialogDescription } from "@ui-sdk/svelte/dialog"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  let { class: className, ...rest }: ComponentProps<typeof DialogDescription> & { class?: string } = $props()
</script>

<DialogDescription class={cn("text-sm text-muted-foreground", className)} {...rest} />
