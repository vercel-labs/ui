<script setup lang="ts">
import {
  ScrollArea,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "@ui-sdk/vue"

const notes = Array.from({ length: 40 }, (_, index) => `Note ${index + 1}`)
const renders = ((window as unknown as { renders: { root: number } }).renders =
  { root: 0 })

// Counts the root's slot renders, which only an edge flipping should cause.
function status(atEnd: boolean) {
  renders.root++
  return atEnd ? "At end" : "Reading"
}
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <ScrollArea class="scroll-area">
      <template #render="{ props, state }">
        <section v-bind="props">
          <p class="render-status">{{ status(state.atEnd) }}</p>
          <ScrollAreaViewport
            class="scroll-area-viewport"
            role="region"
            aria-label="Notes"
          >
            <template #render="{ props }">
              <article v-bind="props">
                <p v-for="note in notes" :key="note" class="scroll-area-item">
                  {{ note }}
                </p>
              </article>
            </template>
          </ScrollAreaViewport>
          <ScrollAreaScrollbar class="scroll-area-scrollbar">
            <ScrollAreaThumb class="scroll-area-thumb" />
          </ScrollAreaScrollbar>
        </section>
      </template>
    </ScrollArea>
    <button>After</button>
    <output role="status" aria-label="Last action"></output>
  </div>
</template>
