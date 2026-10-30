<script setup lang="ts">
import { CalendarIcon, ChevronLeft, ChevronRight } from "@lucide/vue"
import {
  CalendarDay,
  CalendarGrid,
  CalendarHeading,
  CalendarNext,
  CalendarPrevious,
  CalendarWeekday,
  CalendarWeekdays,
  CalendarWeeks,
  DatePickerContent,
  DatePickerInput,
  DatePicker as DatePickerPrimitive,
  DatePickerTrigger,
} from "@ui-sdk/vue/date-picker"
import { cn } from "cn"

const props = defineProps<{ class?: string }>()

const iconButton =
  "inline-flex size-8 shrink-0 cursor-default items-center justify-center rounded-2xl outline-none select-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30 data-disabled:opacity-50 motion-reduce:transition-none [&_svg]:size-4"
</script>

<template>
  <DatePickerPrimitive :class="cn('flex text-sm', props.class)">
    <div
      class="flex h-8 w-full items-center gap-0.5 rounded-2xl border border-transparent bg-input/50 ps-2.5 pe-1 transition-[color,box-shadow] duration-200 has-[input:focus-visible]:border-ring has-[input:focus-visible]:ring-3 has-[input:focus-visible]:ring-ring/30 motion-reduce:transition-none"
    >
      <DatePickerInput
        class="h-full w-full min-w-0 bg-transparent text-base tabular-nums outline-none placeholder:text-muted-foreground md:text-sm"
      />
      <DatePickerTrigger :class="cn(iconButton, 'size-6 rounded-xl text-muted-foreground')">
        <CalendarIcon aria-hidden="true" />
      </DatePickerTrigger>
    </div>
    <DatePickerContent
      class="max-h-(--available-height) origin-(--transform-origin) overflow-y-auto rounded-3xl bg-popover p-3 text-popover-foreground shadow-lg ring-1 ring-foreground/5 outline-none transition-[opacity,scale] duration-100 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 motion-reduce:transition-none dark:ring-foreground/10"
    >
      <div class="flex items-center justify-between gap-2 pb-2">
        <CalendarPrevious :class="iconButton">
          <ChevronLeft aria-hidden="true" class="rtl:rotate-180" />
        </CalendarPrevious>
        <CalendarHeading class="text-sm font-medium" />
        <CalendarNext :class="iconButton">
          <ChevronRight aria-hidden="true" class="rtl:rotate-180" />
        </CalendarNext>
      </div>
      <CalendarGrid class="border-collapse">
        <CalendarWeekdays v-slot="{ index }">
          <CalendarWeekday
            :index="index"
            class="size-8 text-center text-[0.8rem] font-normal text-muted-foreground"
          />
        </CalendarWeekdays>
        <CalendarWeeks v-slot="{ cell }">
          <CalendarDay
            :value="cell.date"
            class="size-8 cursor-default rounded-2xl text-center outline-none select-none transition-colors hover:bg-muted focus-visible:relative focus-visible:ring-3 focus-visible:ring-ring/30 data-today:bg-muted data-today:font-medium data-outside:text-muted-foreground data-disabled:opacity-50 data-selected:bg-primary data-selected:text-primary-foreground motion-reduce:transition-none"
          />
        </CalendarWeeks>
      </CalendarGrid>
    </DatePickerContent>
  </DatePickerPrimitive>
</template>
