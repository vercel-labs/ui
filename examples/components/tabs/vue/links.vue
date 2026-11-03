<script setup lang="ts">
import { Tabs, TabsIndicator, TabsList, TabsPanel, TabsTab } from "@ui-sdk/vue/tabs"

const pages = [
  { value: "overview", href: "#project-overview", label: "Overview", content: "Everything at a glance." },
  { value: "activity", href: "#project-activity", label: "Activity", content: "What changed this week." },
  { value: "members", href: "#project-members", label: "Members", content: "Who can edit the project." },
]
</script>

<template>
  <Tabs default-value="overview">
    <TabsList aria-label="Project">
      <TabsTab v-for="page in pages" :key="page.value" :value="page.value" :href="page.href">
        <template #render="{ props }">
          <a v-bind="props">
            {{ page.label }}
          </a>
        </template>
      </TabsTab>
      <TabsIndicator />
    </TabsList>
    <TabsPanel v-for="page in pages" :key="page.value" :value="page.value">
      {{ page.content }}
    </TabsPanel>
  </Tabs>
</template>
