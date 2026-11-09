<script setup lang="ts">
import {
  Slider,
  SliderControl,
  SliderIndicator,
  SliderThumb,
  SliderTrack,
} from "@ui-sdk/vue"
import { countRender, perfSize, perfThumbs } from "tests/fixtures/perf.ts"

// A slider with N thumbs for the counts specs. Every other
// thumb reads its value in its slot, so specs can tell plain thumbs' renders
// from watched ones. The last thumb is a watched one. A thumb's render slot
// would replace its range input, so thumbs count in their default slot.
const values = perfThumbs(perfSize())
const count = (kind: "watched" | "plain" | "indicator") => (
  countRender(kind),
  ""
)
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <Slider :default-value="values" :max="1000">
      <SliderControl class="slider-control is-wide">
        <SliderTrack class="slider-track">
          <SliderIndicator class="slider-indicator">
            <template #render="{ props }">
              <div v-bind="props">{{ count("indicator") }}</div>
            </template>
          </SliderIndicator>
          <template v-for="(_, index) in values" :key="index">
            <SliderThumb
              v-if="index % 2"
              v-slot="{ state }"
              :index="index"
              class="slider-thumb"
              :aria-label="`Thumb ${index + 1}`"
            >
              <span :data-value="state.thumbValue">{{ count("watched") }}</span>
            </SliderThumb>
            <SliderThumb
              v-else
              :index="index"
              class="slider-thumb"
              :aria-label="`Thumb ${index + 1}`"
            >
              {{ count("plain") }}
            </SliderThumb>
          </template>
        </SliderTrack>
      </SliderControl>
    </Slider>
    <button>After</button>
  </div>
</template>
