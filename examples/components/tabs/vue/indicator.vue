<script setup lang="ts">
import { Tabs, TabsIndicator, TabsList, TabsPanel, TabsTab } from "@ui-sdk/vue/tabs"
import { ref } from "vue"

const vertical = ref(false)
</script>

<template>
  <div data-slot="stack">
    <Tabs default-value="music" :orientation="vertical ? 'vertical' : 'horizontal'">
      <TabsList aria-label="Library">
        <TabsTab value="music">Music</TabsTab>
        <TabsTab value="podcasts">Podcasts</TabsTab>
        <TabsTab value="audiobooks">Audiobooks</TabsTab>
        <TabsIndicator />
      </TabsList>
      <TabsPanel value="music">312 songs, 24 albums.</TabsPanel>
      <TabsPanel value="podcasts">8 shows, 3 new episodes.</TabsPanel>
      <TabsPanel value="audiobooks">2 books in progress.</TabsPanel>
    </Tabs>
    <label data-slot="label">
      <input v-model="vertical" type="checkbox" />
      Vertical
    </label>
  </div>
</template>
