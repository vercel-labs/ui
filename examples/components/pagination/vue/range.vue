<script setup lang="ts">
import { paginationRange } from "@ui-sdk/vue/pagination"
import { computed, ref } from "vue"

const slide = ref(1)
const items = computed(() =>
  paginationRange({ page: slide.value, pageCount: 20, siblings: 2, boundaries: 1 }),
)
</script>

<template>
  <div data-slot="stack">
    <div data-slot="row" data-variant="dots" role="group" aria-label="Slides">
      <template v-for="item in items" :key="item">
        <button
          v-if="typeof item === 'number'"
          type="button"
          :aria-label="`Slide ${item}`"
          :aria-current="item === slide ? 'true' : undefined"
          @click="slide = item"
        ></button>
        <span v-else aria-hidden="true"></span>
      </template>
    </div>
    <output data-slot="output">Slide {{ slide }} of 20</output>
  </div>
</template>
