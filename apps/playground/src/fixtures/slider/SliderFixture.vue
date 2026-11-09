<script setup lang="ts">
import {
  Field,
  FieldDescription,
  FieldLabel,
  Slider,
  SliderControl,
  SliderIndicator,
  SliderThumb,
  SliderTrack,
  SliderValue,
} from "@ui-sdk/vue"
import {
  serialize,
  sliderFixture as f,
  sliderOptions,
} from "tests/fixtures/slider.ts"
import { ref } from "vue"

const options = sliderOptions()
const action = ref("")
const commits = ref<string[]>([])
const submitted = ref("")
const volume = ref<number | number[]>(options.volume)
const shared = {
  orientation: options.orientation,
  disabled: options.disabled,
  largeStep: options.largeStep,
  locale: options.locale,
}

// Records a change, or cancels it when the URL asks.
function report(
  name: string,
  value: number | number[],
  details: { cancel: () => void }
) {
  if (options.cancel === name) {
    return details.cancel()
  }
  action.value = `${name}:${String(value)}`
}

function commit(name: string, value: number | number[]) {
  commits.value = [...commits.value, `${name}:${String(value)}`]
}

function onVolume(value: number | number[], details: { cancel: () => void }) {
  report(f.volume.name, value, details)
}

function onPrice(value: number | number[], details: { cancel: () => void }) {
  report(f.price.name, value, details)
}

function onVolumeCommit(value: number | number[]) {
  commit(f.volume.name, value)
}

function onPriceCommit(value: number | number[]) {
  commit(f.price.name, value)
}

function onSubmit(event: Event) {
  submitted.value = serialize(event.currentTarget as HTMLFormElement)
}
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <form class="form" :aria-label="f.formLabel" @submit.prevent="onSubmit">
      <Field>
        <FieldLabel>{{ f.volume.label }}</FieldLabel>
        <Slider
          v-bind="shared"
          :name="f.volume.name"
          :format="options.volumeFormat"
          :value="options.controlled ? volume : undefined"
          :default-value="options.controlled ? undefined : options.volume"
          @value-change="onVolume"
          @update:value="(next) => (volume = next)"
          @value-commit="onVolumeCommit"
        >
          <SliderValue class="slider-value" />
          <SliderControl class="slider-control">
            <SliderTrack class="slider-track">
              <SliderIndicator class="slider-indicator" />
              <SliderThumb class="slider-thumb" />
            </SliderTrack>
          </SliderControl>
        </Slider>
        <FieldDescription>{{ f.volume.description }}</FieldDescription>
      </Field>

      <Field>
        <FieldLabel>{{ f.price.label }}</FieldLabel>
        <Slider
          v-bind="shared"
          :name="f.price.name"
          :default-value="options.price"
          :min-steps-between-thumbs="options.minSteps"
          :format="options.format"
          @value-change="onPrice"
          @value-commit="onPriceCommit"
        >
          <SliderValue class="slider-value" />
          <SliderControl class="slider-control">
            <SliderTrack class="slider-track">
              <SliderIndicator class="slider-indicator" />
              <SliderThumb
                v-for="(label, index) in f.price.thumbs"
                :key="label"
                :index="index"
                class="slider-thumb"
                :aria-label="label"
              />
            </SliderTrack>
          </SliderControl>
        </Slider>
      </Field>

      <div class="row">
        <button type="submit">Save</button>
        <button type="reset">Reset</button>
      </div>
    </form>
    <button>After</button>
    <output role="status" aria-label="Last action">{{ action }}</output>
    <output role="status" aria-label="Committed">{{
      commits.join(" ")
    }}</output>
    <output role="status" aria-label="Submitted">{{ submitted }}</output>
  </div>
</template>
