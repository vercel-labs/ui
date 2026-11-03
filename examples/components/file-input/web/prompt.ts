import "@ui-sdk/web/file-input"
import { createElement, File as FileIcon, Image, Plus, X } from "lucide"

let count = 0

export function mount(root: HTMLElement) {
  const id = `file-input-prompt-${++count}-message`
  root.innerHTML = `
    <ui-file-input multiple accept="image/*,.pdf,.txt,.md" max-size="10000000">
      <ui-file-input-dropzone paste-target="#${id}">
        <ui-file-input-list aria-label="Attachments" data-variant="chips">
          <template>
            <ui-file-input-item>
              ${createElement(FileIcon, { "aria-hidden": "true" }).outerHTML}
              <span data-file="name"></span>
              <ui-file-input-item-remove><button type="button">${createElement(X, { "aria-hidden": "true" }).outerHTML}</button></ui-file-input-item-remove>
            </ui-file-input-item>
          </template>
        </ui-file-input-list>
        <textarea id="${id}" aria-label="Message" placeholder="Ask anything. Paste or drop files to attach them."></textarea>
        <div data-slot="row">
          <ui-file-input-trigger><button aria-label="Attach files">${createElement(Plus, { "aria-hidden": "true" }).outerHTML}</button></ui-file-input-trigger>
          <button type="button" disabled>Send</button>
        </div>
      </ui-file-input-dropzone>
    </ui-file-input>
  `
  const input = root.querySelector("ui-file-input")!
  const list = input.querySelector("ui-file-input-list")!
  const text = input.querySelector("textarea")!
  const [, send] = input.querySelectorAll("button")
  const update = (files = input.value) => {
    send.disabled = !text.value && !files.length
  }

  const observer = new MutationObserver((records) => {
    for (const { addedNodes } of records)
      for (const item of addedNodes as NodeListOf<HTMLElement & { file?: File }>)
        if (item.file?.type.startsWith("image/"))
          item.querySelector("svg")!.replaceWith(
            createElement(Image, {
              "aria-hidden": "true",
            }),
          )
  })
  observer.observe(list, { childList: true })

  input.addEventListener("valuechange", (event) => update(event.detail.value))
  text.addEventListener("input", () => update())
  text.addEventListener("keydown", (event) => {
    const last = input.value.at(-1)
    if (event.key !== "Backspace" || text.value !== "" || !last) return
    event.preventDefault()
    input.api.removeFile(last, { reason: "remove-press" })
  })
  send.addEventListener("click", () => {
    text.value = ""
    input.api.clear()
    update()
  })

  return () => {
    observer.disconnect()
  }
}
