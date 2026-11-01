import "@ui-sdk/web/input"
import { Search, X, createElement } from "lucide"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-input-group>
        ${createElement(Search, { "aria-hidden": "true" }).outerHTML}
        <ui-input>
          <input type="search" aria-label="Search people" value="Lovelace" />
        </ui-input>
        <ui-input-clear>
          <button type="button" aria-label="Clear search">
            ${createElement(X, { "aria-hidden": "true" }).outerHTML}
          </button>
        </ui-input-clear>
      </ui-input-group>
      <p data-slot="hint">Type, or clear the search.</p>
    </div>
  `
  root.querySelector("ui-input")!.addEventListener("valuechange", (event) => {
    root.querySelector("p")!.textContent = `Last change: ${event.detail.reason}`
  })
}
