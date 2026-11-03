import "@ui-sdk/web/toggle"
import { Bold, Bookmark, createElement, Heart, Italic, Star, Underline } from "lucide"

const formatting = [
  { value: "bold", label: "Bold", icon: Bold },
  { value: "italic", label: "Italic", icon: Italic },
  { value: "underline", label: "Underline", icon: Underline },
]

const favorites = [
  { value: "star", label: "Star", icon: Star },
  { value: "heart", label: "Heart", icon: Heart },
  { value: "bookmark", label: "Bookmark", icon: Bookmark },
]

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-toggle-group multiple aria-label="Text formatting">
        ${formatting
          .map(
            (item) => `
              <ui-toggle value="${item.value}">
                <button aria-label="${item.label}">
                  <ui-toggle-icon>${createElement(item.icon, { "aria-hidden": "true" }).outerHTML}</ui-toggle-icon>
                </button>
              </ui-toggle>
            `,
          )
          .join("")}
      </ui-toggle-group>
      <ui-toggle-group multiple data-variant="spaced" aria-label="Favorites">
        ${favorites
          .map(
            (item) => `
              <ui-toggle value="${item.value}">
                <button data-variant="outline">
                  <ui-toggle-icon data-variant="fill">${createElement(item.icon, { "aria-hidden": "true" }).outerHTML}</ui-toggle-icon>
                  ${item.label}
                </button>
              </ui-toggle>
            `,
          )
          .join("")}
      </ui-toggle-group>
    </div>
  `
}
