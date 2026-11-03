<script lang="ts">
  import {
    Tree,
    TreeGroup,
    TreeItem,
    TreeItemCheckbox,
    TreeItemLabel,
    type TreeItemData,
  } from "@ui-sdk/svelte/tree"

  const items: TreeItemData[] = [
    {
      value: "frontend",
      label: "Frontend",
      children: [
        { value: "react", label: "React" },
        { value: "vue", label: "Vue" },
        { value: "svelte", label: "Svelte" },
      ],
    },
    {
      value: "backend",
      label: "Backend",
      children: [
        { value: "node", label: "Node" },
        {
          value: "databases",
          label: "Databases",
          children: [
            { value: "postgres", label: "Postgres" },
            { value: "sqlite", label: "SQLite" },
          ],
        },
      ],
    },
  ]

  const initial = ["react", "postgres"]

  let checked = $state(initial)
</script>

{#snippet treeItems(nodes: TreeItemData[])}
  {#each nodes as item (item.value)}
    <TreeItem value={item.value} branch={item.children !== undefined}>
      <TreeItemCheckbox />
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

<div data-slot="stack">
  <Tree
    aria-label="Stack"
    {items}
    checkable
    mode="none"
    checkStrategy="trunk"
    defaultChecked={initial}
    onCheckedChange={(next) => (checked = next)}
    defaultExpanded={["frontend", "backend", "databases"]}
  >
    {@render treeItems(items)}
  </Tree>
  <p data-slot="hint">Checked: {checked.join(", ") || "nothing"}</p>
</div>
