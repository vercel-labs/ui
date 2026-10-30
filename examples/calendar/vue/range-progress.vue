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
import { ref } from "vue"

const anchor = ref<string | null>(null)
const focused = ref<string | null>(null)
</script>

<template>
  <div>
    <Calendar
      mode="range"
      @anchor-change="anchor = $event"
      @focused-change="focused = $event"
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
            class="size-8 cursor-default rounded-2xl p-0 text-center align-middle text-sm leading-5 outline-none select-none transition-[color,background-color,box-shadow] hover:bg-muted focus-visible:relative focus-visible:z-10 focus-visible:ring-3 focus-visible:ring-ring/30 data-today:bg-muted data-today:font-medium data-outside:text-muted-foreground data-disabled:text-muted-foreground data-disabled:opacity-50 data-selected:bg-primary data-selected:text-primary-foreground data-range-start:not-data-range-end:rounded-e-none data-range-end:not-data-range-start:rounded-s-none data-range-middle:rounded-none data-range-middle:bg-muted data-range-middle:text-foreground"
          />
        </CalendarWeeks>
      </CalendarGrid>
    </Calendar>
    <output class="mt-3 block min-h-5 text-sm leading-5 text-muted-foreground">
      {{ anchor ? `Started on ${anchor}, focus on ${focused}` : `Focus on ${focused ?? "no date yet"}` }}
    </output>
  </div>
</template>
