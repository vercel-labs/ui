import "@ui-sdk/web/file-input"
import { createElement, File as FileIcon, X } from "lucide"

const cover = new File(["Dear team,"], "cover-letter.txt", { type: "text/plain" })

let count = 0

export function mount(root: HTMLElement) {
  const id = `file-input-form-${++count}`
  const page = document.createElement("div")
  page.innerHTML = `
    <div data-slot="stack">
      <ui-file-input name="attachments" form="${id}" multiple accept="image/*,.pdf,.txt">
        <ui-file-input-dropzone>
          <span data-slot="hint">Images, PDFs and text</span>
          <ui-file-input-trigger><button>Attach</button></ui-file-input-trigger>
        </ui-file-input-dropzone>
        <ui-file-input-list aria-label="Attachments">
          <template>
            <ui-file-input-item>
              ${createElement(FileIcon, { "aria-hidden": "true" }).outerHTML}
              <span data-file="name"></span>
              <span data-file="size" data-slot="hint"></span>
              <ui-file-input-item-remove><button type="button">${createElement(X, { "aria-hidden": "true" }).outerHTML}</button></ui-file-input-item-remove>
            </ui-file-input-item>
          </template>
        </ui-file-input-list>
      </ui-file-input>
      <form id="${id}" data-slot="row">
        <button type="submit">Send</button>
        <button type="reset">Reset</button>
        <span data-result data-slot="output"></span>
      </form>
    </div>
  `
  page.querySelector("ui-file-input")!.defaultValue = [cover]
  root.replaceChildren(...page.childNodes)
  const form = root.querySelector("form")!
  const sent = form.querySelector("span")!

  form.addEventListener("submit", (event) => {
    event.preventDefault()
    const files = new FormData(form).getAll("attachments") as File[]
    const names =
      files
        .filter((file) => file.name)
        .map((file) => file.name)
        .join(", ") || "no files"
    sent.textContent = `Sent ${names}.`
  })
  form.addEventListener("reset", () => {
    sent.textContent = ""
  })
}
