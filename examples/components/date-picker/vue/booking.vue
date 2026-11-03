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
import { ref } from "vue"

const submitted = ref("")

function submit(event: Event) {
  const data = [...new FormData(event.currentTarget as HTMLFormElement)].map(
    ([name, value]) => `${name}=${value}`,
  )
  submitted.value = data.join("&")
}
</script>

<template>
  <div data-slot="stack">
    <DatePicker
      mode="range"
      :months="2"
      page-by="page"
      :min-days="2"
      :max-days="14"
      :unavailable="['2026-10-24']"
      allow-unavailable
      start-name="checkin"
      end-name="checkout"
      form="booking"
      default-month="2026-10"
    >
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
    <form id="booking" @submit.prevent="submit">
      <button type="submit">Book</button>
    </form>
    <p data-slot="hint">
      {{ submitted || "Ranges include 2 to 14 days, and may cross the booked 24th." }}
    </p>
  </div>
</template>
