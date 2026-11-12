<script lang="ts">
  import { RadioGroup } from "@ui-sdk/svelte/radio"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  interface Props extends ComponentProps<typeof RadioGroup> {
    class?: string
  }

  let { class: className, ...rest }: Props = $props()
</script>

<RadioGroup class={cn("flex flex-col gap-3", className)} {...rest} />
