<script lang="ts">
  import { ChevronRightIcon } from "@lucide/svelte"
  import {
    createTreeController,
    Tree,
    TreeGroup,
    TreeItem,
    TreeItemIndicator,
    TreeItemLabel,
  } from "@ui-sdk/svelte/tree"

  type Node = { value: string; label: string; children?: Node[] }

  const sections: Node[] = [
    {
      value: "account",
      label: "Account",
      children: [
        { value: "profile", label: "Profile" },
        {
          value: "security",
          label: "Security",
          children: [
            { value: "password", label: "Password" },
            { value: "two-factor", label: "Two-factor authentication" },
          ],
        },
      ],
    },
    {
      value: "workspace",
      label: "Workspace",
      children: [
        { value: "members", label: "Members" },
        { value: "billing", label: "Billing" },
      ],
    },
  ]

  const settings = createTreeController()

  const button =
    "h-8 rounded-xl border border-input bg-background px-3 text-sm outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30"

  let expanded: string[] = $state([])
</script>

{#snippet items(nodes: Node[])}
  {#each nodes as item (item.value)}
    <TreeItem value={item.value} branch={item.children !== undefined}>
      <TreeItemLabel>
        {#if item.children}
          <TreeItemIndicator>
            <ChevronRightIcon aria-hidden="true" />
          </TreeItemIndicator>
        {:else}
          <span></span>
        {/if}
        {item.label}
      </TreeItemLabel>
      {#if item.children}
        <TreeGroup>
          {@render items(item.children)}
        </TreeGroup>
      {/if}
    </TreeItem>
  {/each}
{/snippet}

<div data-slot="stack">
  <div data-slot="row">
    <button type="button" onclick={() => settings.expandAll()}>Expand all</button>
    <button type="button" onclick={() => settings.collapseAll()}>Collapse all</button>
    <button type="button" onclick={() => settings.reveal("two-factor")}>Find two-factor</button>
  </div>
  <Tree aria-label="Settings" controller={settings} keepMounted bind:expanded>
    {@render items(sections)}
  </Tree>
  <p data-slot="hint">Expanded: {expanded.join(", ") || "none"}</p>
</div>
