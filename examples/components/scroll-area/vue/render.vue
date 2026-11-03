<script setup lang="ts">
import {
  ScrollArea,
  ScrollAreaContent,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "@ui-sdk/vue/scroll-area"

const tags = Array.from({ length: 50 }, (_, index) => `v1.2.0-beta.${50 - index}`)
</script>

<template>
  <ScrollArea>
    <template #render="{ props, state }">
      <section v-bind="props">
        <ScrollAreaViewport aria-label="Releases">
          <template #render="{ props }">
            <article v-bind="props">
              <ScrollAreaContent>
                <p v-for="tag in tags" :key="tag">{{ tag }}</p>
              </ScrollAreaContent>
            </article>
          </template>
        </ScrollAreaViewport>
        <p aria-hidden="true">
          {{ state.atStart ? "Scroll for older releases" : "Keep going" }}
        </p>
        <ScrollAreaScrollbar>
          <template #render="{ props }">
            <div v-bind="props">
              <ScrollAreaThumb>
                <template #render="{ props: thumbProps }">
                  <div v-bind="thumbProps" />
                </template>
              </ScrollAreaThumb>
            </div>
          </template>
        </ScrollAreaScrollbar>
      </section>
    </template>
  </ScrollArea>
</template>
