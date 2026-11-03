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
} from "@ui-sdk/vue/date-picker"
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "@lucide/vue"
</script>

<template>
  <DatePicker
    locale="en-GB"
    :week-starts-on="1"
    weekday-format="narrow"
    fixed-weeks
    :show-outside-days="false"
    time-zone="Pacific/Kiritimati"
  >
    <div data-slot="row">
      <DatePickerInput aria-label="Start date" />
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
  </DatePicker>
</template>
