<script lang="ts">
  import {
    CalendarGrid,
    CalendarHeading,
    CalendarNext,
    CalendarPrevious,
    DatePicker,
    DatePickerClear,
    DatePickerContent,
    DatePickerHint,
    DatePickerInput,
    DatePickerPreset,
    DatePickerTrigger,
    type DatePickerValue,
  } from "@ui-sdk/svelte/date-picker"
  import {
    datePickerAction,
    datePickerFixture as f,
    datePickerOptions,
  } from "tests/fixtures/date-picker.ts"

  const { lang, ...options } = datePickerOptions()
  const range = options.mode === "range"
  const preset = range ? f.rangePreset : f.preset
  let action = $state("")
  let submitted = $state("")

  function onSubmit(event: SubmitEvent) {
    event.preventDefault()
    submitted = JSON.stringify([
      ...new FormData(event.currentTarget as HTMLFormElement),
    ])
  }
</script>

<div class="fixture" {lang}>
  <button>Before</button>
  <form onsubmit={onSubmit}>
    <label for="date-start">{range ? "Stay" : "Due date"}</label>
    <DatePicker
      class="date-picker"
      today={f.today}
      name={range ? undefined : f.name}
      startName={range ? "start" : undefined}
      endName={range ? "end" : undefined}
      {...options}
      onValueChange={(next, details) =>
        (action = datePickerAction("value", next, details.reason))}
      onOpenChange={(next, details) =>
        (action = datePickerAction("open", next, details.reason))}
    >
      <DatePickerInput
        id="date-start"
        aria-label={range ? "Start date" : undefined}
      />
      {#if range}<DatePickerInput end aria-label="End date" />{/if}
      <DatePickerTrigger />
      <DatePickerClear>Clear</DatePickerClear>
      <DatePickerHint class="date-picker-hint" />
      <DatePickerContent class="date-picker-content">
        <div class="calendar-header">
          <CalendarPrevious class="calendar-step" />
          <CalendarHeading class="calendar-heading" />
          <CalendarNext class="calendar-step" />
        </div>
        <CalendarGrid class="calendar-grid" />
        <DatePickerPreset value={preset.value as DatePickerValue}
          >{preset.label}</DatePickerPreset
        >
      </DatePickerContent>
    </DatePicker>
    <button type="submit">Submit</button>
    <button type="reset">Reset</button>
  </form>
  <button>After</button>
  <output role="status" aria-label="Last action">{action}</output>
  <output role="status" aria-label="Submitted">{submitted}</output>
</div>
