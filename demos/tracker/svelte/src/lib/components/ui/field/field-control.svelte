<script lang="ts">
  import { FieldControl } from "@ui-sdk/svelte/field"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"
  import { control } from "./styles"

  let { class: className, ...rest }: ComponentProps<typeof FieldControl> & { class?: string } = $props()
</script>

<FieldControl class={cn(control, className)} {...rest} />
