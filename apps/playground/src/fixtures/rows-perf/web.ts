import "@ui-sdk/web/menu"
import "@ui-sdk/web/select"
import "@ui-sdk/web/tooltip"
import {
  mountWhenAsked,
  perfItems,
  perfOptions,
  perfSize,
} from "tests/fixtures/perf.ts"

// Rows like a table's, each with a closed menu, select and tooltip, for the
// counts specs. Web components have no renders to count.
function mount(root: HTMLElement) {
  mountWhenAsked(root, (target) => {
    const options = perfItems(perfOptions())
      .map(
        (option) =>
          `<ui-select-item class="item" value="${option.value}">${option.label}</ui-select-item>`
      )
      .join("")
    const actions = ["Rename", "Duplicate", "Delete"]
      .map(
        (action) =>
          `<ui-menu-item class="item" value="${action}">${action}</ui-menu-item>`
      )
      .join("")
    const rows = perfItems(perfSize(200))
      .map(({ label }) => label.slice(5))
      .map(
        (label) => `
          <div class="row" style="display: flex; gap: 8px">
            <ui-menu>
              <ui-menu-trigger><button>Menu ${label}</button></ui-menu-trigger>
              <ui-menu-content class="popup">${actions}</ui-menu-content>
            </ui-menu>
            <ui-select default-value="item-1">
              <ui-select-trigger><button class="trigger" aria-label="Select ${label}"><ui-select-value></ui-select-value></button></ui-select-trigger>
              <ui-select-content class="popup list-popup">${options}</ui-select-content>
            </ui-select>
            <ui-tooltip>
              <ui-tooltip-trigger><button>Tip ${label}</button></ui-tooltip-trigger>
              <ui-tooltip-content class="tooltip">Hint ${label}</ui-tooltip-content>
            </ui-tooltip>
          </div>`
      )
      .join("")
    target.innerHTML = `
      <div class="fixture" style="flex-direction: column; align-items: start">
        <button>Before</button>
        ${rows}
        <button>After</button>
      </div>
    `
  })
}

export { mount }
