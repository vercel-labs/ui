<script setup lang="ts">
import {
  Slider,
  SliderControl,
  SliderIndicator,
  SliderThumb,
  SliderTrack,
  SliderValue,
} from "@ui-sdk/vue/slider"
</script>

<template>
  <Slider :default-value="60" aria-label="Brightness">
    <SliderValue v-slot="{ state }">Brightness {{ state.text }}%</SliderValue>
    <SliderControl>
      <SliderTrack>
        <SliderIndicator />
        <SliderThumb aria-label="Brightness">
          <template #render="{ props, state, children }">
            <span v-bind="props">
              <span data-slot="output">{{ state.thumbValue }}</span>
              <component :is="children" />
            </span>
          </template>
        </SliderThumb>
      </SliderTrack>
    </SliderControl>
  </Slider>
</template>
