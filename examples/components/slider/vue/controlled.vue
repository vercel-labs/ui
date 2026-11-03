<script setup lang="ts">
import { Field, FieldLabel } from "@ui-sdk/vue/field"
import { Slider, SliderControl, SliderIndicator, SliderThumb, SliderTrack } from "@ui-sdk/vue/slider"
import { ref } from "vue"

const value = ref<number | number[]>([0.3, 0.7])
const reason = ref("")

function reset() {
  value.value = [0.3, 0.7]
  reason.value = ""
}
</script>

<template>
  <Field>
    <div data-slot="row">
      <FieldLabel>Temperature</FieldLabel>
      <span data-slot="output">{{ [value].flat().join(", ") }}</span>
    </div>
    <Slider
      v-model:value="value"
      :min="0"
      :max="1"
      :step="0.1"
      @value-change="(_value, details) => (reason = details.reason)"
    >
      <SliderControl>
        <SliderTrack>
          <SliderIndicator />
          <SliderThumb :index="0" aria-label="Minimum temperature" />
          <SliderThumb :index="1" aria-label="Maximum temperature" />
        </SliderTrack>
      </SliderControl>
    </Slider>
    <div data-slot="row">
      <button type="button" @click="reset">Reset</button>
    </div>
    <output data-slot="output">{{ reason ? `Last change: ${reason}` : "Drag a thumb." }}</output>
  </Field>
</template>
