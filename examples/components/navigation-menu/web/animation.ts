import "@ui-sdk/web/navigation-menu"
import type { UiNavigationMenuElement } from "@ui-sdk/web"
import { ChevronDown, createElement } from "lucide"

const gettingStarted = [
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
]

const components = [
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
  {
    title: "Tabs",
    href: "https://example.com/docs/components/tabs",
    description: "Shows one panel of content at a time, picked from a list of tabs.",
  },
  {
    title: "Tooltip",
    href: "https://example.com/docs/components/tooltip",
    description: "A short label for a control, shown on hover or keyboard focus.",
  },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-navigation-menu aria-label="Main">
        <ui-navigation-menu-list>
          <ui-navigation-menu-item value="guides">
            <ui-navigation-menu-trigger>
              <button>
                Guides
                ${createElement(ChevronDown, { "aria-hidden": "true" }).outerHTML}
              </button>
            </ui-navigation-menu-trigger>
            <ui-navigation-menu-content>
              <ul>
                ${gettingStarted
                  .map(
                    (page) => `
                <li>
                  <ui-navigation-menu-link>
                    <a href="${page.href}">
                      <span>${page.title}</span>
                      <span data-slot="hint">${page.description}</span>
                    </a>
                  </ui-navigation-menu-link>
                </li>`,
                  )
                  .join("")}
              </ul>
            </ui-navigation-menu-content>
          </ui-navigation-menu-item>
          <ui-navigation-menu-item value="components">
            <ui-navigation-menu-trigger>
              <button>
                Components
                ${createElement(ChevronDown, { "aria-hidden": "true" }).outerHTML}
              </button>
            </ui-navigation-menu-trigger>
            <ui-navigation-menu-content>
              <ul data-slot="grid">
                ${components
                  .map(
                    (page) => `
                <li>
                  <ui-navigation-menu-link>
                    <a href="${page.href}">
                      <span>${page.title}</span>
                      <span data-slot="hint">${page.description}</span>
                    </a>
                  </ui-navigation-menu-link>
                </li>`,
                  )
                  .join("")}
              </ul>
            </ui-navigation-menu-content>
          </ui-navigation-menu-item>
        </ui-navigation-menu-list>
        <ui-navigation-menu-viewport data-variant="slide"></ui-navigation-menu-viewport>
      </ui-navigation-menu>
      <output data-slot="output">Closed</output>
    </div>
  `
  const menu = root.querySelector<UiNavigationMenuElement>("ui-navigation-menu")!
  const output = root.querySelector("output")!
  menu.addEventListener("valuechange", (event) => {
    output.textContent = event.detail.value ? `Showing ${event.detail.value}` : "Closing"
  })
  menu.addEventListener("openchangecomplete", (event) => {
    output.textContent = event.detail.value ? "Open" : "Closed"
  })
}

export { mount }
