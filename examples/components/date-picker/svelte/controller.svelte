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
    createDatePickerController,
    DatePicker,
    DatePickerContent,
    DatePickerHint,
    DatePickerInput,
    DatePickerTrigger,
  } from "@ui-sdk/svelte/date-picker"
  import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "@lucide/svelte"

  const controller = createDatePickerController()
</script>

<DatePicker {controller} defaultValue="2026-10-16">
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
  <div data-slot="row">
    <button type="button" onclick={() => controller.setValue("2026-12-25")}>
      Christmas
    </button>
    <button type="button" onclick={() => controller.open()}>
      Open
    </button>
  </div>
</DatePicker>
