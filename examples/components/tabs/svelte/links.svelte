<script lang="ts">
  import { Tabs, TabsIndicator, TabsList, TabsPanel, TabsTab } from "@ui-sdk/svelte/tabs"

  const pages = [
    { value: "overview", href: "#project-overview", label: "Overview", content: "Everything at a glance." },
    { value: "activity", href: "#project-activity", label: "Activity", content: "What changed this week." },
    { value: "members", href: "#project-members", label: "Members", content: "Who can edit the project." },
  ]
</script>

<Tabs defaultValue="overview">
  <TabsList aria-label="Project">
    {#each pages as page (page.value)}
      <TabsTab value={page.value} href={page.href}>
        {#snippet render({ props })}
          <a {...props}>
            {page.label}
          </a>
        {/snippet}
      </TabsTab>
    {/each}
    <TabsIndicator />
  </TabsList>
  {#each pages as page (page.value)}
    <TabsPanel value={page.value}>
      {page.content}
    </TabsPanel>
  {/each}
</Tabs>
