import "@ui-sdk/web/file-input"
import { createElement, Plus, X } from "lucide"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-file-input multiple accept="image/*">
      <ui-file-input-trigger>
        <button>
          ${createElement(Plus, { "aria-hidden": "true" }).outerHTML}
          Add images
        </button>
      </ui-file-input-trigger>
      <ui-file-input-list aria-label="Images" data-variant="grid">
        <template>
          <ui-file-input-item>
            <span><span data-index></span>. <span data-file="name"></span>, <span data-file="size"></span></span>
            <ui-file-input-item-remove><button type="button">${createElement(X, { "aria-hidden": "true" }).outerHTML}</button></ui-file-input-item-remove>
          </ui-file-input-item>
        </template>
      </ui-file-input-list>
    </ui-file-input>
  `
  const list = root.querySelector("ui-file-input-list")!

  const observer = new MutationObserver((records) => {
    for (const { addedNodes } of records)
      for (const item of addedNodes as NodeListOf<HTMLElement & { file?: File }>)
        if (item.file && !item.querySelector("img"))
          item.prepend(
            Object.assign(document.createElement("img"), {
              src: URL.createObjectURL(item.file),
              alt: "",
            }),
          )
    for (const { removedNodes } of records)
      for (const item of removedNodes as NodeListOf<HTMLElement & { file?: File }>)
        if (item.parentNode !== list) {
          const preview = item.querySelector?.("img")
          if (preview) URL.revokeObjectURL(preview.src)
        }
    list.querySelectorAll("ui-file-input-item").forEach((item, index) => {
      item.querySelector("[data-index]")!.textContent = String(index + 1)
    })
  })
  observer.observe(list, { childList: true })

  return () => {
    observer.disconnect()
    for (const image of list.querySelectorAll("img")) URL.revokeObjectURL(image.src)
  }
}
