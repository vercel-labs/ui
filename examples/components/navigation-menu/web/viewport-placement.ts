import "@ui-sdk/web/navigation-menu"
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

const controls = {
  side: ["bottom", "top"],
  align: ["start", "center", "end"],
  anchor: ["trigger", "bar"],
}

function mount(root: HTMLElement) {
  const id = `viewport-placement-bar-${crypto.randomUUID()}`
  root.innerHTML = `
    <div data-slot="stack">
      <div data-slot="row">
        ${Object.entries(controls)
          .map(
            ([name, options]) => `
        <div role="group" aria-label="${name}" data-slot="row">
          ${options.map((option, index) => `<button aria-pressed="${index === 0}" data-${name}="${option}">${option}</button>`).join("")}
        </div>`,
          )
          .join("")}
      </div>
      <div id="${id}">
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
          <ui-navigation-menu-viewport side="bottom" align="start" side-offset="8" align-offset="0" collision-padding="16"></ui-navigation-menu-viewport>
        </ui-navigation-menu>
      </div>
    </div>
  `
  const viewport = root.querySelector("ui-navigation-menu-viewport")!
  for (const name of Object.keys(controls)) {
    const buttons = root.querySelectorAll<HTMLButtonElement>(`[data-${name}]`)
    for (const button of buttons) {
      button.addEventListener("click", () => {
        const option = button.getAttribute(`data-${name}`)!
        if (name !== "anchor") {
          viewport.setAttribute(name, option)
        } else if (option === "bar") {
          viewport.setAttribute("anchor", `#${id}`)
        } else {
          viewport.removeAttribute("anchor")
        }
        for (const other of buttons) {
          other.setAttribute("aria-pressed", String(other === button))
        }
      })
    }
  }
}

export { mount }
