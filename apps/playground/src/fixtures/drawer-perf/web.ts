import { perfItems, perfSize } from "tests/fixtures/perf.ts"

// A drawer whose content has many lines, for the counts specs. ?driver picks its driver.
async function mount(root: HTMLElement) {
  const lines = perfItems(perfSize())
    .map((item) => `<p>${item.label}</p>`)
    .join("")
  const driver = new URLSearchParams(location.search).get("driver")
  root.innerHTML = `
    <div class="fixture">
      <button>Before</button>
      <ui-drawer>
        <ui-drawer-trigger><button>Open</button></ui-drawer-trigger>
        <ui-drawer-backdrop class="drawer-backdrop"></ui-drawer-backdrop>
        <ui-drawer-content class="drawer">
          <ui-drawer-title class="title">Drawer</ui-drawer-title>
          ${lines}
          <ui-drawer-close><button>Close</button></ui-drawer-close>
        </ui-drawer-content>
      </ui-drawer>
      <button>After</button>
    </div>`
  if (driver) {
    root.querySelector("ui-drawer")?.setAttribute("driver", driver)
  }
  await import("@ui-sdk/web/drawer")
}

export { mount }
