<script setup lang="ts">
import { ScrollArea, ScrollAreaContent, ScrollAreaViewport } from "@ui-sdk/vue/scroll-area"

const tags = Array.from({ length: 50 }, (_, index) => `v1.2.0-beta.${50 - index}`)
</script>

<template>
  <ScrollArea>
    <ScrollAreaViewport>
      <ScrollAreaContent>
        <div v-for="tag in tags" :key="tag">{{ tag }}</div>
      </ScrollAreaContent>
    </ScrollAreaViewport>
  </ScrollArea>
</template>
