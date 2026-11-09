<script lang="ts">
  import { createTreeController, Tree } from "@ui-sdk/svelte"
  import { describeTree, treeFixture } from "tests/fixtures/tree.ts"
  import { treeOptions } from "tests/fixtures/page.ts"
  import TreeFixtureItems from "./TreeFixtureItems.svelte"

  // With `data`, the tree also gets its items as data, which give it its whole shape: typeahead
  // and the controller reach items in collapsed branches.
  let { data = false }: { data?: boolean } = $props()

  const controller = createTreeController()
  const { cancel, ...options } = treeOptions()

  let action = $state("")

  function onExpandedChange(
    expanded: string[],
    details: { cancel: () => void }
  ) {
    if (cancel && expanded.includes(cancel) && !controller.isExpanded(cancel)) {
      return details.cancel()
    }
    action = describeTree("expanded", expanded)
  }
</script>

<div class="fixture">
  <button>Before</button>
  <Tree
    class="tree"
    aria-label={treeFixture.label}
    items={data ? treeFixture.items : undefined}
    {controller}
    {...options}
    onValueChange={(value) => (action = describeTree("selected", value))}
    {onExpandedChange}
    onCheckedChange={(checked) => (action = describeTree("checked", checked))}
    onAction={(value) => {
      action = describeTree("action", value)
    }}
  >
    <TreeFixtureItems items={treeFixture.items} checkable={options.checkable} />
  </Tree>
  <button>After</button>
  <output role="status" aria-label="Last action">{action}</output>
  <button onclick={() => controller.expandAll()}>Expand all</button>
  <button onclick={() => controller.collapseAll()}>Collapse all</button>
  <button onclick={() => controller.reveal("dialog.tsx")}>Reveal dialog</button>
</div>
