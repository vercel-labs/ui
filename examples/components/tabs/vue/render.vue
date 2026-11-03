<script setup lang="ts">
import { Tabs, TabsList, TabsPanel, TabsTab } from "@ui-sdk/vue/tabs"

const folders = [
  { value: "inbox", label: "Inbox", count: 12 },
  { value: "unread", label: "Unread", count: 3 },
  { value: "archived", label: "Archived", count: 0 },
]
</script>

<template>
  <Tabs default-value="inbox">
    <TabsList aria-label="Mail">
      <TabsTab v-for="folder in folders" :key="folder.value" :value="folder.value">
        <template #render="{ props }">
          <button v-bind="props">
            {{ folder.label }}
            <span v-if="folder.count > 0">
              {{ folder.count }}
            </span>
          </button>
        </template>
      </TabsTab>
    </TabsList>
    <TabsPanel v-for="folder in folders" :key="folder.value" :value="folder.value">
      {{ folder.count > 0 ? `${folder.count} conversations.` : "Nothing archived yet." }}
    </TabsPanel>
  </Tabs>
</template>
