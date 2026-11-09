import { createDrawerController } from "@ui-sdk/web"
import {
  drawerFixture,
  drawerOptions,
  drawerParts,
  exposeDrawerFixture,
  recordDrawer,
} from "tests/fixtures/drawer.ts"

const parts = drawerParts()
const backdrop = parts.backdrop
  ? `<ui-drawer-backdrop class="drawer-backdrop"></ui-drawer-backdrop>`
  : ""

const nested = `
  <ui-drawer id="nested">
    <ui-drawer-trigger><button>${drawerFixture.nested.trigger}</button></ui-drawer-trigger>
    ${backdrop}
    <ui-drawer-content class="drawer">
      <ui-drawer-title class="title">${drawerFixture.nested.title}</ui-drawer-title>
      <ui-drawer-close><button>${drawerFixture.nested.close}</button></ui-drawer-close>
    </ui-drawer-content>
  </ui-drawer>
`

// A trigger outside the drawer, connected through its id, with a Shortcut part.
const remoteTrigger = `
  <ui-drawer-trigger for="drawer" shortcut="${drawerFixture.shortcut.keys}">
    <button>${drawerFixture.shortcut.trigger} <ui-drawer-shortcut></ui-drawer-shortcut></button>
  </ui-drawer-trigger>
`

const markup = `
  <div class="fixture">
    <button>Before</button>
    <ui-drawer id="drawer">
      <ui-drawer-trigger><button>${drawerFixture.trigger}</button></ui-drawer-trigger>
      ${backdrop}
      <ui-drawer-content class="drawer">
        <ui-drawer-handle><button class="handle" aria-label="${drawerFixture.handle}"></button></ui-drawer-handle>
        <ui-drawer-title class="title">${drawerFixture.title}</ui-drawer-title>
        <ui-drawer-description class="description">${drawerFixture.description}</ui-drawer-description>
        ${parts.field ? `<label class="field">${drawerFixture.field}<input /></label>` : ""}
        ${
          parts.scroll
            ? `<ul class="scroll" aria-label="${drawerFixture.scroll.label}" tabindex="0">${drawerFixture.scroll.items.map((item) => `<li>${item}</li>`).join("")}</ul>`
            : ""
        }
        ${parts.grow ? `<button id="grow">${drawerFixture.grow.button}</button>` : ""}
        <div class="actions">
          <button id="submit">${drawerFixture.action}</button>
          <ui-drawer-close><button>${drawerFixture.close}</button></ui-drawer-close>
        </div>
        ${parts.nested ? nested : ""}
      </ui-drawer-content>
    </ui-drawer>
    <button>After</button>
    <output role="status" aria-label="Last action"></output>
    <button id="controller">${drawerFixture.controller}</button>
    <button id="page">${drawerFixture.page}</button>
    ${parts.shortcut ? remoteTrigger : ""}
    ${parts.outlet ? `<ui-drawer-outlet for="drawer" class="outlet" role="region" aria-label="${drawerFixture.outlet.label}"></ui-drawer-outlet>` : ""}
  </div>
`

// Options that attributes can't express, like an element container, go through properties.
function applyOptions(el: HTMLElement & Record<string, unknown>) {
  const options = drawerOptions() as Record<string, unknown>
  for (const [name, value] of Object.entries(options)) {
    if (name === "container") {
      continue
    }
    if (name === "defaultOpen") {
      el.setAttribute("default-open", "")
    } else if (name === "snapPoints") {
      el.setAttribute("snap-points", (value as unknown[]).join(","))
    } else {
      el.setAttribute(
        name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`),
        String(value)
      )
    }
  }
  const container = new URLSearchParams(location.search).get("container")
  if (container) {
    el.setAttribute("container", `#${container}`)
  }
}

async function mount(root: HTMLElement) {
  root.innerHTML = markup
  const controller = createDrawerController()
  exposeDrawerFixture(controller)
  const el = root.querySelector<HTMLElement & Record<string, unknown>>(
    "#drawer"
  )!
  applyOptions(el)
  el.controller = controller
  await import("@ui-sdk/web/drawer")
  const output = root.querySelector("output")!
  root
    .querySelector("#submit")!
    .addEventListener("click", () => (output.textContent = "submit"))
  root
    .querySelector("#page")!
    .addEventListener("click", () => (output.textContent = "page"))
  root
    .querySelector("#controller")!
    .addEventListener("click", () => controller.open())
  root.querySelector("#grow")?.addEventListener("click", (event) => {
    const more = document.createElement("p")
    more.className = "more"
    more.textContent = drawerFixture.grow.text
    ;(event.target as HTMLElement).after(more)
  })
  const outlet = root.querySelector<HTMLElement & { keyframes?: unknown }>(
    "ui-drawer-outlet"
  )
  if (outlet) {
    outlet.keyframes = drawerFixture.outlet.keyframes
  }
  el.addEventListener("openchange", (event) => {
    const { value, reason } = (event as CustomEvent).detail
    if ((event.target as HTMLElement).id === "drawer") {
      recordDrawer(`drawer:${value}:${reason}`)
    } else {
      recordDrawer(`nested:${value}:${reason}`)
    }
  })
  el.addEventListener("snappointchange", (event) => {
    const { value, reason } = (event as CustomEvent).detail
    recordDrawer(`${value}:${reason}`)
  })
  el.addEventListener("dismissattempt", (event) => {
    recordDrawer(`attempt:${(event as CustomEvent).detail.reason}`)
  })
}

export { mount }
