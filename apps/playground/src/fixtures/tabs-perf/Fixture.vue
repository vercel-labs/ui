<script setup lang="ts">
import { Tabs, TabsList, TabsPanel, TabsTab } from "@ui-sdk/vue"
import { perfItems, perfSize } from "tests/fixtures/perf.ts"

// Many tabs for the counts specs.
const items = perfItems(perfSize())
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <Tabs class="tabs" :default-value="items[0].value">
      <TabsList class="tablist" aria-label="Pages" style="flex-wrap: wrap">
        <TabsTab
          v-for="item in items"
          :key="item.value"
          class="tab"
          :value="item.value"
        >
          {{ item.label }}
        </TabsTab>
      </TabsList>
      <TabsPanel
        v-for="item in items"
        :key="item.value"
        class="panel"
        :value="item.value"
      >
        {{ item.label }} content.
      </TabsPanel>
    </Tabs>
    <button>After</button>
  </div>
</template>
