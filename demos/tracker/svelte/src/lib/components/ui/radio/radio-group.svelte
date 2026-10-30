<script lang="ts">
  import { RadioGroup } from "@ui-sdk/svelte/radio"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  let { class: className, ...rest }: ComponentProps<typeof RadioGroup> & { class?: string } = $props()
</script>

<RadioGroup class={cn("flex flex-col gap-3", className)} {...rest} />
