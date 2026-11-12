<script lang="ts">
  import { Search } from "@lucide/svelte"
  import { CommandInput } from "@ui-sdk/svelte/command"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  interface Props extends ComponentProps<typeof CommandInput> {
    class?: string
  }

  let { class: className, ...rest }: Props = $props()
</script>

<div class="flex items-center gap-2 border-b border-border px-4">
  <Search aria-hidden="true" class="size-4 shrink-0 text-muted-foreground" />
  <CommandInput
    class={cn(
      "h-12 w-full min-w-0 bg-transparent text-base outline-none placeholder:text-muted-foreground md:text-sm",
      className
    )}
    {...rest}
  />
</div>
