import { createFileInputController } from "@ui-sdk/web/file-input"
import { createElement, File as FileIcon, X } from "lucide"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <div data-slot="row">
        <button type="button" data-action="open">Open the picker</button>
        <button type="button" data-action="add">Add a note</button>
        <button type="button" data-action="clear">Clear</button>
      </div>
      <ui-file-input multiple>
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
      </ui-file-input>
    </div>
  `
  const controller = createFileInputController()
  root.querySelector("ui-file-input")!.controller = controller

  root.querySelector('[data-action="open"]')!.addEventListener("click", () => controller.open())
  root
    .querySelector('[data-action="add"]')!
    .addEventListener("click", () =>
      controller.addFiles([new File(["hello"], `note-${Date.now()}.txt`, { type: "text/plain" })]),
    )
  root.querySelector('[data-action="clear"]')!.addEventListener("click", () => controller.clear())
}
