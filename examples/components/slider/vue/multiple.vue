<script setup lang="ts">
import { Slider, SliderControl, SliderIndicator, SliderThumb, SliderTrack } from "@ui-sdk/vue/slider"

const thumbs = ["Low", "Medium", "High"]
</script>

<template>
  <Slider :default-value="[10, 20, 70]" :step="10">
    <SliderControl>
      <SliderTrack>
        <SliderIndicator />
        <SliderThumb v-for="(label, index) in thumbs" :key="label" :index="index" :aria-label="label" />
      </SliderTrack>
    </SliderControl>
  </Slider>
</template>
