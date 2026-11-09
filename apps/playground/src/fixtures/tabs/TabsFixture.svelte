<script lang="ts">
  import { createTabsController } from "@ui-sdk/core/tabs"
  import {
    Tabs,
    TabsIndicator,
    TabsList,
    TabsPanel,
    TabsTab,
  } from "@ui-sdk/svelte"
  import { tabsOptions } from "tests/fixtures/page.ts"
  import { tabsFixture } from "tests/fixtures/tabs.ts"

  const controller = createTabsController()
  const { cancel, keepMounted, ...options } = tabsOptions()

  let action = $state("")

  function onValueChange(
    value: string | null,
    details: { cancel: () => void }
  ) {
    if (value === cancel) {
      return details.cancel()
    }
    action = value ?? ""
  }
</script>

<div class="fixture">
  <button>Before</button>
  <Tabs class="tabs" {...options} {controller} {onValueChange}>
    <TabsList class="tablist" aria-label={tabsFixture.label}>
      {#each tabsFixture.tabs as tab (tab.value)}
        <TabsTab class="tab" value={tab.value} disabled={tab.disabled}
          >{tab.label}</TabsTab
        >
      {/each}
      <TabsIndicator class="indicator" />
    </TabsList>
    {#each tabsFixture.tabs as tab (tab.value)}
      <TabsPanel class="panel" value={tab.value} {keepMounted}>
        {tab.content}
        {#if tab.field}
          <label> {tab.field} <input type="password" /></label>
        {/if}
      </TabsPanel>
    {/each}
  </Tabs>
  <button>After</button>
  <output role="status" aria-label="Last action">{action}</output>
  <button onclick={() => controller.select("notifications")}
    >Show notifications</button
  >
</div>
