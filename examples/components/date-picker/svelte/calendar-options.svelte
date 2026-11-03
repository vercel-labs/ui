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
  } from "@ui-sdk/svelte/date-picker"
  import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "@lucide/svelte"
</script>

<DatePicker
  locale="en-GB"
  weekStartsOn={1}
  weekdayFormat="narrow"
  fixedWeeks
  showOutsideDays={false}
  timeZone="Pacific/Kiritimati"
>
  <div data-slot="row">
    <DatePickerInput aria-label="Start date" />
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
</DatePicker>
