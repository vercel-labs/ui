import "@ui-sdk/web/toggle"
import { Bookmark, createElement, Heart, Star } from "lucide"

const reactions = [
  { value: "star", label: "Favorite", icon: Star },
  { value: "heart", label: "Like", icon: Heart },
  { value: "bookmark", label: "Save", icon: Bookmark },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-toggle-group multiple aria-label="Reactions" data-variant="framed">
      ${reactions
        .map(
          (item) => `
            <ui-toggle value="${item.value}">
              <button aria-label="${item.label}">
                <ui-toggle-icon data-variant="fill">${createElement(item.icon, { "aria-hidden": "true" }).outerHTML}</ui-toggle-icon>
              </button>
            </ui-toggle>
          `,
        )
        .join("")}
    </ui-toggle-group>
  `
}

export { mount }
