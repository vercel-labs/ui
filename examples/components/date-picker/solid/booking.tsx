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
  DatePickerInput,
  DatePickerTrigger,
} from "@ui-sdk/solid/date-picker"
import { createSignal } from "solid-js"

function Example() {
  const [submitted, setSubmitted] = createSignal("")
  return (
    <div data-slot="stack">
      <DatePicker
        mode="range"
        months={2}
        pageBy="page"
        minDays={2}
        maxDays={14}
        unavailable={["2026-10-24"]}
        allowUnavailable
        startName="checkin"
        endName="checkout"
        form="booking"
        defaultMonth="2026-10"
      >
        <div data-slot="row">
          <DatePickerInput aria-label="Check in" />
          <span data-slot="hint">–</span>
          <DatePickerInput end aria-label="Check out" />
          <DatePickerTrigger data-variant="ghost">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M8 2v3" />
              <path d="M16 2v3" />
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18" />
            </svg>
          </DatePickerTrigger>
        </div>
        <DatePickerContent>
          <div data-slot="row">
            <CalendarPrevious data-variant="ghost">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </CalendarPrevious>
            <CalendarHeading />
            <CalendarNext data-variant="ghost">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </CalendarNext>
          </div>
          <div data-slot="stack">
            <CalendarGrid>
              <CalendarWeekdays>{(index) => <CalendarWeekday index={index} />}</CalendarWeekdays>
              <CalendarWeeks>{(cell) => <CalendarDay value={cell.date} />}</CalendarWeeks>
            </CalendarGrid>
            <CalendarGrid offset={1}>
              <CalendarWeekdays>{(index) => <CalendarWeekday index={index} />}</CalendarWeekdays>
              <CalendarWeeks>{(cell) => <CalendarDay value={cell.date} />}</CalendarWeeks>
            </CalendarGrid>
          </div>
        </DatePickerContent>
      </DatePicker>
      <form
        id="booking"
        onSubmit={(event) => {
          event.preventDefault()
          const data = [...new FormData(event.currentTarget)].map(([name, value]) => `${name}=${value}`)
          setSubmitted(data.join("&"))
        }}
      >
        <button type="submit">Book</button>
      </form>
      <p data-slot="hint">{submitted() || "Ranges include 2 to 14 days, and may cross the booked 24th."}</p>
    </div>
  )
}

export { Example }
