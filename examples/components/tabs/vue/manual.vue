<script setup lang="ts">
import { Tabs, TabsList, TabsPanel, TabsTab } from "@ui-sdk/vue/tabs"
</script>

<template>
  <Tabs default-value="preview" activation="manual">
    <TabsList aria-label="Snippet">
      <TabsTab value="preview">Preview</TabsTab>
      <TabsTab value="code">Code</TabsTab>
      <TabsTab value="tests" disabled>Tests</TabsTab>
    </TabsList>
    <TabsPanel value="preview">The rendered snippet.</TabsPanel>
    <TabsPanel value="code">
      Edit the snippet's source.
      <input aria-label="Source" value="<Tabs />" />
    </TabsPanel>
  </Tabs>
</template>
