<script setup lang="ts">
import {
  Slider,
  SliderControl,
  SliderIndicator,
  SliderThumb,
  SliderTrack,
} from "@ui-sdk/vue"
import { perfSize } from "tests/fixtures/perf.ts"

// N single-thumb sliders, like a page of settings. Each submits a value, so each renders its form input.
const sliders = Array.from({ length: perfSize(200) }, (_, index) => index)
</script>

<template>
  <div class="fixture" style="flex-direction: column; align-items: start">
    <button>Before</button>
    <Slider
      v-for="index in sliders"
      :key="index"
      class="slider-row"
      :name="`slider-${index}`"
      :default-value="index % 101"
    >
      <SliderControl class="slider-control">
        <SliderTrack class="slider-track">
          <SliderIndicator class="slider-indicator" />
          <SliderThumb
            class="slider-thumb"
            :aria-label="`Slider ${index + 1}`"
          />
        </SliderTrack>
      </SliderControl>
    </Slider>
    <button>After</button>
  </div>
</template>
