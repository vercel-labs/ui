import "@ui-sdk/web/navigation-menu"
import { ChevronDown, createElement } from "lucide"

const gettingStarted = [
  {
    title: "Introduction",
    href: "#introduction",
    description: "Unstyled components with one core for every framework.",
  },
  {
    title: "Installation",
    href: "#installation",
    description: "Add the package for your framework and render your first part.",
  },
  {
    title: "Styling",
    href: "#styling",
    description: "Style parts with data attributes, CSS variables and any CSS.",
  },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-navigation-menu aria-label="Docs">
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
                    <a href="${page.href}" data-router>
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
          <ui-navigation-menu-item>
            <ui-navigation-menu-link>
              <a href="#components" data-router>Components</a>
            </ui-navigation-menu-link>
          </ui-navigation-menu-item>
        </ui-navigation-menu-list>
        <ui-navigation-menu-viewport></ui-navigation-menu-viewport>
      </ui-navigation-menu>
      <output data-slot="output"></output>
    </div>
  `
  const output = root.querySelector("output")!
  function navigate(route: string) {
    output.textContent = `Route: ${route}`
    for (const link of root.querySelectorAll("ui-navigation-menu-link")) {
      link.toggleAttribute("active", link.querySelector("a")!.getAttribute("href") === route)
    }
  }
  for (const link of root.querySelectorAll<HTMLAnchorElement>("a[data-router]")) {
    link.addEventListener("click", (event) => {
      event.preventDefault()
      navigate(link.getAttribute("href")!)
    })
  }
  navigate("#introduction")
}

export { mount }
