<script setup lang="ts">
import {
  ScrollArea,
  ScrollAreaContent,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "@ui-sdk/vue/scroll-area"

const tags = Array.from({ length: 20 }, (_, index) => `v1.2.0-beta.${50 - index}`)
</script>

<template>
  <div data-slot="row">
    <div data-slot="stack" v-for="delay in [0, 2000]" :key="delay">
      <code>scrollHideDelay={{ delay }}</code>
      <ScrollArea type="scroll" :scroll-hide-delay="delay">
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
