import "@ui-sdk/web/navigation-menu"
import { ChevronDown, createElement } from "lucide"

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
      <ui-navigation-menu aria-label="Main" close-on-select="false">
        <ui-navigation-menu-list>
          <ui-navigation-menu-item value="components">
            <ui-navigation-menu-trigger>
              <button>
                Components
                ${createElement(ChevronDown, { "aria-hidden": "true" }).outerHTML}
              </button>
            </ui-navigation-menu-trigger>
            <ui-navigation-menu-content>
              <ul>
                ${components
                  .map(
                    (page) => `
                <li>
                  <ui-navigation-menu-link>
                    <a href="${page.href}" data-title="${page.title}">${page.title}</a>
                  </ui-navigation-menu-link>
                </li>`,
                  )
                  .join("")}
              </ul>
              <ul>
                <li>
                  <ui-navigation-menu-link close-on-select>
                    <a href="https://example.com/docs/components" data-title="All components">Browse all</a>
                  </ui-navigation-menu-link>
                </li>
              </ul>
            </ui-navigation-menu-content>
          </ui-navigation-menu-item>
        </ui-navigation-menu-list>
        <ui-navigation-menu-viewport></ui-navigation-menu-viewport>
      </ui-navigation-menu>
      <output data-slot="output">Press a link</output>
    </div>
  `
  for (const link of root.querySelectorAll<HTMLAnchorElement>("a[data-title]")) {
    link.addEventListener("click", (event) => {
      event.preventDefault()
      root.querySelector("output")!.textContent = `Opened: ${link.dataset.title}`
    })
  }
}

export { mount }
