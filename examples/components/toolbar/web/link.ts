import "@ui-sdk/web/toolbar"
import { Check, createElement, ExternalLink, File, MessageCircle } from "lucide"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-toolbar aria-label="Pull request">
        <ui-toolbar-button>
          <button data-variant="secondary" aria-label="Approve">
            ${createElement(Check, { "aria-hidden": "true" }).outerHTML}
          </button>
        </ui-toolbar-button>
        <ui-toolbar-button>
          <button data-variant="secondary" aria-label="Comment">
            ${createElement(MessageCircle, { "aria-hidden": "true" }).outerHTML}
          </button>
        </ui-toolbar-button>
        <ui-toolbar-separator></ui-toolbar-separator>
        <ui-toolbar-link>
          <a href="#files">
            ${createElement(File, { "aria-hidden": "true" }).outerHTML}
            Files changed
          </a>
        </ui-toolbar-link>
        <ui-toolbar-link>
          <a aria-label="Checks" href="#checks">
            ${createElement(ExternalLink, { "aria-hidden": "true" }).outerHTML}
          </a>
        </ui-toolbar-link>
      </ui-toolbar>
      <p data-slot="hint">Showing: <span data-page>conversation</span></p>
    </div>
  `
  const page = root.querySelector("[data-page]")!
  root.querySelector("ui-toolbar")!.addEventListener("click", (event) => {
    const link = (event.target as Element).closest("a")
    if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return
    }
    event.preventDefault()
    page.textContent = link.hash.slice(1)
  })
}

export { mount }
