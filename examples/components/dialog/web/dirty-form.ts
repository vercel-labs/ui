import "@ui-sdk/web/dialog"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-dialog>
      <ui-dialog-trigger><button>Write a post</button></ui-dialog-trigger>
      <ui-dialog-backdrop></ui-dialog-backdrop>
      <ui-dialog-content>
        <div data-slot="stack">
          <ui-dialog-title>New post</ui-dialog-title>
          <ui-dialog-description>Type something, then press Escape or click outside.</ui-dialog-description>
        </div>
        <textarea aria-label="Post"></textarea>
        <div data-slot="row" role="alert" hidden>
          Discard your changes?
          <div data-slot="row">
            <button type="button" data-keep>Keep editing</button>
            <button data-variant="solid" type="button" data-discard>Discard</button>
          </div>
        </div>
        <div data-slot="row" data-footer>
          <ui-dialog-close value="post"><button data-variant="solid">Post</button></ui-dialog-close>
        </div>
      </ui-dialog-content>
    </ui-dialog>
  `
  const dialog = root.querySelector("ui-dialog")!
  const textarea = root.querySelector("textarea")!
  const alert = root.querySelector<HTMLElement>('[role="alert"]')!
  const footer = root.querySelector<HTMLElement>("[data-footer]")!
  const ask = (asking: boolean) => {
    alert.hidden = !asking
    footer.hidden = asking
  }
  textarea.addEventListener("input", () => {
    if (textarea.value) dialog.setAttribute("dismissible", "false")
    else dialog.removeAttribute("dismissible")
  })
  dialog.addEventListener("dismissattempt", () => ask(true))
  root.querySelector("[data-keep]")!.addEventListener("click", () => {
    ask(false)
    textarea.focus()
  })
  root.querySelector("[data-discard]")!.addEventListener("click", () => (dialog.open = false))
  dialog.addEventListener("openchange", (event) => {
    if (event.detail.value) return
    ask(false)
    textarea.value = ""
    dialog.removeAttribute("dismissible")
  })
}

export { mount }
