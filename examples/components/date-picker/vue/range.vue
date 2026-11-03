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
  DatePickerInput,
  DatePickerTrigger,
} from "@ui-sdk/vue/date-picker"
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "@lucide/vue"
</script>

<template>
  <DatePicker mode="range" :months="2" :default-value="['2026-10-12', '2026-10-16']">
    <div data-slot="row">
      <DatePickerInput aria-label="Check in" />
      <span data-slot="hint">–</span>
      <DatePickerInput end aria-label="Check out" />
      <DatePickerTrigger data-variant="ghost">
        <CalendarIcon aria-hidden="true" />
      </DatePickerTrigger>
    </div>
    <DatePickerContent>
      <div data-slot="row">
        <CalendarPrevious data-variant="ghost">
          <ChevronLeftIcon aria-hidden="true" />
        </CalendarPrevious>
        <CalendarHeading />
        <CalendarNext data-variant="ghost">
          <ChevronRightIcon aria-hidden="true" />
        </CalendarNext>
      </div>
      <div data-slot="stack">
        <CalendarGrid>
          <CalendarWeekdays v-slot="{ index }">
            <CalendarWeekday :index="index" />
          </CalendarWeekdays>
          <CalendarWeeks v-slot="{ cell }">
            <CalendarDay :value="cell.date" />
          </CalendarWeeks>
        </CalendarGrid>
        <CalendarGrid :offset="1">
          <CalendarWeekdays v-slot="{ index }">
            <CalendarWeekday :index="index" />
          </CalendarWeekdays>
          <CalendarWeeks v-slot="{ cell }">
            <CalendarDay :value="cell.date" />
          </CalendarWeeks>
        </CalendarGrid>
      </div>
    </DatePickerContent>
  </DatePicker>
</template>
