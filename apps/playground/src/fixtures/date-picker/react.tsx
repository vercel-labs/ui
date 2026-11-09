import {
  DatePicker,
  DatePickerClear,
  DatePickerContent,
  DatePickerHint,
  DatePickerInput,
  DatePickerPreset,
  DatePickerTrigger,
  CalendarGrid,
  CalendarHeading,
  CalendarNext,
  CalendarPrevious,
} from "@ui-sdk/react/date-picker"
import * as React from "react"
import { createRoot } from "react-dom/client"
import {
  datePickerAction,
  datePickerFixture,
  datePickerOptions,
} from "tests/fixtures/date-picker.ts"

function Fixture() {
  const { lang, ...options } = datePickerOptions()
  const [action, setAction] = React.useState("")
  const [submitted, setSubmitted] = React.useState("")
  const f = datePickerFixture
  const range = options.mode === "range"
  const preset = range ? f.rangePreset : f.preset
  return (
    <div className="fixture" lang={lang}>
      <button>Before</button>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          setSubmitted(JSON.stringify([...new FormData(event.currentTarget)]))
        }}
      >
        <label htmlFor="date-start">{range ? "Stay" : "Due date"}</label>
        <DatePicker
          className="date-picker"
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
          {range && <DatePickerInput end aria-label="End date" />}
          <DatePickerTrigger />
          <DatePickerClear>Clear</DatePickerClear>
          <DatePickerHint className="date-picker-hint" />
          <DatePickerContent className="date-picker-content">
            <div className="calendar-header">
              <CalendarPrevious className="calendar-step" />
              <CalendarHeading className="calendar-heading" />
              <CalendarNext className="calendar-step" />
            </div>
            <CalendarGrid className="calendar-grid" />
            <DatePickerPreset value={preset.value as never}>
              {preset.label}
            </DatePickerPreset>
          </DatePickerContent>
        </DatePicker>
        <button type="submit">Submit</button>
        <button type="reset">Reset</button>
      </form>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action}
      </output>
      <output role="status" aria-label="Submitted">
        {submitted}
      </output>
    </div>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(
    <React.StrictMode>
      <Fixture />
    </React.StrictMode>
  )
}

export { Fixture, mount }
