<script setup lang="ts">
import {
  createSegmentedControlController,
  SegmentedControl,
  SegmentedControlIndicator,
  SegmentedControlItem,
} from "@ui-sdk/vue"
import { segmentedControlOptions } from "tests/fixtures/page.ts"
import { segmentedControlFixture } from "tests/fixtures/segmented-control.ts"
import { ref } from "vue"

const controller = createSegmentedControlController()
const { cancel, ...options } = segmentedControlOptions()

const action = ref("")
const submitted = ref("")

function onValueChange(
  value: string | null,
  details: { reason: string; cancel: () => void }
) {
  if (value === cancel) {
    return details.cancel()
  }
  action.value = `${value}:${details.reason}`
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
    <SegmentedControl
      :aria-label="segmentedControlFixture.label"
      :name="segmentedControlFixture.name"
      v-bind="options"
      :controller="controller"
      @value-change="onValueChange"
    >
      <SegmentedControlIndicator />
      <SegmentedControlItem
        v-for="item in segmentedControlFixture.items"
        :key="item.value"
        :value="item.value"
        :disabled="item.disabled"
      >
        {{ item.label }}
      </SegmentedControlItem>
    </SegmentedControl>
    <button type="button">After</button>
    <button type="submit">Save</button>
    <button type="reset">Reset</button>
    <button type="button" @click="controller.setValue('calendar')">
      Show calendar
    </button>
    <output role="status" aria-label="Last action">{{ action }}</output>
    <output aria-label="Submitted">{{ submitted }}</output>
  </form>
</template>
