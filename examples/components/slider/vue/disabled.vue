<script setup lang="ts">
import { Slider, SliderControl, SliderIndicator, SliderThumb, SliderTrack } from "@ui-sdk/vue/slider"
</script>

<template>
  <Slider :default-value="50" disabled>
    <SliderControl>
      <SliderTrack>
        <SliderIndicator />
        <SliderThumb aria-label="Disabled" />
      </SliderTrack>
    </SliderControl>
  </Slider>
</template>
