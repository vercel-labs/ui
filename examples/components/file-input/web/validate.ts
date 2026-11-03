import type { FileRejection } from "@ui-sdk/core/file-input"
import "@ui-sdk/web/file-input"
import { createElement, File as FileIcon, X } from "lucide"

const messages: Record<string, string> = {
  duplicate: "is already added",
}

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-file-input multiple>
      <ui-file-input-dropzone>
        <span data-slot="hint">Each name once</span>
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
  input.validate = (file) => (input.value.some((other) => other.name === file.name) ? "duplicate" : null)

  const showRejections = (rejected: FileRejection[]) => {
    input.querySelector("[data-rejections]")!.replaceChildren(
      ...rejected.map(({ file, reasons }) =>
        Object.assign(document.createElement("p"), {
          textContent: `${file.name} ${messages[reasons[0]] ?? "was rejected"}`,
        }),
      ),
    )
  }
  input.addEventListener("valuechange", () => showRejections([]))
  input.addEventListener("reject", (event) => showRejections(event.detail.value))
}
