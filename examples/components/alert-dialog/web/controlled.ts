import "@ui-sdk/web/alert-dialog"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <button
        type="button"
      >
        Review changes
      </button>
      <ui-alert-dialog>
        <ui-alert-dialog-backdrop
          hidden
        ></ui-alert-dialog-backdrop>
        <ui-alert-dialog-content
          hidden
        >
          <div data-slot="stack">
            <ui-alert-dialog-title>
              Discard unsaved changes?
            </ui-alert-dialog-title>
            <ui-alert-dialog-description
            >
              Your edits will be lost if you leave without saving.
            </ui-alert-dialog-description>
          </div>
          <div data-slot="row">
            <ui-alert-dialog-close>
              <button
              >
                Keep editing
              </button>
            </ui-alert-dialog-close>
            <ui-alert-dialog-close value="confirm">
              <button data-variant="solid"
              >
                Discard
              </button>
            </ui-alert-dialog-close>
          </div>
        </ui-alert-dialog-content>
      </ui-alert-dialog>
      <output data-slot="output">Open: false</output>
    </div>
  `
  const dialog = root.querySelector("ui-alert-dialog")!
  const trigger = root.querySelector("button")!
  const output = root.querySelector("output")!
  trigger.addEventListener("click", () => {
    dialog.open = true
  })
  dialog.addEventListener("openchange", (event) => {
    output.textContent = `Open: ${event.detail.value}`
  })
}

export { mount }
