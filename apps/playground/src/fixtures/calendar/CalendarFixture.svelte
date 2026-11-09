<script lang="ts">
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
  } from "@ui-sdk/svelte/calendar"
  import {
    calendarAction,
    calendarFixture as f,
    calendarOptions,
  } from "tests/fixtures/calendar.ts"

  const { controlled, selects, lang, defaultValue, defaultMonth, ...options } =
    calendarOptions()
  const controller = createCalendarController()
  const offsets = Array.from(
    { length: options.months ?? 1 },
    (_, offset) => offset
  )
  let action = $state("")
  let value = $state<CalendarValue>(defaultValue)
  let month = $state(defaultMonth ?? f.today.slice(0, 7))

  function onValueChange(next: CalendarValue, details: ChangeDetails) {
    value = next
    action = calendarAction("value", next, details.reason)
  }

  function onMonthChange(next: string, details: ChangeDetails) {
    month = next
    action = calendarAction("month", next, details.reason)
  }
</script>

<div class="fixture" {lang}>
  <button>Before</button>
  <Calendar
    class="calendar"
    today={f.today}
    {controller}
    {...options}
    value={controlled ? value : undefined}
    month={controlled ? month : undefined}
    defaultValue={controlled ? undefined : defaultValue}
    defaultMonth={controlled ? undefined : defaultMonth}
    {onValueChange}
    {onMonthChange}
  >
    <div class="calendar-header">
      <CalendarPrevious class="calendar-step" />
      <CalendarHeading class="calendar-heading" />
      {#if selects}
        <CalendarMonthSelect />
        <CalendarYearSelect />
      {/if}
      <CalendarNext class="calendar-step" />
    </div>
    <div class="calendar-months">
      {#each offsets as offset (offset)}
        <CalendarGrid {offset} class="calendar-grid" />
      {/each}
    </div>
  </Calendar>
  <button onclick={() => controller.focus(f.controller.date)}
    >{f.controller.label}</button
  >
  <button>After</button>
  <output role="status" aria-label="Last action">{action}</output>
</div>
