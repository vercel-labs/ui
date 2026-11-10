import {
  advance,
  timelineFixture as f,
  timelineOptions,
  type TimelineFixtureEvent,
} from "tests/fixtures/timeline.ts"

const item = (event: TimelineFixtureEvent) => `
  <ui-timeline-item value="${event.value}" status="${event.status}">
    <ui-timeline-marker></ui-timeline-marker>
    <ui-timeline-connector></ui-timeline-connector>
    <ui-timeline-title>${event.title}</ui-timeline-title>
    <ui-timeline-time><time datetime="${event.dateTime}">${event.time}</time></ui-timeline-time>
    <ui-timeline-description>${event.description}</ui-timeline-description>
    ${event.link ? `<a href="${event.link.href}">${event.link.label}</a>` : ""}
  </ui-timeline-item>`

const markup = () => `
  <div class="fixture">
    <button>Before</button>
    <ui-timeline class="timeline" aria-label="${f.label}">
      ${f.events.map(item).join("")}
    </ui-timeline>
    <button>After</button>
    <button id="add">Add Event</button>
    <button id="reverse">Reverse</button>
    <button id="focus">Focus Current</button>
    <button id="advance">Advance</button>
  </div>
`

async function mount(root: HTMLElement) {
  root.innerHTML = markup()
  const timeline = root.querySelector("ui-timeline")!
  const options = timelineOptions()
  if (options.orientation) {
    timeline.setAttribute("orientation", options.orientation)
  }
  if (options.loop === false) {
    timeline.setAttribute("loop", "false")
  }
  if (options.feed) {
    timeline.setAttribute("feed", "")
  }
  if (options.busy) {
    timeline.setAttribute("busy", "")
  }
  await import("@ui-sdk/web/timeline")
  root.querySelector("#add")!.addEventListener("click", () => {
    timeline.insertAdjacentHTML("afterbegin", item(f.added))
  })
  root.querySelector("#reverse")!.addEventListener("click", () => {
    timeline.append(...[...timeline.children].reverse())
  })
  root.querySelector("#advance")!.addEventListener("click", () => {
    const items = [...timeline.children]
    const statuses = items.map((item) => ({
      status: item.getAttribute("status") as TimelineFixtureEvent["status"],
    }))
    advance(statuses).forEach(({ status }, index) =>
      items[index].setAttribute("status", status)
    )
  })
  root
    .querySelector("#focus")!
    .addEventListener("click", () => timeline.api.focus("shipped"))
}

export { mount }
