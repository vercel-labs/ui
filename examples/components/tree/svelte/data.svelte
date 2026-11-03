<script lang="ts">
  import {
    Tree,
    TreeGroup,
    TreeItem,
    TreeItemIndicator,
    TreeItemLabel,
    type TreeItemData,
  } from "@ui-sdk/svelte/tree"

  const items: TreeItemData[] = [
    {
      value: "fruit",
      label: "Fruit",
      children: [
        { value: "apple", label: "Apple" },
        { value: "banana", label: "Banana" },
        {
          value: "citrus",
          label: "Citrus",
          children: [
            { value: "lemon", label: "Lemon" },
            { value: "orange", label: "Orange" },
          ],
        },
      ],
    },
    {
      value: "vegetables",
      label: "Vegetables",
      children: [
        { value: "carrot", label: "Carrot" },
        { value: "kale", label: "Kale", disabled: true },
      ],
    },
    { value: "bread", label: "Bread" },
  ]
</script>

{#snippet treeItems(nodes: TreeItemData[])}
  {#each nodes as item (item.value)}
    <TreeItem value={item.value} branch={item.children !== undefined} disabled={item.disabled}>
      {#if item.children}
        <TreeItemIndicator />
      {/if}
      <TreeItemLabel>
        {item.label}
      </TreeItemLabel>
      {#if item.children}
        <TreeGroup>
          {@render treeItems(item.children)}
        </TreeGroup>
      {/if}
    </TreeItem>
  {/each}
{/snippet}

<Tree aria-label="Groceries" {items} defaultExpanded={["fruit"]}>
  {@render treeItems(items)}
</Tree>
