<script setup lang="ts">
import { Field, FieldLabel } from "@ui-sdk/vue/field"
import {
  Slider,
  SliderControl,
  SliderIndicator,
  SliderThumb,
  SliderTrack,
  SliderValue,
} from "@ui-sdk/vue/slider"
import { ref, useId } from "vue"

const formId = useId()
const submitted = ref("")

function onSubmit(event: Event) {
  const data = [...new FormData(event.currentTarget as HTMLFormElement)].map(
    ([name, value]) => `${name}=${value}`,
  )
  submitted.value = data.join(", ")
}
</script>

<template>
  <div data-slot="stack">
    <form :id="formId" data-slot="stack" @submit.prevent="onSubmit" @reset="submitted = ''">
      <Field>
        <Slider name="price" :default-value="[200, 800]" :max="1000" :step="10">
          <div data-slot="row">
            <FieldLabel>Price</FieldLabel>
            <SliderValue />
          </div>
          <SliderControl>
            <SliderTrack>
              <SliderIndicator />
              <SliderThumb :index="0" aria-label="Minimum price" />
              <SliderThumb :index="1" aria-label="Maximum price" />
            </SliderTrack>
          </SliderControl>
        </Slider>
      </Field>
      <Field>
        <Slider name="rating" :default-value="3" :min="1" :max="5">
          <div data-slot="row">
            <FieldLabel>Minimum rating</FieldLabel>
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
        <button type="submit">Save</button>
        <button type="reset">Reset</button>
      </div>
    </form>
    <Field>
      <Slider
        name="distance"
        :form="formId"
        :default-value="25"
        :max="100"
        :step="5"
        :format="{ style: 'unit', unit: 'kilometer' }"
      >
        <div data-slot="row">
          <FieldLabel>Distance</FieldLabel>
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
    <output v-if="submitted" data-slot="output">Submitted: {{ submitted }}</output>
  </div>
</template>
