<script lang="ts">
  import { Tabs, TabsList, TabsPanel, TabsTab } from "@ui-sdk/svelte"
  import { perfItems, perfSize } from "tests/fixtures/perf.ts"

  // Many tabs for the counts specs.
  const items = perfItems(perfSize())
</script>

<div class="fixture">
  <button>Before</button>
  <Tabs class="tabs" defaultValue={items[0].value}>
    <TabsList class="tablist" aria-label="Pages" style="flex-wrap: wrap">
      {#each items as item (item.value)}
        <TabsTab class="tab" value={item.value}>{item.label}</TabsTab>
      {/each}
    </TabsList>
    {#each items as item (item.value)}
      <TabsPanel class="panel" value={item.value}
        >{item.label} content.</TabsPanel
      >
    {/each}
  </Tabs>
  <button>After</button>
</div>
