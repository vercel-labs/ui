<script setup lang="ts">
import { Slider, SliderControl, SliderIndicator, SliderThumb, SliderTrack } from "@ui-sdk/vue/slider"
</script>

<template>
  <Slider :default-value="[25, 50]" :step="5">
    <SliderControl>
      <SliderTrack>
        <SliderIndicator />
        <SliderThumb :index="0" aria-label="Minimum" />
        <SliderThumb :index="1" aria-label="Maximum" />
      </SliderTrack>
    </SliderControl>
  </Slider>
</template>
