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
  type DatePickerMonthChangeReason,
  type DatePickerOpenChangeReason,
} from "@ui-sdk/vue/date-picker"
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "@lucide/vue"
import { ref } from "vue"

const log = ref("")
const anchor = ref<HTMLElement | null>(null)
const container = ref<HTMLElement | null>(null)

function onOpenChange(open: boolean, details: { reason: DatePickerOpenChangeReason }) {
  log.value = `${open ? "Opened" : "Closed"} (${details.reason})`
}

function onOpenChangeComplete(open: boolean) {
  if (!open) log.value = `${log.value}, done`
}

function onMonthChange(month: string, details: { reason: DatePickerMonthChangeReason }) {
  log.value = `Showing ${month} (${details.reason})`
}
</script>

<template>
  <div data-slot="stack">
    <DatePicker
      :default-open="false"
      presentation="auto"
      :container="container"
      @open-change="onOpenChange"
      @open-change-complete="onOpenChangeComplete"
      @month-change="onMonthChange"
    >
      <div data-slot="row" ref="anchor">
        <DatePickerInput aria-label="Due date" />
        <DatePickerTrigger data-variant="ghost">
          <CalendarIcon aria-hidden="true" />
        </DatePickerTrigger>
      </div>
      <DatePickerHint />
      <DatePickerContent
        side="top"
        align="end"
        :side-offset="8"
        :align-offset="-4"
        :collision-padding="16"
        :anchor="anchor"
        final-focus="none"
        keep-mounted
      >
        <div data-slot="row">
          <CalendarPrevious data-variant="ghost">
            <ChevronLeftIcon aria-hidden="true" />
          </CalendarPrevious>
          <CalendarHeading />
          <CalendarNext data-variant="ghost">
            <ChevronRightIcon aria-hidden="true" />
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
    <div ref="container" />
    <p data-slot="hint">
      {{ log || "Opens above, lined up with the end of the field." }}
    </p>
  </div>
</template>
