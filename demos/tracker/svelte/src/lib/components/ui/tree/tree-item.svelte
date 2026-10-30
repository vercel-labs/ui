<script lang="ts">
  import { TreeItemCheckbox, TreeItemLabel, TreeItem as TreeItemPrimitive } from "@ui-sdk/svelte/tree"
  import { cn } from "cn"
  import type { Snippet } from "svelte"
  import TreeGroup from "./tree-group.svelte"

  let {
    value,
    label,
    class: className,
    children,
  }: { value: string; label: string; class?: string; children?: Snippet } = $props()
</script>

<TreeItemPrimitive {value} branch={children !== undefined} class={cn("flex flex-wrap items-center outline-none", className)}>
  <TreeItemCheckbox
    class="relative ms-2 flex size-4 shrink-0 cursor-default items-center justify-center rounded-[5px] bg-input/90 after:text-[10px] after:leading-none after:text-primary-foreground data-checked:bg-primary data-checked:after:content-['✓'] data-indeterminate:bg-primary data-indeterminate:after:content-['–']"
  />
  <TreeItemLabel
    class="flex h-7 min-w-0 flex-1 cursor-default items-center rounded-xl px-2 text-sm select-none hover:bg-muted [[data-checked]>&]:text-muted-foreground [[data-checked]>&]:line-through [:focus-visible>&]:ring-3 [:focus-visible>&]:ring-ring/30 [:focus-visible>&]:ring-inset"
  >
    {label}
  </TreeItemLabel>
  {#if children}
    <TreeGroup>{@render children()}</TreeGroup>
  {/if}
</TreeItemPrimitive>
