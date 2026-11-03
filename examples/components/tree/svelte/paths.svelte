<script lang="ts">
  import { ChevronRightIcon, LoaderCircleIcon } from "@lucide/svelte"
  import {
    Tree,
    TreeGroup,
    TreeItem,
    TreeItemIndicator,
    TreeItemLabel,
    treeFromPaths,
    type TreeItemData,
  } from "@ui-sdk/svelte/tree"

  const paths = [
    "src/index.ts",
    "src/lib/format.ts",
    "src/lib/parse.ts",
    "src/routes/home.tsx",
    "src/routes/about.tsx",
    "tests/",
    "package.json",
    "tsconfig.json",
  ]

  const items = treeFromPaths(paths)
  const files = new Set(paths.filter((path) => !path.endsWith("/")))

  let selected: string | null = $state("src/index.ts")
  let opened: string | null = $state(null)

  async function onAction(value: string) {
    if (!files.has(value)) return
    await new Promise((resolve) => setTimeout(resolve, 600))
    opened = value
  }
</script>

{#snippet treeItems(nodes: TreeItemData[])}
  {#each nodes as item (item.value)}
    <TreeItem value={item.value} branch={item.children !== undefined}>
      <TreeItemLabel>
        {#snippet children(state)}
          {#if item.children}
            <TreeItemIndicator>
              <ChevronRightIcon aria-hidden="true" />
            </TreeItemIndicator>
          {:else}
            <span></span>
          {/if}
          <span>{item.label}</span>
          {#if state.pending}
            <LoaderCircleIcon aria-hidden="true" />
          {/if}
        {/snippet}
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
    aria-label="Project"
    {paths}
    defaultExpanded={["src"]}
    bind:value={selected}
    activation="automatic"
    {onAction}
  >
    {@render treeItems(items)}
  </Tree>
  <div data-slot="stack">
    <span data-slot="hint">{selected ?? "Nothing selected"}</span>
    <span>{opened ? `Opened ${opened}` : "Press Enter to open a file."}</span>
  </div>
</div>
