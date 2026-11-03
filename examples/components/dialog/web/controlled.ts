import "@ui-sdk/web/dialog"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <label data-slot="label"><input type="checkbox" />open</label>
    <ui-dialog>
      <ui-dialog-trigger><button>Open</button></ui-dialog-trigger>
      <ui-dialog-backdrop></ui-dialog-backdrop>
      <ui-dialog-content>
        <div data-slot="stack">
          <ui-dialog-title>Controlled</ui-dialog-title>
          <ui-dialog-description>Close it any way you like, and watch the log.</ui-dialog-description>
        </div>
        <div data-slot="row">
          <ui-dialog-close><button data-variant="solid">Close</button></ui-dialog-close>
        </div>
      </ui-dialog-content>
    </ui-dialog>
    <ol data-slot="log"></ol>
  `
  const dialog = root.querySelector("ui-dialog")!
  const checkbox = root.querySelector<HTMLInputElement>('input[type="checkbox"]')!
  const log = root.querySelector("ol")!
  const write = (line: string) => {
    log.prepend(Object.assign(document.createElement("li"), { textContent: line }))
    while (log.children.length > 8) log.lastElementChild!.remove()
  }
  checkbox.addEventListener("change", () => (dialog.open = checkbox.checked))
  dialog.addEventListener("openchange", (event) => {
    const { value, reason } = (event as CustomEvent<{ value: boolean; reason: string }>).detail
    checkbox.checked = value
    write(`openchange(${value}, "${reason}")`)
  })
  dialog.addEventListener("openchangecomplete", (event) => write(`openchangecomplete(${event.detail.value})`))
}

export { mount }
