import "@ui-sdk/web/file-input"
import { createElement, Image, X } from "lucide"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-file-input multiple accept="image/*">
      <ui-file-input-dropzone>
        <span data-slot="hint">Images, announced by name</span>
        <ui-file-input-trigger><button>Add images</button></ui-file-input-trigger>
      </ui-file-input-dropzone>
      <ui-file-input-list aria-label="Images">
        <template>
          <ui-file-input-item>
            ${createElement(Image, { "aria-hidden": "true" }).outerHTML}
            <span data-file="name"></span>
            <span data-file="size" data-slot="hint"></span>
            <ui-file-input-item-remove><button type="button">${createElement(X, { "aria-hidden": "true" }).outerHTML}</button></ui-file-input-item-remove>
          </ui-file-input-item>
        </template>
      </ui-file-input-list>
    </ui-file-input>
  `
  const input = root.querySelector("ui-file-input")!
  input.announcement = ({ added, removed, rejected }) =>
    [
      added.length && `Added ${added.map((file) => file.name).join(", ")}.`,
      removed.length && `Removed ${removed.map((file) => file.name).join(", ")}.`,
      rejected.length && `${rejected.length} skipped, images only.`,
    ]
      .filter(Boolean)
      .join(" ") || null
}
