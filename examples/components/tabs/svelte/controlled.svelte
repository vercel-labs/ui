<script lang="ts">
  import {
    Tabs,
    TabsIndicator,
    TabsList,
    TabsPanel,
    TabsTab,
    createTabsController,
  } from "@ui-sdk/svelte/tabs"

  const tabs = createTabsController()
  let value = $state<string | null>("inbox")
  let reason = $state("")
</script>

<div data-slot="stack">
  <Tabs bind:value controller={tabs} onValueChange={(_, details) => (reason = details.reason)}>
    <TabsList aria-label="Mail">
      <TabsTab value="inbox">
        Inbox
      </TabsTab>
      <TabsTab value="drafts">
        Drafts
      </TabsTab>
      <TabsTab value="sent">
        Sent
      </TabsTab>
      <TabsIndicator />
    </TabsList>
    <TabsPanel value="inbox">
      No new mail.
    </TabsPanel>
    <TabsPanel value="drafts">
      Two drafts.
    </TabsPanel>
    <TabsPanel value="sent">
      Sent this week: 12.
    </TabsPanel>
  </Tabs>
  <div data-slot="row">
    <button type="button" onclick={() => tabs.select("sent")}>
      Show sent mail
    </button>
  </div>
  <output data-slot="output">
    Selected: {value}{reason ? `, last change: ${reason}` : ""}
  </output>
</div>
