import "@ui-sdk/web/file-input"
import { createElement, Folder } from "lucide"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-file-input directory>
      <ui-file-input-dropzone>
        ${createElement(Folder, { "aria-hidden": "true" }).outerHTML}
        <span data-slot="hint">Drop a folder</span>
        <ui-file-input-trigger><button>Choose a folder</button></ui-file-input-trigger>
      </ui-file-input-dropzone>
      <ui-file-input-list aria-label="Files">
        <template>
          <ui-file-input-item><span data-file="path"></span></ui-file-input-item>
        </template>
      </ui-file-input-list>
    </ui-file-input>
  `
}
