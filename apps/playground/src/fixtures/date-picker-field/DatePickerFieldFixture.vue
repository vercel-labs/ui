<script setup lang="ts">
import {
  DatePicker,
  DatePickerContent,
  DatePickerHint,
  DatePickerInput,
  DatePickerTrigger,
} from "@ui-sdk/vue/date-picker"
import { Field, FieldDescription, FieldError, FieldLabel } from "@ui-sdk/vue/field"
import {
  datePickerFieldFixture as f,
  datePickerFieldOptions,
  datePickerFixture,
} from "tests/fixtures/date-picker.ts"
import { ref } from "vue"

const { required, disabled } = datePickerFieldOptions()
const submitted = ref("")
const shown = ref(true)

function onSubmit(event: Event) {
  submitted.value = JSON.stringify([...new FormData(event.currentTarget as HTMLFormElement)])
}
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <form @submit.prevent="onSubmit">
      <Field class="field" :name="datePickerFixture.name" :disabled="disabled">
        <FieldLabel>{{ f.label }}</FieldLabel>
        <DatePicker v-if="shown" class="date-picker" :today="datePickerFixture.today" :required="required">
          <DatePickerInput />
          <DatePickerTrigger />
          <DatePickerHint class="date-picker-hint" />
          <DatePickerContent class="date-picker-content" />
        </DatePicker>
        <FieldDescription>{{ f.description }}</FieldDescription>
        <FieldError class="field-error" />
      </Field>
      <button type="submit">Submit</button>
      <button type="button" @click="shown = false">Remove date picker</button>
    </form>
    <output role="status" aria-label="Submitted">{{ submitted }}</output>
  </div>
</template>
