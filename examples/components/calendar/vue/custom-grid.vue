<script setup lang="ts">
import {
  Calendar,
  CalendarDay,
  CalendarGrid,
  CalendarHeading,
  CalendarNext,
  CalendarPrevious,
  CalendarWeekday,
} from "@ui-sdk/vue/calendar"
import { ChevronLeftIcon, ChevronRightIcon } from "@lucide/vue"
</script>

<template>
  <Calendar v-slot="{ state }" default-value="2026-10-16">
    <div data-slot="row">
      <CalendarPrevious data-variant="ghost">
        <template #render="{ props, state: step }">
          <button v-bind="props" :title="`Show ${step.month}`">
            <ChevronLeftIcon />
          </button>
        </template>
      </CalendarPrevious>
      <CalendarHeading v-slot="{ state: heading }">
        {{ heading.label }}
      </CalendarHeading>
      <CalendarNext>
        <template #render="{ props }">
          <button data-variant="ghost" v-bind="props">
            <ChevronRightIcon />
          </button>
        </template>
      </CalendarNext>
    </div>
    <CalendarGrid v-slot="{ state: grid }">
      <caption>
        {{
          grid.label
        }}
      </caption>
      <thead>
        <tr>
          <CalendarWeekday
            v-for="(weekday, index) in grid.weekdays as number[]"
            :key="weekday"
            :index="index"
          />
        </tr>
      </thead>
      <tbody>
        <tr v-for="week in grid.weeks" :key="week[0].date">
          <template v-for="cell in week" :key="cell.date">
            <td v-if="cell.hidden"></td>
            <CalendarDay v-else :value="cell.date" />
          </template>
        </tr>
      </tbody>
    </CalendarGrid>
    <p data-slot="hint">
      {{ state.mode }}, {{ state.value ?? "nothing" }} selected in {{ state.month
      }}{{ state.disabled || state.readOnly ? " (locked)" : "" }}
    </p>
  </Calendar>
</template>
