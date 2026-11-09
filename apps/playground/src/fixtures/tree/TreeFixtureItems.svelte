<script lang="ts">
  import {
    TreeGroup,
    TreeItem,
    TreeItemCheckbox,
    TreeItemIndicator,
    TreeItemLabel,
  } from "@ui-sdk/svelte"
  import type { TreeFixtureItem } from "tests/fixtures/tree.ts"
  import Self from "./TreeFixtureItems.svelte"

  let { items, checkable }: { items: TreeFixtureItem[]; checkable: boolean } =
    $props()
</script>

{#each items as item (item.value)}
  {#snippet link({ props }: { props: Record<string, unknown> })}
    <a {...props} href={item.href}>{item.label}</a>
  {/snippet}
  <TreeItem class="tree-item" value={item.value} disabled={item.disabled}>
    {#if item.children}<TreeItemIndicator class="tree-indicator"
        >▸</TreeItemIndicator
      >{/if}
    {#if checkable}<TreeItemCheckbox class="tree-checkbox" />{/if}
    <TreeItemLabel class="tree-label" render={item.href ? link : undefined}
      >{item.label}</TreeItemLabel
    >
    {#if item.children}
      <TreeGroup class="tree-group">
        <Self items={item.children} {checkable} />
      </TreeGroup>
    {/if}
  </TreeItem>
{/each}
