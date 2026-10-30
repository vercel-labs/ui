<script lang="ts">
  import { Field } from "@ui-sdk/svelte/field"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  let { class: className, ...rest }: ComponentProps<typeof Field> & { class?: string } = $props()
</script>

<Field class={cn("flex min-w-0 flex-col gap-2", className)} {...rest} />
