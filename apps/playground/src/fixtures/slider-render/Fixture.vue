<script setup lang="ts">
import {
  NumberInput,
  NumberInputIncrement,
  NumberInputControl,
  Slider,
  SliderControl,
  SliderIndicator,
  SliderThumb,
  SliderTrack,
  SliderValue,
} from "@ui-sdk/vue"
import { ref } from "vue"

// Parts rendered as other elements, and from their state. One fixture covers
// Slider and Number Input.
const action = ref("")
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <Slider
      :default-value="40"
      @value-change="(value) => (action = `brightness:${value}`)"
    >
      <SliderValue class="slider-value" v-slot="{ state }"
        >Brightness {{ state.text }}</SliderValue
      >
      <SliderControl class="slider-control">
        <SliderTrack class="slider-track">
          <SliderIndicator class="slider-indicator" />
          <SliderThumb class="slider-thumb" aria-label="Brightness">
            <template #render="{ props, state, children }">
              <span v-bind="props">
                <span class="thumb-label">{{ state.thumbValue }}</span>
                <component :is="children" />
              </span>
            </template>
          </SliderThumb>
        </SliderTrack>
      </SliderControl>
    </Slider>
    <NumberInput :default-value="8" :max="9">
      <NumberInputControl aria-label="Count" />
      <NumberInputIncrement aria-label="Increase count" v-slot="{ state }">
        {{ state.disabled ? "At most" : "More" }}
      </NumberInputIncrement>
    </NumberInput>
    <button>After</button>
    <output role="status" aria-label="Last action">{{ action }}</output>
  </div>
</template>
