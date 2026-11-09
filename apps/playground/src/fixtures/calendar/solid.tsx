import {
  Calendar,
  CalendarGrid,
  CalendarHeading,
  CalendarMonthSelect,
  CalendarNext,
  CalendarPrevious,
  CalendarYearSelect,
  createCalendarController,
  type CalendarValue,
} from "@ui-sdk/solid/calendar"
import { render } from "@solidjs/web"
import { createSignal, Repeat, Show } from "solid-js"
import {
  calendarAction,
  calendarFixture,
  calendarOptions,
} from "tests/fixtures/calendar.ts"

const controller = createCalendarController()

function Fixture() {
  const { controlled, selects, lang, defaultValue, defaultMonth, ...options } =
    calendarOptions()
  const [action, setAction] = createSignal("")
  const [value, setValue] = createSignal<CalendarValue>(defaultValue)
  const [month, setMonth] = createSignal(
    defaultMonth ?? calendarFixture.today.slice(0, 7)
  )
  const f = calendarFixture
  return (
    <div class="fixture" lang={lang}>
      <button>Before</button>
      <Calendar
        class="calendar"
        today={f.today}
        controller={controller}
        {...options}
        value={controlled ? value() : undefined}
        month={controlled ? month() : undefined}
        defaultValue={controlled ? undefined : defaultValue}
        defaultMonth={controlled ? undefined : defaultMonth}
        onValueChange={(next, details) => {
          setValue(next)
          setAction(calendarAction("value", next, details.reason))
        }}
        onMonthChange={(next, details) => {
          setMonth(next)
          setAction(calendarAction("month", next, details.reason))
        }}
      >
        <div class="calendar-header">
          <CalendarPrevious class="calendar-step" />
          <CalendarHeading class="calendar-heading" />
          <Show when={selects}>
            <CalendarMonthSelect />
            <CalendarYearSelect />
          </Show>
          <CalendarNext class="calendar-step" />
        </div>
        <div class="calendar-months">
          <Repeat count={options.months ?? 1}>
            {(offset) => <CalendarGrid offset={offset} class="calendar-grid" />}
          </Repeat>
        </div>
      </Calendar>
      <button onClick={() => controller.focus(f.controller.date)}>
        {f.controller.label}
      </button>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action()}
      </output>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { Fixture, mount }
