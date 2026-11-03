import {
  Calendar,
  CalendarDay,
  CalendarGrid,
  CalendarHeading,
  CalendarNext,
  CalendarPrevious,
  CalendarWeekday,
} from "@ui-sdk/react/calendar"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

export function Example() {
  return (
    <Calendar defaultValue="2026-10-16">
      {(state) => (
        <>
          <div data-slot="row">
            <CalendarPrevious
              data-variant="ghost"
              render={(props, step) => <button {...props} title={`Show ${step.month}`} />}
            >
              <ChevronLeftIcon />
            </CalendarPrevious>
            <CalendarHeading>{(heading) => heading.label}</CalendarHeading>
            <CalendarNext data-variant="ghost">
              <ChevronRightIcon />
            </CalendarNext>
          </div>
          <CalendarGrid>
            {(grid) => (
              <>
                <caption>{grid.label}</caption>
                <thead>
                  <tr>
                    {grid.weekdays.map((weekday, index) => (
                      <CalendarWeekday key={weekday} index={index} />
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {grid.weeks.map((week) => (
                    <tr key={week[0]!.date}>
                      {week.map((cell) =>
                        cell.hidden ? (
                          <td key={cell.date} />
                        ) : (
                          <CalendarDay key={cell.date} value={cell.date} />
                        ),
                      )}
                    </tr>
                  ))}
                </tbody>
              </>
            )}
          </CalendarGrid>
          <p data-slot="hint">
            {state.mode}, {state.value ?? "nothing"} selected in {state.month}
            {state.disabled || state.readOnly ? " (locked)" : ""}
          </p>
        </>
      )}
    </Calendar>
  )
}
