<script setup lang="ts">
import { Slider, SliderControl, SliderIndicator, SliderThumb, SliderTrack } from "@ui-sdk/vue/slider"

const channels = [
  { label: "Bass", value: 50 },
  { label: "Treble", value: 25 },
]
</script>

<template>
  <div data-slot="row">
    <Slider
      v-for="channel in channels"
      :key="channel.label"
      orientation="vertical"
      :default-value="channel.value"
    >
      <SliderControl>
        <SliderTrack>
          <SliderIndicator />
          <SliderThumb :aria-label="channel.label" />
        </SliderTrack>
      </SliderControl>
    </Slider>
  </div>
</template>
