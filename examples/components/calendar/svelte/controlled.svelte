<script lang="ts">
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
    type CalendarMonthChangeReason,
    type CalendarValue,
    type CalendarValueChangeReason,
  } from "@ui-sdk/svelte/calendar"
  import { ChevronLeftIcon, ChevronRightIcon } from "@lucide/svelte"

  let value = $state<CalendarValue>("2026-10-16")
  let month = $state("2026-10")
  let reason = $state("")

  function onChange(_next: unknown, details: { reason: CalendarValueChangeReason | CalendarMonthChangeReason }) {
    reason = details.reason
  }
</script>

<div>
  <Calendar bind:value bind:month onValueChange={onChange} onMonthChange={onChange}>
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
      <CalendarWeekdays>
        {#snippet children(index)}
          <CalendarWeekday {index} />
        {/snippet}
      </CalendarWeekdays>
      <CalendarWeeks>
        {#snippet children(cell)}
          <CalendarDay value={cell.date} />
        {/snippet}
      </CalendarWeeks>
    </CalendarGrid>
  </Calendar>
  <output data-slot="output">
    {String(value)}, showing {month} {reason && `(${reason})`}
  </output>
</div>
