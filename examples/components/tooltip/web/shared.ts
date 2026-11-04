import "@ui-sdk/web/tooltip"
import type { UiTooltipElement } from "@ui-sdk/web/tooltip"

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

function mount(root: HTMLElement) {
  const id = `tooltip-payload-${crypto.randomUUID()}`
  root.innerHTML = `
    <div data-slot="stack">
      <div data-slot="grid"></div>
      <p data-slot="hint">Two weeks of contributions</p>
      <ui-tooltip id="${id}" delay="300">
        <ui-tooltip-content></ui-tooltip-content>
      </ui-tooltip>
    </div>
  `
  const grid = root.querySelector('[data-slot="grid"]')!
  for (const day of days) {
    const trigger = Object.assign(document.createElement("ui-tooltip-trigger"), { payload: day })
    trigger.setAttribute("for", id)
    trigger.innerHTML = `<button aria-label="${day.date}" data-level="${day.level}"></button>`
    grid.append(trigger)
  }
  const tooltip = root.querySelector<UiTooltipElement<Day>>("ui-tooltip")!
  const content = root.querySelector("ui-tooltip-content")!
  tooltip.addEventListener("payloadchange", (event) => {
    content.textContent = contributions(event.detail.value)
  })
}

export { mount }
