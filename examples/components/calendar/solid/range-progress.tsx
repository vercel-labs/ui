import {
  Calendar,
  CalendarDay,
  CalendarGrid,
  CalendarHeading,
  CalendarNext,
  CalendarPrevious,
  CalendarWeekday,
  CalendarWeekdays,
  CalendarWeeks,
} from "@ui-sdk/solid/calendar"
import { createSignal } from "solid-js"

function Example() {
  const [range, setRange] = createSignal<{ anchor: string | null; focused: string | null }>({
    anchor: null,
    focused: null,
  })
  return (
    <div>
      <Calendar
        mode="range"
        onAnchorChange={(anchor) => setRange((current) => ({ ...current, anchor }))}
        onFocusedChange={(focused) => setRange((current) => ({ ...current, focused }))}
      >
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
        <CalendarGrid>
          <CalendarWeekdays>{(index) => <CalendarWeekday index={index} />}</CalendarWeekdays>
          <CalendarWeeks>{(cell) => <CalendarDay value={cell.date} />}</CalendarWeeks>
        </CalendarGrid>
      </Calendar>
      <output data-slot="output">
        {range().anchor
          ? `Started on ${range().anchor}, focus on ${range().focused}`
          : `Focus on ${range().focused ?? "no date yet"}`}
      </output>
    </div>
  )
}

export { Example }
