import { perfItems, perfSize } from "tests/fixtures/perf.ts"

// Many popovers on one page, like a row action in every row of a table, for
// the counts specs. Only the first one is opened.
async function mount(root: HTMLElement) {
  const popovers = perfItems(perfSize())
    .map(
      (item) => `
        <ui-popover>
          <ui-popover-trigger><button>${item.label}</button></ui-popover-trigger>
          <ui-popover-content class="popup" aria-label="${item.label}">
            ${item.label} details.
            <ui-popover-close><button>Close</button></ui-popover-close>
          </ui-popover-content>
        </ui-popover>`
    )
    .join("")
  root.innerHTML = `<div class="fixture" style="flex-wrap: wrap"><button>Before</button>${popovers}<button>After</button></div>`
  await import("@ui-sdk/web/popover")
}

export { mount }
