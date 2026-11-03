import "@ui-sdk/web/navigation-menu"
import type { UiNavigationMenuElement } from "@ui-sdk/web"
import { ChevronDown, createElement } from "lucide"

const sections = [
  {
    value: "guides",
    label: "Guides",
    links: [
      {
        title: "Introduction",
        href: "https://example.com/docs",
        description: "Unstyled components with one core for every framework.",
      },
      {
        title: "Installation",
        href: "https://example.com/docs/installation",
        description: "Add the package for your framework and render your first part.",
      },
      {
        title: "Styling",
        href: "https://example.com/docs/styling",
        description: "Style parts with data attributes, CSS variables and any CSS.",
      },
    ],
  },
  {
    value: "components",
    label: "Components",
    links: [
      {
        title: "Alert Dialog",
        href: "https://example.com/docs/components/alert-dialog",
        description: "Asks for a decision before anything else on the page can be used.",
      },
      {
        title: "Hover Card",
        href: "https://example.com/docs/components/hover-card",
        description: "A preview of what a link points to, for people who pause on it.",
      },
      {
        title: "Progress",
        href: "https://example.com/docs/components/progress",
        description: "Shows how far along a task is, like an upload.",
      },
      {
        title: "Scroll Area",
        href: "https://example.com/docs/components/scroll-area",
        description: "Scrolls its content with scrollbars you can style.",
      },
    ],
  },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <div data-slot="row">
        <button data-action="toggle">Toggle Components</button>
        <button data-action="focus">Focus Guides</button>
        <button data-action="read">Read state</button>
      </div>
      <ui-navigation-menu aria-label="Main">
        <ui-navigation-menu-list>
          ${sections
            .map(
              (section) => `
          <ui-navigation-menu-item value="${section.value}">
            <ui-navigation-menu-trigger>
              <button>
                ${section.label}
                ${createElement(ChevronDown, { "aria-hidden": "true" }).outerHTML}
              </button>
            </ui-navigation-menu-trigger>
            <ui-navigation-menu-content>
              <ul>
                ${section.links
                  .map(
                    (link) => `
                <li>
                  <ui-navigation-menu-link>
                    <a href="${link.href}">
                      <span>${link.title}</span>
                      <span data-slot="hint">${link.description}</span>
                    </a>
                  </ui-navigation-menu-link>
                </li>`,
                  )
                  .join("")}
              </ul>
            </ui-navigation-menu-content>
          </ui-navigation-menu-item>`,
            )
            .join("")}
        </ui-navigation-menu-list>
        <ui-navigation-menu-viewport></ui-navigation-menu-viewport>
      </ui-navigation-menu>
      <output data-slot="output">Closed</output>
    </div>
  `
  const { api: menu } = root.querySelector<UiNavigationMenuElement>("ui-navigation-menu")!
  root.querySelector('[data-action="toggle"]')!.addEventListener("click", () => {
    if (menu.getValue() === "components") {
      menu.close()
    } else {
      menu.setValue("components")
    }
  })
  root.querySelector('[data-action="focus"]')!.addEventListener("click", () => menu.focus("guides"))
  root.querySelector('[data-action="read"]')!.addEventListener("click", () => {
    root.querySelector("output")!.textContent = menu.isOpen() ? `Open: ${menu.getValue()}` : "Closed"
  })
}

export { mount }
