import type { FileRejection } from "@ui-sdk/core/file-input"
import "@ui-sdk/web/file-input"
import { createElement, File as FileIcon, X } from "lucide"

const messages: Record<string, string> = {
  "file-too-large": "is too large",
  "file-too-small": "is empty",
  "too-many-files": "is one file too many",
}

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-file-input multiple max-files="3" max-size="5000000" min-size="1">
      <ui-file-input-dropzone>
        <span data-slot="hint">0 of 3 files, up to 5 MB each</span>
        <ui-file-input-trigger><button>Add files</button></ui-file-input-trigger>
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
      <div data-rejections data-slot="output"></div>
    </ui-file-input>
  `
  const input = root.querySelector("ui-file-input")!
  const status = input.querySelector("span")!

  const showRejections = (rejected: FileRejection[]) => {
    input.querySelector("[data-rejections]")!.replaceChildren(
      ...rejected.map(({ file, reasons }) =>
        Object.assign(document.createElement("p"), {
          textContent: `${file.name} ${reasons.map((reason) => messages[reason] ?? reason).join(" and ")}`,
        }),
      ),
    )
  }
  input.addEventListener("valuechange", (event) => {
    status.textContent = `${event.detail.value.length} of 3 files, up to 5 MB each`
    showRejections([])
  })
  input.addEventListener("reject", (event) => showRejections(event.detail.value))
}
