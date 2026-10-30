<script lang="ts">
  import { AvatarFallback, Avatar as AvatarPrimitive } from "@ui-sdk/svelte/avatar"
  import { cn } from "cn"

  const sizes = {
    sm: "size-5 text-[10px]",
    default: "size-7 text-xs",
    lg: "size-10 text-sm",
  }

  let {
    name,
    size = "default",
    decorative = false,
    class: className,
  }: { name: string; size?: keyof typeof sizes; decorative?: boolean; class?: string } = $props()

  const initials = $derived(
    name
      .split(" ")
      .map((part) => part[0])
      .join(""),
  )
</script>

<AvatarPrimitive aria-hidden={decorative || undefined} class={cn("relative flex shrink-0 rounded-full select-none", sizes[size], className)}>
  <AvatarFallback class="flex size-full items-center justify-center rounded-full bg-muted font-medium text-muted-foreground">
    <span aria-hidden="true">{initials}</span>
    {#if !decorative}<span class="sr-only">{name}</span>{/if}
  </AvatarFallback>
</AvatarPrimitive>
