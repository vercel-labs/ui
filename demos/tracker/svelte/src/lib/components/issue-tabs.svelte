<script lang="ts">
  import { Tabs, TabsList, TabsTab } from "#ui/tabs"
  import { href, tabs, type Query, type Tab } from "tracker-data"

  let { query, counts }: { query: Query; counts: Record<Tab, number> } =
    $props()
</script>

<Tabs value={query.tab}>
  <TabsList aria-label="Issues">
    {#each tabs as tab (tab.value)}
      <TabsTab value={tab.value}>
        {#snippet render({ props })}
          <a
            {...props}
            href={href(query, { tab: tab.value, page: 1, issue: null })}
          >
            {tab.label}
            <span class="text-xs text-muted-foreground tabular-nums"
              >{counts[tab.value]}</span
            >
          </a>
        {/snippet}
      </TabsTab>
    {/each}
  </TabsList>
</Tabs>
