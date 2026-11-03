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

const timings = [
  { label: "Instant", delay: 0, closeDelay: 0 },
  { label: "Default", delay: 50, closeDelay: 50 },
  { label: "Patient", delay: 400, closeDelay: 600 },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <div role="group" aria-label="Timing" data-slot="row">
        ${timings.map((option, index) => `<button aria-pressed="${index === 1}" data-index="${index}">${option.label}</button>`).join("")}
      </div>
      <ui-navigation-menu aria-label="Main" delay="50" close-delay="50">
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
      <output data-slot="output">Opens after 50ms, closes 50ms after the pointer leaves.</output>
    </div>
  `
  const menu = root.querySelector("ui-navigation-menu")!
  const buttons = root.querySelectorAll<HTMLButtonElement>("[data-index]")
  for (const button of buttons) {
    button.addEventListener("click", () => {
      const timing = timings[Number(button.dataset.index)]
      menu.setAttribute("delay", String(timing.delay))
      menu.setAttribute("close-delay", String(timing.closeDelay))
      for (const other of buttons) {
        other.setAttribute("aria-pressed", String(other === button))
      }
      root.querySelector("output")!.textContent =
        `Opens after ${timing.delay}ms, closes ${timing.closeDelay}ms after the pointer leaves.`
    })
  }
}

export { mount }
