<script setup lang="ts">
import {
  Calendar,
  CalendarDay,
  CalendarGrid,
  CalendarHeading,
  CalendarNext,
  CalendarPrevious,
  CalendarWeekday,
  CalendarWeekdays,
  CalendarWeeks,
} from "@ui-sdk/vue/calendar"
import { ChevronLeft, ChevronRight } from "@lucide/vue"
</script>

<template>
  <Calendar
    mode="range"
    :min-days="3"
    :max-days="8"
    :unavailable="{ from: '2026-10-17', to: '2026-10-18' }"
    allow-unavailable
    class="min-h-72 w-fit max-w-full rounded-3xl border border-border bg-background p-3 text-sm leading-5 text-foreground"
  >
    <div class="flex h-10 items-center justify-between gap-2 pb-2">
      <CalendarPrevious
        class="inline-flex size-8 cursor-default shrink-0 items-center justify-center rounded-2xl border border-transparent bg-transparent p-0 outline-none select-none transition-[color,background-color,box-shadow] hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 data-disabled:pointer-events-none data-disabled:opacity-50"
      >
        <ChevronLeft aria-hidden="true" class="pointer-events-none block size-4 shrink-0 rtl:rotate-180" />
      </CalendarPrevious>
      <CalendarHeading class="m-0 text-sm leading-5 font-medium" />
      <CalendarNext
        class="inline-flex size-8 cursor-default shrink-0 items-center justify-center rounded-2xl border border-transparent bg-transparent p-0 outline-none select-none transition-[color,background-color,box-shadow] hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 data-disabled:pointer-events-none data-disabled:opacity-50"
      >
        <ChevronRight aria-hidden="true" class="pointer-events-none block size-4 shrink-0 rtl:rotate-180" />
      </CalendarNext>
    </div>
    <CalendarGrid class="border-collapse">
      <CalendarWeekdays v-slot="{ index }">
        <CalendarWeekday
          :index="index"
          class="size-8 p-0 text-center align-middle text-[0.8rem] leading-5 font-normal text-muted-foreground"
        />
      </CalendarWeekdays>
      <CalendarWeeks v-slot="{ cell }">
        <CalendarDay
          :value="cell.date"
          class="size-8 cursor-default rounded-2xl p-0 text-center align-middle text-sm leading-5 outline-none select-none focus-visible:relative focus-visible:z-10 focus-visible:ring-3 focus-visible:ring-ring/30 data-range-start:bg-primary data-range-start:text-primary-foreground data-range-end:bg-primary data-range-end:text-primary-foreground data-range-middle:rounded-none data-range-middle:bg-muted not-data-selected:hover:bg-muted not-data-selected:data-unavailable:text-muted-foreground not-data-selected:data-unavailable:line-through data-disabled:text-muted-foreground data-disabled:opacity-50"
        />
      </CalendarWeeks>
    </CalendarGrid>
  </Calendar>
</template>
