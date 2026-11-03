<script setup lang="ts">
import { Field, FieldLabel } from "@ui-sdk/vue/field"
import {
  Slider,
  SliderControl,
  SliderIndicator,
  SliderThumb,
  SliderTrack,
  SliderValue,
  type SliderValueCommitDetails,
} from "@ui-sdk/vue/slider"
import { ref } from "vue"

const save = () => new Promise((resolve) => setTimeout(resolve, 600))

const changes = ref(0)
const status = ref("Drag to change the brightness.")

async function onCommit(value: number | number[], details: SliderValueCommitDetails) {
  status.value = "Saving…"
  await save()
  status.value = `Saved ${value} (${details.reason}).`
}
</script>

<template>
  <Field>
    <Slider :default-value="50" @value-change="changes++" @value-commit="onCommit">
      <div data-slot="row">
        <FieldLabel>Brightness</FieldLabel>
        <SliderValue />
      </div>
      <SliderControl>
        <SliderTrack>
          <SliderIndicator />
          <SliderThumb />
        </SliderTrack>
      </SliderControl>
    </Slider>
    <output data-slot="output">
      <span>Changes: {{ changes }}</span>
      <span>{{ status }}</span>
    </output>
  </Field>
</template>
