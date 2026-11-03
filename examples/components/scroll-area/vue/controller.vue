<script setup lang="ts">
import {
  createScrollAreaController,
  ScrollArea,
  ScrollAreaContent,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "@ui-sdk/vue/scroll-area"
import { ref } from "vue"

const tags = Array.from({ length: 50 }, (_, index) => `v1.2.0-beta.${50 - index}`)

const controller = createScrollAreaController()
const position = ref("At the start")
const read = () =>
  (position.value = controller.isAtEnd()
    ? "At the end"
    : controller.isAtStart()
      ? "At the start"
      : "In between")
</script>

<template>
  <div data-slot="stack">
    <ScrollArea :controller="controller">
      <ScrollAreaViewport @scroll="read">
        <ScrollAreaContent>
          <div v-for="tag in tags" :key="tag">{{ tag }}</div>
        </ScrollAreaContent>
      </ScrollAreaViewport>
      <ScrollAreaScrollbar>
        <ScrollAreaThumb />
      </ScrollAreaScrollbar>
    </ScrollArea>
    <div data-slot="stack">
      <button
        data-variant="secondary"
        type="button"
        @click="controller.scrollToStart({ behavior: 'smooth' })"
      >
        Back to top
      </button>
      <button data-variant="secondary" type="button" @click="controller.scrollToEnd({ behavior: 'instant' })">
        Jump to the end
      </button>
      <output data-slot="output">{{ position }}</output>
    </div>
  </div>
</template>
