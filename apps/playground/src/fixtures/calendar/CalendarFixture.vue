<script setup lang="ts">
import type { ChangeDetails } from "@ui-sdk/core"
import {
  Calendar,
  CalendarGrid,
  CalendarHeading,
  CalendarMonthSelect,
  CalendarNext,
  CalendarPrevious,
  CalendarYearSelect,
  createCalendarController,
  type CalendarValue,
} from "@ui-sdk/vue/calendar"
import {
  calendarAction,
  calendarFixture as f,
  calendarOptions,
} from "tests/fixtures/calendar.ts"
import { ref } from "vue"

const { controlled, selects, lang, defaultValue, defaultMonth, ...options } =
  calendarOptions()
const controller = createCalendarController()
const action = ref("")
const value = ref<CalendarValue>(defaultValue)
const month = ref(defaultMonth ?? f.today.slice(0, 7))

function onValueChange(next: CalendarValue, details: ChangeDetails) {
  value.value = next
  action.value = calendarAction("value", next, details.reason)
}

function onMonthChange(next: string, details: ChangeDetails) {
  month.value = next
  action.value = calendarAction("month", next, details.reason)
}
</script>

<template>
  <div class="fixture" :lang="lang">
    <button>Before</button>
    <Calendar
      class="calendar"
      :today="f.today"
      :controller="controller"
      v-bind="options"
      :value="controlled ? value : undefined"
      :default-value="controlled ? undefined : defaultValue"
      :month="controlled ? month : undefined"
      :default-month="controlled ? undefined : defaultMonth"
      @value-change="onValueChange"
      @month-change="onMonthChange"
    >
      <div class="calendar-header">
        <CalendarPrevious class="calendar-step" />
        <CalendarHeading class="calendar-heading" />
        <template v-if="selects">
          <CalendarMonthSelect />
          <CalendarYearSelect />
        </template>
        <CalendarNext class="calendar-step" />
      </div>
      <div class="calendar-months">
        <CalendarGrid
          v-for="offset in options.months ?? 1"
          :key="offset"
          :offset="offset - 1"
          class="calendar-grid"
        />
      </div>
    </Calendar>
    <button @click="controller.focus(f.controller.date)">
      {{ f.controller.label }}
    </button>
    <button>After</button>
    <output role="status" aria-label="Last action">{{ action }}</output>
  </div>
</template>
