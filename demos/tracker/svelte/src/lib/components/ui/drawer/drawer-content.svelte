<script lang="ts">
  import { DrawerBackdrop, DrawerContent } from "@ui-sdk/svelte/drawer"
  import { cn } from "cn"
  import type { ComponentProps, Snippet } from "svelte"

  interface Props extends ComponentProps<typeof DrawerContent> {
    class?: string
    children?: Snippet
  }

  let { class: className, children, ...rest }: Props = $props()
</script>

<DrawerBackdrop
  class="fixed inset-0 bg-black/30 supports-backdrop-filter:backdrop-blur-sm"
/>
<DrawerContent
  class={cn(
    "relative mx-auto flex max-h-[85dvh] w-full max-w-lg flex-col rounded-t-[min(var(--radius-4xl),24px)] bg-popover text-sm text-popover-foreground shadow-xl ring-1 ring-foreground/5 outline-none after:absolute after:inset-x-0 after:top-full after:h-24 after:bg-inherit dark:ring-foreground/10",
    className
  )}
  {...rest}
>
  <div
    aria-hidden="true"
    class="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-muted"
  ></div>
  {@render children?.()}
</DrawerContent>
