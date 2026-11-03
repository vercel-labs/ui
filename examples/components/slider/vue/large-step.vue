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
  <Slider
    :default-value="100"
    :min="25"
    :max="400"
    :large-step="25"
    :format="{ style: 'unit', unit: 'percent' }"
  >
    <div data-slot="row">
      <span data-slot="label">Zoom</span>
      <SliderValue />
    </div>
    <SliderControl>
      <SliderTrack>
        <SliderIndicator />
        <SliderThumb aria-label="Zoom" />
      </SliderTrack>
    </SliderControl>
    <p data-slot="hint">Focus the thumb and press Page Up to zoom by 25%.</p>
  </Slider>
</template>
