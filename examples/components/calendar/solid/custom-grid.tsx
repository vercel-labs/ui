import {
  Calendar,
  CalendarDay,
  CalendarGrid,
  CalendarHeading,
  CalendarNext,
  CalendarPrevious,
  CalendarWeekday,
} from "@ui-sdk/solid/calendar"
import { For, Show } from "solid-js"

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
            <CalendarHeading>{(heading) => heading.label}</CalendarHeading>
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
            {(grid) => (
              <>
                <caption>{grid.label}</caption>
                <thead>
                  <tr>
                    <For each={grid.weekdays}>{(_, index) => <CalendarWeekday index={index()} />}</For>
                  </tr>
                </thead>
                <tbody>
                  <For each={grid.weeks} keyed={(week) => week[0]!.date}>
                    {(week) => (
                      <tr>
                        <For each={week()} keyed={(cell) => cell.date}>
                          {(cell) => (
                            <Show when={!cell().hidden} fallback={<td />}>
                              <CalendarDay value={cell().date} />
                            </Show>
                          )}
                        </For>
                      </tr>
                    )}
                  </For>
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
