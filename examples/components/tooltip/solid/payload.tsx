import { createTooltipController, Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/solid/tooltip"
import { For } from "solid-js"

const days = [
  { date: "Mon, Oct 5", count: 0 },
  { date: "Tue, Oct 6", count: 3 },
  { date: "Wed, Oct 7", count: 7 },
  { date: "Thu, Oct 8", count: 1 },
  { date: "Fri, Oct 9", count: 12 },
  { date: "Sat, Oct 10", count: 0 },
  { date: "Sun, Oct 11", count: 2 },
  { date: "Mon, Oct 12", count: 5 },
  { date: "Tue, Oct 13", count: 9 },
  { date: "Wed, Oct 14", count: 4 },
  { date: "Thu, Oct 15", count: 0 },
  { date: "Fri, Oct 16", count: 6 },
  { date: "Sat, Oct 17", count: 1 },
  { date: "Sun, Oct 18", count: 0 },
].map((day) => ({ ...day, level: day.count === 0 ? 0 : day.count < 3 ? 1 : day.count < 7 ? 2 : 3 }))

type Day = (typeof days)[number]

const contributions = (day: Day | undefined) =>
  !day ? "" : day.count === 0 ? "No contributions" : `${day.count} contribution${day.count === 1 ? "" : "s"}`

function Example() {
  const tooltip = createTooltipController<Day>()
  return (
    <div data-slot="stack">
      <div data-slot="grid">
        <For each={days}>
          {(day) => (
            <TooltipTrigger controller={tooltip} payload={day} aria-label={day.date} data-level={day.level} />
          )}
        </For>
      </div>
      <p data-slot="hint">Two weeks of contributions</p>
      <Tooltip controller={tooltip} delay={300}>
        <TooltipContent<Day>>{(state) => contributions(state.payload)}</TooltipContent>
      </Tooltip>
    </div>
  )
}

export { Example }
