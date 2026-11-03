<script setup lang="ts">
import { createTabsController } from "@ui-sdk/core/tabs"
import { Tabs, TabsIndicator, TabsList, TabsPanel, TabsTab } from "@ui-sdk/vue/tabs"
import { ref } from "vue"

const tabs = createTabsController()
const value = ref<string | null>("inbox")
const reason = ref("")
</script>

<template>
  <div data-slot="stack">
    <Tabs
      v-model:value="value"
      :controller="tabs"
      @value-change="(_: string | null, details: { reason: string }) => (reason = details.reason)"
    >
      <TabsList aria-label="Mail">
        <TabsTab value="inbox">Inbox</TabsTab>
        <TabsTab value="drafts">Drafts</TabsTab>
        <TabsTab value="sent">Sent</TabsTab>
        <TabsIndicator />
      </TabsList>
      <TabsPanel value="inbox">No new mail.</TabsPanel>
      <TabsPanel value="drafts">Two drafts.</TabsPanel>
      <TabsPanel value="sent">Sent this week: 12.</TabsPanel>
    </Tabs>
    <div data-slot="row">
      <button type="button" @click="tabs.select('sent')">Show sent mail</button>
    </div>
    <output data-slot="output">Selected: {{ value }}{{ reason && `, last change: ${reason}` }}</output>
  </div>
</template>
