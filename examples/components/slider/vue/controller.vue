<script setup lang="ts">
import {
  createSliderController,
  Slider,
  SliderControl,
  SliderIndicator,
  SliderThumb,
  SliderTrack,
  SliderValue,
} from "@ui-sdk/vue/slider"
import { Field, FieldLabel } from "@ui-sdk/vue/field"
import { ref } from "vue"

const volume = createSliderController<number>()
const reading = ref("")
</script>

<template>
  <div data-slot="stack">
    <Field>
      <Slider :default-value="40" :controller="volume">
        <div data-slot="row">
          <FieldLabel>Volume</FieldLabel>
          <SliderValue />
        </div>
        <SliderControl>
          <SliderTrack>
            <SliderIndicator />
            <SliderThumb />
          </SliderTrack>
        </SliderControl>
      </Slider>
    </Field>
    <div data-slot="row">
      <button type="button" @click="volume.setValue(0)">Mute</button>
      <button type="button" @click="volume.setValue(volume.getValue() + 10)">Louder</button>
      <button type="button" @click="reading = `Volume is ${volume.getValue()}.`">Read</button>
      <button type="button" @click="volume.focus()">Focus</button>
    </div>
    <output v-if="reading" data-slot="output">{{ reading }}</output>
  </div>
</template>
