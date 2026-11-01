import "@ui-sdk/web/button"
import { createElement, LoaderCircle } from "lucide"

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-button pending-announcement="Saving">
      <button><span data-spinner></span>Save</button>
    </ui-button>
  `
  root
    .querySelector("[data-spinner]")!
    .replaceWith(createElement(LoaderCircle, { "aria-hidden": "true", "data-slot": "spinner" }))
  root.querySelector("ui-button")!.addEventListener("action", (event) => event.detail.waitUntil(wait(1500)))
}

export { mount }
