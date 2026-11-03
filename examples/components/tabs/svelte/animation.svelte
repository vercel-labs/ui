<script lang="ts">
  import { Tabs, TabsIndicator, TabsList, TabsPanel, TabsTab } from "@ui-sdk/svelte/tabs"
</script>

<Tabs defaultValue="overview">
  <TabsList aria-label="Project">
    <TabsTab value="overview">
      Overview
    </TabsTab>
    <TabsTab value="activity">
      Activity
    </TabsTab>
    <TabsTab value="settings">
      Settings
    </TabsTab>
    <TabsIndicator />
  </TabsList>
  <div data-slot="stack">
    <TabsPanel value="overview">
      Everything about the project at a glance.
    </TabsPanel>
    <TabsPanel value="activity">
      Deploys, comments and reviews from the last week.
    </TabsPanel>
    <TabsPanel value="settings">
      Rename, transfer or archive the project.
    </TabsPanel>
  </div>
</Tabs>
