import "@ui-sdk/web/file-input"
import { createElement, File as FileIcon, X } from "lucide"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-file-input multiple>
      <ui-file-input-dropzone>
        <span data-slot="hint">0 files</span>
        <div data-slot="row">
          <ui-file-input-trigger><button>Add</button></ui-file-input-trigger>
          <button type="button" disabled>Remove last</button>
        </div>
      </ui-file-input-dropzone>
      <ui-file-input-list aria-label="Files">
        <template>
          <ui-file-input-item>
            ${createElement(FileIcon, { "aria-hidden": "true" }).outerHTML}
            <span data-file="name"></span>
            <span data-file="size" data-slot="hint"></span>
            <ui-file-input-item-remove><button type="button">${createElement(X, { "aria-hidden": "true" }).outerHTML}</button></ui-file-input-item-remove>
          </ui-file-input-item>
        </template>
      </ui-file-input-list>
      <output data-slot="output">Nothing yet</output>
    </ui-file-input>
  `
  const input = root.querySelector("ui-file-input")!
  const count = input.querySelector("span")!
  const [, removeLast] = input.querySelectorAll("button")
  const last = input.querySelector("output")!

  input.addEventListener("valuechange", (event) => {
    const { value, reason, added, removed } = event.detail
    count.textContent = `${value.length} ${value.length === 1 ? "file" : "files"}`
    removeLast.disabled = !value.length
    last.textContent = `${reason}: +${added.length} -${removed.length}`
  })
  removeLast.addEventListener("click", () => {
    input.value = input.value.slice(0, -1)
  })
}
