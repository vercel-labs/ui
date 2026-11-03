import "@ui-sdk/web/dialog"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-dialog>
      <ui-dialog-trigger><button>Slide in</button></ui-dialog-trigger>
      <ui-dialog-backdrop></ui-dialog-backdrop>
      <ui-dialog-content keep-mounted>
        <div data-slot="stack">
          <ui-dialog-title>Slide and fade</ui-dialog-title>
          <ui-dialog-description>300ms in and out. Focus returns as soon as it starts closing.</ui-dialog-description>
        </div>
        <div data-slot="row">
          <ui-dialog-close><button data-variant="solid">Close</button></ui-dialog-close>
        </div>
      </ui-dialog-content>
    </ui-dialog>
    <output data-slot="output">Closed</output>
  `
  const output = root.querySelector("output")!
  const dialog = root.querySelector("ui-dialog")!
  dialog.addEventListener("openchange", (event) => {
    output.textContent = event.detail.value ? "Opening" : "Closing"
  })
  dialog.addEventListener("openchangecomplete", (event) => {
    output.textContent = event.detail.value ? "Open" : "Closed"
  })
}

export { mount }
