<script lang="ts">
  import { Tabs, TabsList, TabsPanel, TabsTab } from "@ui-sdk/svelte/tabs"
</script>

<Tabs defaultValue="general" orientation="vertical">
  <TabsList aria-label="Preferences">
    <TabsTab value="general">
      General
    </TabsTab>
    <TabsTab value="security">
      Security
    </TabsTab>
    <TabsTab value="integrations">
      Integrations
    </TabsTab>

  </TabsList>
  <TabsPanel value="general">
    Language, time zone and start page.
  </TabsPanel>
  <TabsPanel value="security">
    Passkeys, sessions and recovery codes.
  </TabsPanel>
  <TabsPanel value="integrations">
    Connect your calendar and chat apps.
  </TabsPanel>
</Tabs>
