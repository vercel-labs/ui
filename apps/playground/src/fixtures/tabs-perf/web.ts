import { perfItems, perfSize } from "tests/fixtures/perf.ts"

// Many tabs for the counts specs.
async function mount(root: HTMLElement) {
  const items = perfItems(perfSize())
  const tabs = items
    .map(
      (item) =>
        `<ui-tabs-tab value="${item.value}"><button class="tab">${item.label}</button></ui-tabs-tab>`
    )
    .join("")
  const panels = items
    .map(
      (item) =>
        `<ui-tabs-panel class="panel" value="${item.value}">${item.label} content.</ui-tabs-panel>`
    )
    .join("")
  root.innerHTML = `
    <div class="fixture">
      <button>Before</button>
      <ui-tabs class="tabs" default-value="${items[0].value}">
        <ui-tabs-list class="tablist" aria-label="Pages" style="flex-wrap: wrap">${tabs}</ui-tabs-list>
        ${panels}
      </ui-tabs>
      <button>After</button>
    </div>
  `
  await import("@ui-sdk/web/tabs")
}

export { mount }
