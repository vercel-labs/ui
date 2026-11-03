<script lang="ts">
  import { Tree } from "@ui-sdk/svelte"
  import { treeLinksFixture } from "tests/fixtures/tree.ts"
  import { onDestroy } from "svelte"
  import TreeFixtureItems from "../tree/TreeFixtureItems.svelte"

  // A tree of links, rendered with the tree fixture's classes. The current page follows the address.
  let current = $state(location.hash.slice(1) || "usage")
  const changed = () => (current = location.hash.slice(1))
  window.addEventListener("hashchange", changed)
  onDestroy(() => window.removeEventListener("hashchange", changed))
</script>

<div class="fixture">
  <button>Before</button>
  <Tree
    class="tree"
    aria-label={treeLinksFixture.label}
    items={treeLinksFixture.items}
    mode="none"
    {current}
  >
    <TreeFixtureItems items={treeLinksFixture.items} checkable={false} />
  </Tree>
  <button>After</button>
  <output role="status" aria-label="Last action">{current}</output>
</div>
