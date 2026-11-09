import {
  describeChange,
  hoverPopupsFixture as fixture,
} from "tests/fixtures/hover-popups.ts"

type ChangeEvent = CustomEvent<{ value: unknown; event?: Event }>

const markup = `
  <div class="fixture">
    <button>Before</button>
    <ui-tooltip delay="0">
      <ui-tooltip-content class="tooltip"></ui-tooltip-content>
    </ui-tooltip>
    <ui-hover-card delay="0" close-delay="0">
      <ui-hover-card-content class="hover-card"></ui-hover-card-content>
    </ui-hover-card>
    <ui-popover open-on-hover delay="0" close-delay="0">
      <ui-popover-trigger><button>${fixture.popover.trigger}</button></ui-popover-trigger>
      <ui-popover-content class="popup">${fixture.popover.content}</ui-popover-content>
    </ui-popover>
    <output role="status" aria-label="Last change"></output>
  </div>
`

// A trigger with its payload, set before it connects, which is when it reads it.
function trigger(tag: string, payload: string, html: string) {
  const el = Object.assign(document.createElement(tag), { payload })
  el.innerHTML = html
  return el
}

async function mount(root: HTMLElement) {
  await import("@ui-sdk/web/tooltip")
  await import("@ui-sdk/web/hover-card")
  await import("@ui-sdk/web/popover")
  root.innerHTML = markup
  const output = root.querySelector("output")!
  const tooltip = root.querySelector("ui-tooltip")!
  const card = root.querySelector("ui-hover-card")!
  tooltip.prepend(
    ...fixture.days.map((day) =>
      trigger(
        "ui-tooltip-trigger",
        day.toLowerCase(),
        `<button>${day}</button>`
      )
    )
  )
  card.prepend(
    ...fixture.people.map((person) =>
      trigger(
        "ui-hover-card-trigger",
        person.toLowerCase(),
        `<a href="#${person}">${person}</a>`
      )
    )
  )

  const report = (
    component: string,
    element: Element,
    show?: (payload: unknown) => void
  ) => {
    element.addEventListener("openchange", (event) => {
      const { value, event: cause } = (event as ChangeEvent).detail
      if (value) {
        output.textContent = describeChange(component, "open", cause)
      }
    })
    element.addEventListener("payloadchange", (event) => {
      const { value, event: cause } = (event as ChangeEvent).detail
      show?.(value)
      output.textContent = describeChange(component, `payload ${value}`, cause)
    })
  }
  const tooltipContent = tooltip.querySelector("ui-tooltip-content")!
  const cardContent = card.querySelector("ui-hover-card-content")!
  report(
    "tooltip",
    tooltip,
    (payload) => (tooltipContent.textContent = `Tip for ${payload}`)
  )
  report(
    "hover card",
    card,
    (payload) => (cardContent.textContent = `Card for ${payload}`)
  )
  report("popover", root.querySelector("ui-popover")!)
}

export { mount }
