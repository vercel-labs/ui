<script setup lang="ts">
import {
  ScrollArea,
  ScrollAreaContent,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
  type ScrollAreaType,
} from "@ui-sdk/vue/scroll-area"

const types: ScrollAreaType[] = ["hover", "scroll", "auto", "always"]

const tags = Array.from({ length: 20 }, (_, index) => `v1.2.0-beta.${50 - index}`)
</script>

<template>
  <div data-slot="grid">
    <div data-slot="stack" v-for="type in types" :key="type">
      <code>type="{{ type }}"</code>
      <ScrollArea :type="type">
        <ScrollAreaViewport>
          <ScrollAreaContent>
            <div v-for="tag in tags" :key="tag">{{ tag }}</div>
          </ScrollAreaContent>
        </ScrollAreaViewport>
        <ScrollAreaScrollbar>
          <ScrollAreaThumb />
        </ScrollAreaScrollbar>
      </ScrollArea>
    </div>
  </div>
</template>
