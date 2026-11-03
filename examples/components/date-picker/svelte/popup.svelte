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
    type DatePickerMonthChangeReason,
    type DatePickerOpenChangeReason,
  } from "@ui-sdk/svelte/date-picker"
  import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "@lucide/svelte"

  let log = $state("")
  let anchor: HTMLElement | undefined = $state()
  let container: HTMLElement | undefined = $state()

  function onOpenChange(open: boolean, details: { reason: DatePickerOpenChangeReason }) {
    log = `${open ? "Opened" : "Closed"} (${details.reason})`
  }

  function onOpenChangeComplete(open: boolean) {
    if (!open) log = `${log}, done`
  }

  function onMonthChange(month: string, details: { reason: DatePickerMonthChangeReason }) {
    log = `Showing ${month} (${details.reason})`
  }
</script>

<div data-slot="stack">
  <DatePicker
    defaultOpen={false}
    presentation="auto"
    {container}
    {onOpenChange}
    {onOpenChangeComplete}
    {onMonthChange}
  >
    <div data-slot="row" bind:this={anchor}>
      <DatePickerInput aria-label="Due date" />
      <DatePickerTrigger data-variant="ghost">
        <CalendarIcon aria-hidden="true" />
      </DatePickerTrigger>
    </div>
    <DatePickerHint />
    <DatePickerContent
      side="top"
      align="end"
      sideOffset={8}
      alignOffset={-4}
      collisionPadding={16}
      {anchor}
      finalFocus="none"
      keepMounted
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
  </DatePicker>
  <div bind:this={container}></div>
  <p data-slot="hint">{log || "Opens above, lined up with the end of the field."}</p>
</div>
