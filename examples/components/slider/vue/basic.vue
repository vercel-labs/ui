<script setup lang="ts">
import { Slider, SliderControl, SliderIndicator, SliderThumb, SliderTrack } from "@ui-sdk/vue/slider"
</script>

<template>
  <Slider :default-value="75">
    <SliderControl>
      <SliderTrack>
        <SliderIndicator />
        <SliderThumb aria-label="Volume" />
      </SliderTrack>
    </SliderControl>
  </Slider>
</template>
