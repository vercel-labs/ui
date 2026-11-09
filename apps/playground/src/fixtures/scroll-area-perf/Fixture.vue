<script setup lang="ts">
import {
  ScrollArea,
  ScrollAreaContent,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "@ui-sdk/vue"
import { countRender, perfItems, perfSize } from "tests/fixtures/perf.ts"

// A scroll area of N items for the counts specs, with its
// scrollbar always shown. The content, the thumb and every item count their
// renders. Items render in the content's slot, so they count each time it
// renders.
const items = perfItems(perfSize())
const count = (kind: "item" | "content" | "thumb") => (countRender(kind), "")
</script>

<template>
  <div class="fixture scroll-fixture">
    <button>Before</button>
    <ScrollArea class="scroll-area" type="always">
      <ScrollAreaViewport
        class="scroll-area-viewport"
        role="region"
        aria-label="Items"
      >
        <ScrollAreaContent>
          {{ count("content") }}
          <p v-for="item in items" :key="item.value" class="scroll-area-item">
            {{ count("item") }}{{ item.label }}
          </p>
        </ScrollAreaContent>
      </ScrollAreaViewport>
      <ScrollAreaScrollbar class="scroll-area-scrollbar">
        <ScrollAreaThumb class="scroll-area-thumb">
          <template #render="{ props }">
            <div v-bind="props">{{ count("thumb") }}</div>
          </template>
        </ScrollAreaThumb>
      </ScrollAreaScrollbar>
    </ScrollArea>
    <button>After</button>
  </div>
</template>
