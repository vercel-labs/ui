import "@ui-sdk/web/dialog"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-dialog>
      <ui-dialog-trigger shortcut="mod+i">
        <button>View details <ui-dialog-shortcut></ui-dialog-shortcut></button>
      </ui-dialog-trigger>
      <ui-dialog-backdrop></ui-dialog-backdrop>
      <ui-dialog-content>
        <div data-slot="stack">
          <ui-dialog-title as-child><h3>Details</h3></ui-dialog-title>
          <ui-dialog-description>Its state shows as data attributes, like data-open and data-nested.</ui-dialog-description>
        </div>
        <div data-slot="row">
          <ui-dialog-close><a data-variant="solid" href="https://example.com/details">Open the full page</a></ui-dialog-close>
        </div>
      </ui-dialog-content>
    </ui-dialog>
  `
}
