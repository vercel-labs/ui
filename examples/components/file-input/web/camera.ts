import "@ui-sdk/web/file-input"
import { createElement, Smartphone } from "lucide"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-file-input accept="image/*" capture="environment">
      <ui-file-input-trigger>
        <button>
          ${createElement(Smartphone, { "aria-hidden": "true" }).outerHTML}
          Take a photo
        </button>
      </ui-file-input-trigger>
      <span data-slot="hint">No photo yet</span>
    </ui-file-input>
  `
  const input = root.querySelector("ui-file-input")!
  const status = input.querySelector("span")!
  input.addEventListener("valuechange", (event) => {
    status.textContent = event.detail.value[0]?.name ?? "No photo yet"
  })
}
