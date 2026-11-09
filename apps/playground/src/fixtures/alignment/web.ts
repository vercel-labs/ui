import { alignmentFixture, alignmentOptions } from "tests/fixtures/alignment.ts"

type Popup = HTMLElement & {
  api?: {
    open: (
      options?: object
    ) => Promise<{ reason: string; returnValue?: string }>
    getPayload: () => unknown
  }
  items?: unknown
}

const markup = `
  <div class="fixture">
    <button>Before</button>
    <ul class="rows"></ul>
    <ui-menu id="row-menu">
      <ui-menu-content class="popup"${alignmentOptions().keepMounted ? " keep-mounted" : ""}>
        <div class="payload"></div>
        ${alignmentFixture.rowActions.map((item) => `<ui-menu-item class="item" value="${item.value}">${item.label}</ui-menu-item>`).join("")}
      </ui-menu-content>
    </ui-menu>

    <ui-popover id="details" modal="trap-focus">
      <ui-popover-content class="popup">
        <form method="dialog">
          <ui-popover-title class="title">Details</ui-popover-title>
          <p class="payload"></p>
          <button value="save">Save</button>
          <button value="cancel">Cancel</button>
        </form>
      </ui-popover-content>
    </ui-popover>
    <button id="show-details">Show details</button>

    <ui-menu id="canvas-menu">
      <ui-menu-context-trigger class="canvas">Canvas</ui-menu-context-trigger>
      <ui-menu-content class="popup">
        ${alignmentFixture.canvasActions.map((item) => `<ui-menu-item class="item" value="${item.value}">${item.label}</ui-menu-item>`).join("")}
      </ui-menu-content>
    </ui-menu>

    <ui-menu id="data-menu">
      <ui-menu-trigger><button>Data</button></ui-menu-trigger>
      <template>
        <ui-menu-content class="popup">
          <ui-menu-checkbox-item class="item"><ui-menu-item-indicator class="indicator">✓</ui-menu-item-indicator></ui-menu-checkbox-item>
          <ui-menu-radio-item class="item"><ui-menu-item-indicator class="indicator">•</ui-menu-item-indicator></ui-menu-radio-item>
        </ui-menu-content>
      </template>
    </ui-menu>

    <ui-menu>
      <ui-menu-trigger><button>View</button></ui-menu-trigger>
      <ui-menu-content class="popup">
        <ui-menu-checkbox-item class="item" value="ruler"><ui-menu-item-indicator class="indicator">✓</ui-menu-item-indicator>Ruler</ui-menu-checkbox-item>
        <ui-menu-checkbox-item class="item" value="guides"><ui-menu-item-indicator class="indicator">✓</ui-menu-item-indicator>Guides</ui-menu-checkbox-item>
      </ui-menu-content>
    </ui-menu>

    <ui-tabs class="tabs" hidden-until-found>
      <ui-tabs-list class="tablist scrolling" aria-label="Sections">
        ${alignmentFixture.sections.map((section) => `<ui-tabs-tab value="${section.toLowerCase()}"><button class="tab">${section}</button></ui-tabs-tab>`).join("")}
      </ui-tabs-list>
      ${alignmentFixture.sections.map((section) => `<ui-tabs-panel class="panel" value="${section.toLowerCase()}">The ${section} section</ui-tabs-panel>`).join("")}
    </ui-tabs>
    <button id="last-section">Show the last section</button>

    <button>After</button>
    <output role="status" aria-label="Last action"></output>
    <output aria-label="Last result"></output>
    <output aria-label="Last complete"></output>
    <output aria-label="Last change"></output>
    <output aria-label="Tab changes">0</output>
  </div>
`

async function mount(root: HTMLElement) {
  root.innerHTML = markup
  const output = (name: string) =>
    root.querySelector<HTMLOutputElement>(`output[aria-label="${name}"]`)!

  // Triggers outside the menu name it with `for`, and carry their row as a property.
  const rows = root.querySelector(".rows")!
  for (const row of alignmentFixture.rows) {
    const item = document.createElement("li")
    item.textContent = `Row ${row}`
    const trigger = Object.assign(document.createElement("ui-menu-trigger"), {
      payload: row,
    })
    trigger.setAttribute("for", "row-menu")
    trigger.innerHTML = `<button aria-label="Actions for ${row}">…</button>`
    item.append(trigger)
    rows.append(item)
  }

  const rowMenu = root.querySelector<Popup>("#row-menu")!
  const details = root.querySelector<Popup>("#details")!
  const showDetails = (payload: string) =>
    details.api!.open({ payload }).then((closed) => {
      output("Last result").textContent =
        `${closed.reason}:${closed.returnValue ?? ""}`
    })

  rowMenu.addEventListener("openchange", () => {
    rowMenu.querySelector(".payload")!.textContent =
      `Row ${rowMenu.api?.getPayload()}`
  })
  rowMenu.addEventListener("openchangecomplete", (event) => {
    output("Last complete").textContent = (
      event as CustomEvent<{ value: boolean }>
    ).detail.value
      ? "open"
      : "closed"
  })
  rowMenu.addEventListener("action", (event) => {
    const value = (event as CustomEvent<{ value: string }>).detail.value
    output("Last action").textContent = `${value}:${rowMenu.api?.getPayload()}`
    if (value === "details") {
      showDetails(String(rowMenu.api?.getPayload()))
    }
  })
  details.addEventListener("openchange", () => {
    details.querySelector(".payload")!.textContent =
      `Details for ${details.api?.getPayload()}`
  })
  root
    .querySelector("#show-details")!
    .addEventListener("click", () => showDetails("button"))

  root.querySelector("#canvas-menu")!.addEventListener("action", (event) => {
    output("Last action").textContent = (
      event as CustomEvent<{ value: string }>
    ).detail.value
  })

  const data = root.querySelector<Popup>("#data-menu")!
  data.items = [
    { type: "checkbox", value: "grid", label: "Grid" },
    {
      type: "radio-group",
      name: "sort",
      items: [
        { value: "name", label: "Name" },
        { value: "date", label: "Date" },
      ],
    },
  ]
  // Items report their own changes, which the menu hears in the capture phase.
  data.addEventListener(
    "checkedchange",
    (event) => {
      const value = (event.target as HTMLElement).getAttribute("value")
      output("Last change").textContent =
        `checked:${value}:${(event as CustomEvent<{ value: boolean }>).detail.value}`
    },
    { capture: true }
  )
  data.addEventListener(
    "valuechange",
    (event) => {
      const group = (event.target as HTMLElement).getAttribute("name")
      output("Last change").textContent =
        `value:${group}:${(event as CustomEvent<{ value: string }>).detail.value}`
    },
    { capture: true }
  )

  const tabs = root.querySelector<HTMLElement & { value?: string }>("ui-tabs")!
  let tabChanges = 0
  tabs.addEventListener("valuechange", () => {
    output("Tab changes").textContent = String(++tabChanges)
  })
  root
    .querySelector("#last-section")!
    .addEventListener("click", () => tabs.setAttribute("value", "hotel"))

  await import("@ui-sdk/web/menu")
  await import("@ui-sdk/web/popover")
  await import("@ui-sdk/web/tabs")
}

export { mount }
