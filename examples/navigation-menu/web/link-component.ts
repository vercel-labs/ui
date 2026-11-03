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
    <div class="flex flex-col items-center gap-3">
      <ui-navigation-menu aria-label="Docs">
        <ui-navigation-menu-list class="flex flex-wrap items-center">
          <ui-navigation-menu-item value="guides">
            <ui-navigation-menu-trigger>
              <button class="group inline-flex h-8 items-center justify-center rounded-2xl px-2.5 text-sm font-medium outline-none transition-[color,background-color,box-shadow] hover:bg-muted focus-visible:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30 data-open:bg-muted/50 data-open:hover:bg-muted cursor-default motion-reduce:transition-none">
                Guides
                ${createElement(ChevronDown, { class: "relative top-px ms-1 size-3 transition-transform duration-300 group-data-open:rotate-180 motion-reduce:transition-none", "aria-hidden": "true" }).outerHTML}
              </button>
            </ui-navigation-menu-trigger>
            <ui-navigation-menu-content class="absolute start-0 top-0 w-[min(300px,calc(100vw-2rem))] p-1.5 max-h-[var(--available-height,var(--panel-height))] overflow-y-auto">
              <ul class="grid gap-1">
                ${gettingStarted
                  .map(
                    (page) => `
                <li>
                  <ui-navigation-menu-link>
                    <a href="${page.href}" data-router class="flex flex-col gap-1 rounded-xl p-2 text-sm outline-none transition-[color,background-color,box-shadow] hover:bg-muted focus-visible:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30 data-current:bg-muted/50 data-current:hover:bg-muted motion-reduce:transition-none">
                      <span class="leading-none font-medium">${page.title}</span>
                      <span class="line-clamp-2 leading-snug text-muted-foreground">${page.description}</span>
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
              <a href="#components" data-router class="inline-flex h-8 items-center rounded-2xl px-2.5 text-sm font-medium outline-none transition-[color,background-color,box-shadow] hover:bg-muted focus-visible:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30 data-current:bg-muted/50 data-current:hover:bg-muted cursor-default motion-reduce:transition-none">Components</a>
            </ui-navigation-menu-link>
          </ui-navigation-menu-item>
        </ui-navigation-menu-list>
        <ui-navigation-menu-viewport class="h-(--viewport-height) w-(--viewport-width) [--panel-height:var(--available-height)] origin-(--transform-origin) overflow-hidden rounded-3xl bg-popover text-popover-foreground shadow-lg ring-1 ring-foreground/5 outline-none transition-[opacity,scale,width,height,left,top] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 motion-reduce:transition-none dark:ring-foreground/10"></ui-navigation-menu-viewport>
      </ui-navigation-menu>
      <output class="text-sm text-muted-foreground"></output>
    </div>
  `
  const output = root.querySelector("output")!
  function navigate(route: string) {
    output.textContent = `Route: ${route}`
    for (const link of root.querySelectorAll("ui-navigation-menu-link")) {
      link.toggleAttribute("current", link.querySelector("a")!.getAttribute("href") === route)
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
