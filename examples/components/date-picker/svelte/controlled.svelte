<script lang="ts">
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
    type DatePickerValue,
    type DatePickerValueChangeReason,
  } from "@ui-sdk/svelte/date-picker"
  import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "@lucide/svelte"

  let value = $state<DatePickerValue>("2026-10-16")
  let reason = $state("initial")

  function onValueChange(_next: DatePickerValue, details: { reason: DatePickerValueChangeReason }) {
    reason = details.reason
  }
</script>

<DatePicker bind:value {onValueChange}>
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
  </DatePickerContent>
  <p data-slot="hint">{value ?? "No date"} ({reason})</p>
</DatePicker>
