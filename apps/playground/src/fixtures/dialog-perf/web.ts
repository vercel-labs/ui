import { perfItems, perfSize } from "tests/fixtures/perf.ts"

// Many dialogs on one page, like a delete confirmation in every row of a
// table, for the counts specs. Only the first one is opened.
async function mount(root: HTMLElement) {
  const dialogs = perfItems(perfSize())
    .map(
      (item) => `
        <ui-dialog>
          <ui-dialog-trigger><button>Delete ${item.label}</button></ui-dialog-trigger>
          <ui-dialog-backdrop class="dialog-backdrop"></ui-dialog-backdrop>
          <ui-dialog-content class="dialog">
            <ui-dialog-title class="title">Delete ${item.label}?</ui-dialog-title>
            <ui-dialog-description class="description">This can't be undone.</ui-dialog-description>
            <div class="actions">
              <ui-dialog-close><button>Cancel</button></ui-dialog-close>
              <button>Delete</button>
            </div>
          </ui-dialog-content>
        </ui-dialog>`
    )
    .join("")
  root.innerHTML = `<div class="fixture" style="flex-wrap: wrap"><button>Before</button>${dialogs}<button>After</button></div>`
  await import("@ui-sdk/web/dialog")
}

export { mount }
