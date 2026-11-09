import { tabsOptions } from "tests/fixtures/page.ts"
import { tabsFixture } from "tests/fixtures/tabs.ts"

const escape = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;")

function markup(keepMounted: boolean) {
  const tabs = tabsFixture.tabs
    .map(
      (tab) =>
        `<ui-tabs-tab value="${tab.value}"${tab.disabled ? " disabled" : ""}><button class="tab">${escape(tab.label)}</button></ui-tabs-tab>`
    )
    .join("")
  const panels = tabsFixture.tabs
    .map(
      (tab) =>
        `<ui-tabs-panel class="panel" value="${tab.value}"${keepMounted ? " keep-mounted" : ""}>${escape(tab.content)}${
          tab.field
            ? `<label> ${escape(tab.field)} <input type="password"></label>`
            : ""
        }</ui-tabs-panel>`
    )
    .join("")
  return `
    <div class="fixture">
      <button>Before</button>
      <ui-tabs class="tabs">
        <ui-tabs-list class="tablist" aria-label="${tabsFixture.label}">${tabs}<ui-tabs-indicator class="indicator"></ui-tabs-indicator></ui-tabs-list>
        ${panels}
      </ui-tabs>
      <button>After</button>
      <output role="status" aria-label="Last action"></output>
      <button id="controller">Show notifications</button>
    </div>
  `
}

async function mount(root: HTMLElement) {
  const { cancel, keepMounted, defaultValue, activation, orientation } =
    tabsOptions()
  root.innerHTML = markup(keepMounted)
  const tabs = root.querySelector<
    HTMLElement & { api?: { select: (value: string) => void } }
  >("ui-tabs")!
  if (defaultValue) {
    tabs.setAttribute("default-value", defaultValue)
  }
  if (activation) {
    tabs.setAttribute("activation", activation)
  }
  if (orientation) {
    tabs.setAttribute("orientation", orientation)
  }
  await import("@ui-sdk/web/tabs")
  root
    .querySelector("#controller")!
    .addEventListener("click", () => tabs.api?.select("notifications"))
  root.addEventListener(
    "valuechange",
    (event) => {
      const detail = (event as CustomEvent<{ value: string | null }>).detail
      if (detail.value === cancel) {
        return event.preventDefault()
      }
      root.querySelector("output")!.textContent = detail.value ?? ""
    },
    { capture: true }
  )
}

export { mount }
