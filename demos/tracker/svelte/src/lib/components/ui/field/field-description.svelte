<script lang="ts">
  import { FieldDescription } from "@ui-sdk/svelte/field"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  interface Props extends ComponentProps<typeof FieldDescription> {
    class?: string
  }

  let { class: className, ...rest }: Props = $props()
</script>

<FieldDescription
  class={cn("text-sm text-muted-foreground", className)}
  {...rest}
/>
