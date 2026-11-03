import "@ui-sdk/web/file-input"
import { createElement, Upload } from "lucide"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-file-input>
      <ui-file-input-trigger>
        <button>
          ${createElement(Upload, { "aria-hidden": "true" }).outerHTML}
          Upload a file
        </button>
      </ui-file-input-trigger>
      <span data-slot="hint">No file chosen</span>
    </ui-file-input>
  `
  const input = root.querySelector("ui-file-input")!
  const status = input.querySelector("span")!
  input.addEventListener("valuechange", (event) => {
    status.textContent = event.detail.value[0]?.name ?? "No file chosen"
  })
}
