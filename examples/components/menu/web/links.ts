import "@ui-sdk/web/menu"
import { CornerDownLeft, createElement } from "lucide"

const sections = [
  { href: "#composition", label: "Composition" },
  { href: "#styling", label: "Styling" },
  { href: "#api-reference", label: "API reference" },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-menu>
      <ui-menu-trigger>
        <button>Links</button>
      </ui-menu-trigger>
      <ui-menu-content>
        ${sections
          .map(
            (section) => `
              <ui-menu-item as-child>
                <a href="${section.href}">
                  ${section.label}
                  ${createElement(CornerDownLeft, { "aria-hidden": "true" }).outerHTML}
                </a>
              </ui-menu-item>
            `,
          )
          .join("")}
      </ui-menu-content>
    </ui-menu>
  `
}

export { mount }
