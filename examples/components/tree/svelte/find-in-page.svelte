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
      value: "planets",
      label: "Planets",
      children: [
        { value: "mercury", label: "Mercury" },
        { value: "venus", label: "Venus" },
        { value: "earth", label: "Earth", children: [{ value: "moon", label: "The Moon" }] },
        {
          value: "mars",
          label: "Mars",
          children: [
            { value: "phobos", label: "Phobos" },
            { value: "deimos", label: "Deimos" },
          ],
        },
      ],
    },
    {
      value: "dwarf-planets",
      label: "Dwarf planets",
      children: [
        { value: "ceres", label: "Ceres" },
        { value: "pluto", label: "Pluto", children: [{ value: "charon", label: "Charon" }] },
      ],
    },
  ]
</script>

{#snippet treeItems(nodes: TreeItemData[])}
  {#each nodes as item (item.value)}
    <TreeItem value={item.value} branch={item.children !== undefined}>
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

<Tree aria-label="Solar system" {items} hiddenUntilFound>
  {@render treeItems(items)}
</Tree>
