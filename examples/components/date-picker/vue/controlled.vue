<script setup lang="ts">
import {
  CalendarDay,
  CalendarGrid,
  CalendarHeading,
  CalendarNext,
  CalendarPrevious,
  CalendarWeekday,
  CalendarWeekdays,
  CalendarWeeks,
  DatePicker,
  DatePickerContent,
  DatePickerHint,
  DatePickerInput,
  DatePickerTrigger,
  type DatePickerValue,
  type DatePickerValueChangeReason,
} from "@ui-sdk/vue/date-picker"
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "@lucide/vue"
import { ref } from "vue"

const value = ref<DatePickerValue>("2026-10-16")
const reason = ref("initial")

function onValueChange(_next: DatePickerValue, details: { reason: DatePickerValueChangeReason }) {
  reason.value = details.reason
}
</script>

<template>
  <DatePicker v-model:value="value" @value-change="onValueChange">
    <div data-slot="row">
      <DatePickerInput aria-label="Due date" />
      <DatePickerTrigger>
        <CalendarIcon />
      </DatePickerTrigger>
    </div>
    <DatePickerHint />
    <DatePickerContent>
      <div data-slot="row">
        <CalendarPrevious data-variant="ghost">
          <ChevronLeftIcon />
        </CalendarPrevious>
        <CalendarHeading />
        <CalendarNext data-variant="ghost">
          <ChevronRightIcon />
        </CalendarNext>
      </div>
      <CalendarGrid>
        <CalendarWeekdays v-slot="{ index }">
          <CalendarWeekday :index="index" />
        </CalendarWeekdays>
        <CalendarWeeks v-slot="{ cell }">
          <CalendarDay :value="cell.date" />
        </CalendarWeeks>
      </CalendarGrid>
    </DatePickerContent>
    <p data-slot="hint">{{ value ?? "No date" }} ({{ reason }})</p>
  </DatePicker>
</template>
