<script setup lang="ts">
import { createTabsController } from "@ui-sdk/core/tabs"
import { Tabs, TabsIndicator, TabsList, TabsPanel, TabsTab } from "@ui-sdk/vue"
import { tabsOptions } from "tests/fixtures/page.ts"
import { tabsFixture } from "tests/fixtures/tabs.ts"
import { ref } from "vue"

const controller = createTabsController()
const { cancel, keepMounted, ...options } = tabsOptions()

const action = ref("")

function onValueChange(value: string | null, details: { cancel: () => void }) {
  if (value === cancel) {
    return details.cancel()
  }
  action.value = value ?? ""
}
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <Tabs
      class="tabs"
      v-bind="options"
      :controller="controller"
      @value-change="onValueChange"
    >
      <TabsList class="tablist" :aria-label="tabsFixture.label">
        <TabsTab
          v-for="tab in tabsFixture.tabs"
          :key="tab.value"
          class="tab"
          :value="tab.value"
          :disabled="tab.disabled"
        >
          {{ tab.label }}
        </TabsTab>
        <TabsIndicator class="indicator" />
      </TabsList>
      <TabsPanel
        v-for="tab in tabsFixture.tabs"
        :key="tab.value"
        class="panel"
        :value="tab.value"
        :keep-mounted="keepMounted"
      >
        {{ tab.content }}
        <label v-if="tab.field">
          {{ tab.field }} <input type="password"
        /></label>
      </TabsPanel>
    </Tabs>
    <button>After</button>
    <output role="status" aria-label="Last action">{{ action }}</output>
    <button @click="controller.select('notifications')">
      Show notifications
    </button>
  </div>
</template>
