import type { FileRejection } from "@ui-sdk/core/file-input"
import "@ui-sdk/web/file-input"
import { createElement, File as FileIcon, Image, X } from "lucide"

const messages: Record<string, string> = {
  "file-type": "isn't a supported type",
}

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-file-input multiple accept="image/*,.pdf">
      <ui-file-input-dropzone>
        ${createElement(Image, { "aria-hidden": "true" }).outerHTML}
        <span data-slot="hint">Images and PDFs</span>
        <ui-file-input-trigger><button>Browse</button></ui-file-input-trigger>
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
  const list = input.querySelector("ui-file-input-list")!

  const observer = new MutationObserver((records) => {
    for (const { addedNodes } of records)
      for (const item of addedNodes as NodeListOf<HTMLElement & { file?: File }>)
        if (item.file?.type.startsWith("image/"))
          item.querySelector("svg")!.replaceWith(createElement(Image, { "aria-hidden": "true" }))
  })
  observer.observe(list, { childList: true })

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

  return () => {
    observer.disconnect()
  }
}
