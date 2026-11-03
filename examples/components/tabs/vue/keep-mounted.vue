<script setup lang="ts">
import { Tabs, TabsIndicator, TabsList, TabsPanel, TabsTab } from "@ui-sdk/vue/tabs"
</script>

<template>
  <Tabs default-value="reply">
    <TabsList aria-label="Comment">
      <TabsTab value="reply">Reply</TabsTab>
      <TabsTab value="formatting">Formatting</TabsTab>
      <TabsIndicator />
    </TabsList>
    <TabsPanel value="reply" keep-mounted>
      <textarea aria-label="Reply" placeholder="Write a reply…"></textarea>
    </TabsPanel>
    <TabsPanel value="formatting"> Use **bold**, _italics_ and `code`. Paste a link to embed it. </TabsPanel>
  </Tabs>
</template>
