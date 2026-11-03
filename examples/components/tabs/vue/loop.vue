<script setup lang="ts">
import { Tabs, TabsList, TabsPanel, TabsTab } from "@ui-sdk/vue/tabs"

const ranges = [
  { value: "day", label: "Day", content: "128 visitors today." },
  { value: "week", label: "Week", content: "1,024 visitors this week." },
  { value: "month", label: "Month", content: "4,210 visitors this month." },
  { value: "year", label: "Year", content: "48,930 visitors this year." },
]
</script>

<template>
  <Tabs default-value="day" :loop="false">
    <TabsList aria-label="Range">
      <TabsTab v-for="range in ranges" :key="range.value" :value="range.value">
        {{ range.label }}
      </TabsTab>
    </TabsList>
    <TabsPanel v-for="range in ranges" :key="range.value" :value="range.value">
      {{ range.content }}
    </TabsPanel>
  </Tabs>
</template>
