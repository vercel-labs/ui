import {
  advance,
  chronologyFixture as f,
  chronologyOptions,
  type ChronologyFixtureEvent,
} from "tests/fixtures/chronology.ts"

const item = (event: ChronologyFixtureEvent) => `
  <ui-chronology-item value="${event.value}" status="${event.status}">
    <ui-chronology-marker></ui-chronology-marker>
    <ui-chronology-connector></ui-chronology-connector>
    <ui-chronology-title>${event.title}</ui-chronology-title>
    <ui-chronology-time><time datetime="${event.dateTime}">${event.time}</time></ui-chronology-time>
    <ui-chronology-description>${event.description}</ui-chronology-description>
    ${event.link ? `<a href="${event.link.href}">${event.link.label}</a>` : ""}
  </ui-chronology-item>`

const markup = () => `
  <div class="fixture">
    <button>Before</button>
    <ui-chronology class="chronology" aria-label="${f.label}">
      ${f.events.map(item).join("")}
    </ui-chronology>
    <button>After</button>
    <button id="add">Add Event</button>
    <button id="reverse">Reverse</button>
    <button id="focus">Focus Current</button>
    <button id="advance">Advance</button>
  </div>
`

async function mount(root: HTMLElement) {
  root.innerHTML = markup()
  const chronology = root.querySelector("ui-chronology")!
  const options = chronologyOptions()
  if (options.orientation) {
    chronology.setAttribute("orientation", options.orientation)
  }
  if (options.loop === false) {
    chronology.setAttribute("loop", "false")
  }
  if (options.feed) {
    chronology.setAttribute("feed", "")
  }
  if (options.busy) {
    chronology.setAttribute("busy", "")
  }
  await import("@ui-sdk/web/chronology")
  root.querySelector("#add")!.addEventListener("click", () => {
    chronology.insertAdjacentHTML("afterbegin", item(f.added))
  })
  root.querySelector("#reverse")!.addEventListener("click", () => {
    chronology.append(...[...chronology.children].reverse())
  })
  root.querySelector("#advance")!.addEventListener("click", () => {
    const items = [...chronology.children]
    const statuses = items.map((item) => ({
      status: item.getAttribute("status") as ChronologyFixtureEvent["status"],
    }))
    advance(statuses).forEach(({ status }, index) =>
      items[index].setAttribute("status", status)
    )
  })
  root
    .querySelector("#focus")!
    .addEventListener("click", () => chronology.api.focus("shipped"))
}

export { mount }
