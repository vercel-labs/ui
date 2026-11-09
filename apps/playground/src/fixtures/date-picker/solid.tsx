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
} from "@ui-sdk/solid/date-picker"
import { render } from "@solidjs/web"
import { createSignal, Show } from "solid-js"
import {
  datePickerAction,
  datePickerFixture,
  datePickerOptions,
} from "tests/fixtures/date-picker.ts"

function Fixture() {
  const { lang, ...options } = datePickerOptions()
  const [action, setAction] = createSignal("")
  const [submitted, setSubmitted] = createSignal("")
  const f = datePickerFixture
  const range = options.mode === "range"
  const preset = range ? f.rangePreset : f.preset
  return (
    <div class="fixture" lang={lang}>
      <button>Before</button>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          setSubmitted(JSON.stringify([...new FormData(event.currentTarget)]))
        }}
      >
        <label for="date-start">{range ? "Stay" : "Due date"}</label>
        <DatePicker
          class="date-picker"
          today={f.today}
          name={range ? undefined : f.name}
          startName={range ? "start" : undefined}
          endName={range ? "end" : undefined}
          {...options}
          onValueChange={(next, details) =>
            setAction(datePickerAction("value", next, details.reason))
          }
          onOpenChange={(next, details) =>
            setAction(datePickerAction("open", next, details.reason))
          }
        >
          <DatePickerInput
            id="date-start"
            aria-label={range ? "Start date" : undefined}
          />
          <Show when={range}>
            <DatePickerInput end aria-label="End date" />
          </Show>
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
            <DatePickerPreset value={preset.value as DatePickerValue}>
              {preset.label}
            </DatePickerPreset>
          </DatePickerContent>
        </DatePicker>
        <button type="submit">Submit</button>
        <button type="reset">Reset</button>
      </form>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action()}
      </output>
      <output role="status" aria-label="Submitted">
        {submitted()}
      </output>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { Fixture, mount }
