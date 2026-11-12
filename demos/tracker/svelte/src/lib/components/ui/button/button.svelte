<script lang="ts">
  import { Button } from "@ui-sdk/svelte/button"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"
  import { buttonVariants, type ButtonVariants } from "./variants"

  interface Props extends ComponentProps<typeof Button>, ButtonVariants {
    class?: string
  }

  let { variant, size, class: className, ...rest }: Props = $props()
</script>

<Button class={cn(buttonVariants({ variant, size }), className)} {...rest} />
