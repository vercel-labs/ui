<script lang="ts">
  import { ChevronRightIcon, FileIcon, FolderIcon } from "@lucide/svelte"
  import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@ui-sdk/svelte/collapsible"
  import Self from "./file-tree.svelte"

  type TreeNode = { name: string; children?: TreeNode[] }

  let { nodes }: { nodes?: TreeNode[] } = $props()

  const fileTree: TreeNode[] = [
    {
      name: "components",
      children: [
        { name: "ui", children: [{ name: "button.tsx" }, { name: "card.tsx" }, { name: "dialog.tsx" }] },
        { name: "header.tsx" },
        { name: "footer.tsx" },
      ],
    },
    { name: "lib", children: [{ name: "utils.ts" }] },
    { name: "hooks", children: [{ name: "use-media-query.ts" }, { name: "use-mobile.ts" }] },
    { name: "types", children: [{ name: "index.d.ts" }] },
    { name: "public", children: [{ name: "favicon.ico" }, { name: "logo.svg" }] },
    { name: "app.tsx" },
    { name: "layout.tsx" },
    { name: "globals.css" },
    { name: "package.json" },
    { name: "tsconfig.json" },
    { name: "README.md" },
    { name: ".gitignore" },
  ]
</script>

{#if !nodes}
  <div>
    <Self nodes={fileTree} />
  </div>
{:else}
  <ul>
    {#each nodes as node (node.name)}
      <li>
        {#if node.children}
          <Collapsible defaultOpen={node.name === "components"}>
            <CollapsibleTrigger data-variant="ghost">
              <ChevronRightIcon />
              <FolderIcon />
              <span>{node.name}</span>
            </CollapsibleTrigger>
            <CollapsiblePanel>
              <Self nodes={node.children} />
            </CollapsiblePanel>
          </Collapsible>
        {:else}
          <span data-slot="row">
            <FileIcon />
            {node.name}
          </span>
        {/if}
      </li>
    {/each}
  </ul>
{/if}
