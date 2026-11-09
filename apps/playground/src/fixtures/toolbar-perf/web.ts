import "@ui-sdk/web/toolbar"
import { mountWhenAsked, perfItems, perfSize } from "tests/fixtures/perf.ts"

// A toolbar with many buttons for the counts specs.
function mount(root: HTMLElement) {
  mountWhenAsked(root, (target) => {
    const buttons = perfItems(perfSize())
      .map(
        (item) =>
          `<ui-toolbar-button><button>${item.label}</button></ui-toolbar-button>`
      )
      .join("")
    target.innerHTML = `
      <div class="fixture">
        <button>Before</button>
        <ui-toolbar class="toolbar" aria-label="Formatting" style="flex-wrap: wrap">${buttons}</ui-toolbar>
        <button>After</button>
      </div>
    `
  })
}

export { mount }
