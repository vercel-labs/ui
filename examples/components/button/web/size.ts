import "@ui-sdk/web/button"
import { Bookmark, createElement, Heart, Star } from "lucide"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <div data-slot="row">
        <ui-button>
          <button data-size="sm">Small</button>
        </ui-button>
        <ui-button>
          <button data-size="sm" aria-label="Bookmark">
            ${createElement(Bookmark, { "aria-hidden": "true" }).outerHTML}
          </button>
        </ui-button>
      </div>
      <div data-slot="row">
        <ui-button>
          <button>Default</button>
        </ui-button>
        <ui-button>
          <button aria-label="Favorite">
            ${createElement(Heart, { "aria-hidden": "true" }).outerHTML}
          </button>
        </ui-button>
      </div>
      <div data-slot="row">
        <ui-button>
          <button data-size="lg">Large</button>
        </ui-button>
        <ui-button>
          <button data-size="lg" aria-label="Star">
            ${createElement(Star, { "aria-hidden": "true" }).outerHTML}
          </button>
        </ui-button>
      </div>
    </div>
  `
}
