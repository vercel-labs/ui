import "@ui-sdk/web/popover"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-popover>
      <ui-popover-trigger><button>Add note</button></ui-popover-trigger>
      <ui-popover-content>
        <ui-popover-title>Note</ui-popover-title>
        <ui-popover-description>Type something, then press Escape or click outside.</ui-popover-description>
        <textarea aria-label="Note"></textarea>
        <div role="alert" data-slot="row" hidden>
          Discard your note?
          <button type="button" data-size="sm" data-keep>Keep editing</button>
          <button type="button" data-size="sm" data-variant="destructive" data-discard>Discard</button>
        </div>
        <button type="button" data-variant="solid" data-save>Save</button>
      </ui-popover-content>
    </ui-popover>
    <output data-slot="output">No note yet</output>
  `
  const popover = root.querySelector("ui-popover")!
  const textarea = root.querySelector("textarea")!
  const alert = root.querySelector<HTMLElement>('[role="alert"]')!
  const save = root.querySelector<HTMLElement>("[data-save]")!
  const ask = (asking: boolean) => {
    alert.hidden = !asking
    save.hidden = asking
  }
  const update = () => {
    if (textarea.value) popover.setAttribute("dismissible", "false")
    else popover.removeAttribute("dismissible")
  }
  const clear = () => {
    textarea.value = ""
    update()
    popover.api.close()
  }
  textarea.addEventListener("input", update)
  popover.addEventListener("dismissattempt", () => ask(true))
  root.querySelector("[data-keep]")!.addEventListener("click", () => {
    ask(false)
    textarea.focus()
  })
  root.querySelector("[data-discard]")!.addEventListener("click", clear)
  save.addEventListener("click", () => {
    root.querySelector("output")!.textContent = "Note saved"
    clear()
  })
  popover.addEventListener("openchange", (event) => {
    if (!event.detail.value) ask(false)
  })
}

export { mount }
