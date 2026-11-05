<script setup lang="ts">
import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerAreaThumb,
  ColorPickerInput,
  ColorPickerSlider,
  ColorPickerSliderThumb,
  ColorPickerSwatch,
} from "@ui-sdk/vue/color-picker"
</script>

<template>
  <ColorPicker aria-label="Brand color" default-value="#0ea5e9">
    <ColorPickerArea>
      <ColorPickerAreaThumb />
    </ColorPickerArea>
    <ColorPickerSlider channel="hue">
      <ColorPickerSliderThumb />
    </ColorPickerSlider>
    <div data-slot="row">
      <ColorPickerSwatch />
      <ColorPickerInput aria-label="Hex" />
    </div>
  </ColorPicker>
</template>
