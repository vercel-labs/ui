<script lang="ts">
  import { FieldError } from "@ui-sdk/svelte/field"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  interface Props extends ComponentProps<typeof FieldError> {
    class?: string
  }

  let { class: className, ...rest }: Props = $props()
</script>

<FieldError class={cn("text-sm text-destructive", className)} {...rest} />
