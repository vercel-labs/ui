<script setup lang="ts">
import type { ChangeDetails } from "@ui-sdk/core"
import { createDateInputController, DateInput, Field, FieldError, FieldLabel, TimeInput } from "@ui-sdk/vue"
import { dateInputAction, dateInputFixture as f, dateInputOptions } from "tests/fixtures/date-input.ts"
import { ref } from "vue"

const controller = createDateInputController()
const { date, time, cancel, ...shared } = dateInputOptions()
const action = ref("")
const submitted = ref("")

function onDateChange(value: string | null, details: ChangeDetails) {
  if (cancel && value === cancel) return details.cancel()
  action.value = dateInputAction.change("date", value, details.reason)
}

function onTimeChange(value: string | null, details: ChangeDetails) {
  action.value = dateInputAction.change("time", value, details.reason)
}

function onSubmit(event: SubmitEvent) {
  submitted.value = JSON.stringify([...new FormData(event.currentTarget as HTMLFormElement)])
}
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <form :aria-label="f.form.label" @submit.prevent="onSubmit">
      <Field class="field" :name="f.date.name">
        <FieldLabel>{{ f.date.label }}</FieldLabel>
        <DateInput
          class="date-input"
          :controller="controller"
          v-bind="{ ...date, ...shared }"
          @value-change="onDateChange"
        />
        <FieldError class="field-error" />
      </Field>
      <Field class="field" :name="f.time.name">
        <FieldLabel>{{ f.time.label }}</FieldLabel>
        <TimeInput class="date-input" v-bind="{ ...time, ...shared }" @value-change="onTimeChange" />
      </Field>
      <button type="submit">{{ f.form.submit }}</button>
      <button type="reset">{{ f.form.reset }}</button>
    </form>
    <button @click="controller.setValue(f.filled)">Set date</button>
    <button @click="controller.clear()">Clear date</button>
    <button>After</button>
    <output role="status" aria-label="Last action">{{ action }}</output>
    <output aria-label="Submitted">{{ submitted }}</output>
  </div>
</template>
