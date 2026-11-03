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

  let submitted = $state("")

  function submit(event: SubmitEvent) {
    event.preventDefault()
    submitted = new FormData(event.currentTarget as HTMLFormElement).get("due") as string
  }
</script>

<form data-slot="stack" onsubmit={submit}>
  <DatePicker name="due" required>
    <div data-slot="row">
      <DatePickerInput aria-label="Due date" />
      <DatePickerTrigger data-variant="ghost">
        <CalendarIcon aria-hidden="true" />
      </DatePickerTrigger>
    </div>
    <DatePickerHint />
    <DatePickerContent>
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
  <button type="submit">
    Submit
  </button>
  <p data-slot="hint">Submitted: {submitted || "nothing yet"}</p>
</form>
