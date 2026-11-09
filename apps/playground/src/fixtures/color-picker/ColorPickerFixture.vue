<script setup lang="ts">
import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerAreaCanvas,
  ColorPickerAreaThumb,
  ColorPickerChannelInput,
  ColorPickerEyeDropper,
  ColorPickerInput,
  ColorPickerSlider,
  ColorPickerSliderThumb,
  ColorPickerSwatch,
  ColorPickerSwatches,
  ColorPickerSwatchItem,
  createColorPickerController,
} from "@ui-sdk/vue"
import { colorPickerOptions } from "tests/fixtures/page.ts"
import { colorPickerFixture } from "tests/fixtures/color-picker.ts"
import { ref } from "vue"

const controller = createColorPickerController()
const { cancel, ...options } = colorPickerOptions()

const action = ref("")
const committed = ref("")
const submitted = ref("")

function onValueChange(
  value: string,
  details: { reason: string; cancel: () => void }
) {
  if (cancel) {
    return details.cancel()
  }
  action.value = `${value}:${details.reason}`
}

function onValueCommit(value: string, details: { reason: string }) {
  committed.value = `${value}:${details.reason}`
}

function onSubmit(event: SubmitEvent) {
  const form = event.currentTarget as HTMLFormElement
  submitted.value = Array.from(
    new FormData(form),
    ([key, value]) => `${key}=${value}`
  ).join("&")
}
</script>

<template>
  <form class="fixture" @submit.prevent="onSubmit">
    <button type="button">Before</button>
    <ColorPicker
      :aria-label="colorPickerFixture.label"
      :name="colorPickerFixture.name"
      v-bind="options"
      :controller="controller"
      @value-change="onValueChange"
      @value-commit="onValueCommit"
    >
      <ColorPickerArea>
        <ColorPickerAreaCanvas v-if="options.space === 'oklch'" />
        <ColorPickerAreaThumb />
      </ColorPickerArea>
      <ColorPickerSlider channel="hue">
        <ColorPickerSliderThumb />
      </ColorPickerSlider>
      <ColorPickerSlider channel="alpha">
        <ColorPickerSliderThumb />
      </ColorPickerSlider>
      <ColorPickerInput :aria-label="colorPickerFixture.inputLabel" />
      <ColorPickerChannelInput channel="alpha" />
      <ColorPickerSwatch />
      <ColorPickerEyeDropper>Pick from screen</ColorPickerEyeDropper>
      <ColorPickerSwatches aria-label="Presets">
        <ColorPickerSwatchItem
          v-for="swatch in colorPickerFixture.swatches"
          :key="swatch"
          :value="swatch"
        />
      </ColorPickerSwatches>
    </ColorPicker>
    <button type="button">After</button>
    <button type="submit">Save</button>
    <button type="reset">Reset</button>
    <button type="button" @click="controller.setValue('rebeccapurple')">
      Use purple
    </button>
    <output role="status" aria-label="Last action">{{ action }}</output>
    <output aria-label="Committed">{{ committed }}</output>
    <output aria-label="Submitted">{{ submitted }}</output>
  </form>
</template>
