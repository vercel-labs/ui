import "@ui-sdk/web/file-input"
import { Check, createElement, Image, X } from "lucide"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-file-input multiple accept="image/*" max-files="4">
      <ui-file-input-dropzone role="region" aria-label="Gallery upload">
        ${createElement(X, { "aria-hidden": "true", "data-show": "drag-reject" }).outerHTML}
        ${createElement(Check, { "aria-hidden": "true", "data-show": "drag-accept" }).outerHTML}
        ${createElement(Image, { "aria-hidden": "true", "data-hide": "dragging" }).outerHTML}
        <p>
          <span data-show="drag-reject">Only up to 4 images</span>
          <span data-show="drag-accept">Release to add</span>
          <span data-hide="dragging">Drag up to 4 images here</span>
        </p>
        <ui-file-input-trigger><button data-hide="dragging">Browse</button></ui-file-input-trigger>
      </ui-file-input-dropzone>
      <ui-file-input-list aria-label="Images" data-variant="chips">
        <template>
          <ui-file-input-item>
            <span data-show="first">Cover:</span>
            <span data-file="name"></span>
            <ui-file-input-item-remove><button type="button">${createElement(X, { "aria-hidden": "true" }).outerHTML}</button></ui-file-input-item-remove>
          </ui-file-input-item>
        </template>
      </ui-file-input-list>
    </ui-file-input>
  `
}
