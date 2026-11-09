<script setup lang="ts">
import type { ChangeDetails } from "@ui-sdk/core"
import {
  CalendarGrid,
  CalendarHeading,
  CalendarNext,
  CalendarPrevious,
  DatePicker,
  DatePickerClear,
  DatePickerContent,
  DatePickerHint,
  DatePickerInput,
  DatePickerPreset,
  DatePickerTrigger,
  type DatePickerValue,
} from "@ui-sdk/vue/date-picker"
import {
  datePickerAction,
  datePickerFixture as f,
  datePickerOptions,
} from "tests/fixtures/date-picker.ts"
import { ref } from "vue"

const { lang, ...options } = datePickerOptions()
const action = ref("")
const submitted = ref("")
const range = options.mode === "range"
const preset = range ? f.rangePreset : f.preset

function onValueChange(next: DatePickerValue, details: ChangeDetails) {
  action.value = datePickerAction("value", next, details.reason)
}

function onOpenChange(next: boolean, details: ChangeDetails) {
  action.value = datePickerAction("open", next, details.reason)
}

function onSubmit(event: Event) {
  submitted.value = JSON.stringify([
    ...new FormData(event.currentTarget as HTMLFormElement),
  ])
}
</script>

<template>
  <div class="fixture" :lang="lang">
    <button>Before</button>
    <form @submit.prevent="onSubmit">
      <label for="date-start">{{ range ? "Stay" : "Due date" }}</label>
      <DatePicker
        class="date-picker"
        :today="f.today"
        :name="range ? undefined : f.name"
        :start-name="range ? 'start' : undefined"
        :end-name="range ? 'end' : undefined"
        v-bind="options"
        @value-change="onValueChange"
        @open-change="onOpenChange"
      >
        <DatePickerInput
          id="date-start"
          :aria-label="range ? 'Start date' : undefined"
        />
        <DatePickerInput v-if="range" end aria-label="End date" />
        <DatePickerTrigger />
        <DatePickerClear>Clear</DatePickerClear>
        <DatePickerHint class="date-picker-hint" />
        <DatePickerContent class="date-picker-content">
          <div class="calendar-header">
            <CalendarPrevious class="calendar-step" />
            <CalendarHeading class="calendar-heading" />
            <CalendarNext class="calendar-step" />
          </div>
          <CalendarGrid class="calendar-grid" />
          <DatePickerPreset :value="preset.value as DatePickerValue">{{
            preset.label
          }}</DatePickerPreset>
        </DatePickerContent>
      </DatePicker>
      <button type="submit">Submit</button>
      <button type="reset">Reset</button>
    </form>
    <button>After</button>
    <output role="status" aria-label="Last action">{{ action }}</output>
    <output role="status" aria-label="Submitted">{{ submitted }}</output>
  </div>
</template>
