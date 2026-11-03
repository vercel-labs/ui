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
  createDatePickerController,
  DatePicker,
  DatePickerContent,
  DatePickerHint,
  DatePickerInput,
  DatePickerTrigger,
} from "@ui-sdk/vue/date-picker"
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "@lucide/vue"

const controller = createDatePickerController()
</script>

<template>
  <DatePicker :controller="controller" default-value="2026-10-16">
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
    <div data-slot="row">
      <button type="button" @click="controller.setValue('2026-12-25')">Christmas</button>
      <button type="button" @click="controller.open()">Open</button>
    </div>
  </DatePicker>
</template>
