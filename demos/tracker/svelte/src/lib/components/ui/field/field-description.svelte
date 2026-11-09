<script lang="ts">
  import { FieldDescription } from "@ui-sdk/svelte/field"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  let {
    class: className,
    ...rest
  }: ComponentProps<typeof FieldDescription> & { class?: string } = $props()
</script>

<FieldDescription
  class={cn("text-sm text-muted-foreground", className)}
  {...rest}
/>
