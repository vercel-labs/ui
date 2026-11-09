<script lang="ts">
  import { FieldError } from "@ui-sdk/svelte/field"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  let {
    class: className,
    ...rest
  }: ComponentProps<typeof FieldError> & { class?: string } = $props()
</script>

<FieldError class={cn("text-sm text-destructive", className)} {...rest} />
