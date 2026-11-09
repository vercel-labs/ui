import { perfItems, perfSize } from "tests/fixtures/perf.ts"

// A long menu for the counts specs, with a checkbox item and its indicator at the end. Web
// components have no renders to count.
async function mount(root: HTMLElement) {
  const items = perfItems(perfSize())
    .map(
      (item) =>
        `<ui-menu-item class="item" value="${item.value}">${item.label}</ui-menu-item>`
    )
    .join("")
  root.innerHTML = `
    <div class="fixture">
      <button>Before</button>
      <ui-menu>
        <ui-menu-trigger><button>File</button></ui-menu-trigger>
        <ui-menu-content class="popup" style="max-height: 320px; overflow: auto">
          ${items}
          <ui-menu-checkbox-item class="item" value="wrap"><ui-menu-item-indicator>✓</ui-menu-item-indicator>Wrap lines</ui-menu-checkbox-item>
        </ui-menu-content>
      </ui-menu>
      <button>After</button>
    </div>
  `
  await import("@ui-sdk/web/menu")
}

export { mount }
