import "@ui-sdk/web/navigation-menu"
import { ChevronDown, ChevronRight, createElement } from "lucide"

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

const groups = [
  {
    value: "overlays",
    label: "Overlays",
    links: [
      { title: "Dialog", href: "https://example.com/docs/components/dialog" },
      { title: "Popover", href: "https://example.com/docs/components/popover" },
      { title: "Tooltip", href: "https://example.com/docs/components/tooltip" },
    ],
  },
  {
    value: "forms",
    label: "Forms",
    links: [
      { title: "Input", href: "https://example.com/docs/components/input" },
      { title: "Select", href: "https://example.com/docs/components/select" },
      { title: "Checkbox", href: "https://example.com/docs/components/checkbox" },
    ],
  },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
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
        </ui-navigation-menu-item>
        <ui-navigation-menu-item value="components">
          <ui-navigation-menu-trigger>
            <button>
              Components
              ${createElement(ChevronDown, { "aria-hidden": "true" }).outerHTML}
            </button>
          </ui-navigation-menu-trigger>
          <ui-navigation-menu-content>
            <ui-navigation-menu orientation="vertical">
              <ui-navigation-menu-list>
                ${groups
                  .map(
                    (group) => `
                <ui-navigation-menu-item value="${group.value}">
                  <ui-navigation-menu-trigger>
                    <button>
                      ${group.label}
                      ${createElement(ChevronRight, { "aria-hidden": "true" }).outerHTML}
                    </button>
                  </ui-navigation-menu-trigger>
                  <ui-navigation-menu-content side-offset="12">
                    <ul>
                      ${group.links
                        .map(
                          (link) => `
                      <li>
                        <ui-navigation-menu-link>
                          <a href="${link.href}">${link.title}</a>
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
            </ui-navigation-menu>
          </ui-navigation-menu-content>
        </ui-navigation-menu-item>
      </ui-navigation-menu-list>
      <ui-navigation-menu-viewport></ui-navigation-menu-viewport>
    </ui-navigation-menu>
  `
}

export { mount }
