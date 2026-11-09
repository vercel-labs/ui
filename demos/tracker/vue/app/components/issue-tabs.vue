<script setup lang="ts">
import { href, type Query, type Tab, tabs } from "tracker-data"
import { Tabs, TabsList, TabsTab } from "~/components/ui/tabs"

defineProps<{ query: Query; counts: Record<Tab, number> }>()
</script>

<template>
  <Tabs :value="query.tab">
    <TabsList aria-label="Issues">
      <TabsTab v-for="tab in tabs" :key="tab.value" :value="tab.value">
        <template #render="{ props }">
          <NuxtLink
            v-bind="props"
            :to="href(query, { tab: tab.value, page: 1, issue: null })"
          >
            {{ tab.label }}
            <span class="text-xs text-muted-foreground tabular-nums">{{
              counts[tab.value]
            }}</span>
          </NuxtLink>
        </template>
      </TabsTab>
    </TabsList>
  </Tabs>
</template>
