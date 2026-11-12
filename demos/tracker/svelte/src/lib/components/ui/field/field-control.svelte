<script lang="ts">
  import { FieldControl } from "@ui-sdk/svelte/field"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"
  import { control } from "./styles"

  interface Props extends ComponentProps<typeof FieldControl> {
    class?: string
  }

  let { class: className, ...rest }: Props = $props()
</script>

<FieldControl class={cn(control, className)} {...rest} />
