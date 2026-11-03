import "@ui-sdk/web/file-input"
import { formatFileSize } from "@ui-sdk/web"
import { createElement, File as FileIcon } from "lucide"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-file-input accept=".pdf">
      <ui-file-input-dropzone>
        ${createElement(FileIcon, { "aria-hidden": "true" }).outerHTML}
        <span data-slot="hint">Drop one PDF</span>
        <ui-file-input-trigger><button>Choose</button></ui-file-input-trigger>
      </ui-file-input-dropzone>
    </ui-file-input>
  `
  const input = root.querySelector("ui-file-input")!
  const status = input.querySelector("span")!
  const button = input.querySelector("button")!
  input.addEventListener("valuechange", (event) => {
    const [file] = event.detail.value
    status.textContent = file ? `${file.name}, ${formatFileSize(file.size)}` : "Drop one PDF"
    button.textContent = file ? "Replace" : "Choose"
  })
}
