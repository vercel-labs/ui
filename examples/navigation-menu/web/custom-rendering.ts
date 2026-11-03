import "@ui-sdk/web/navigation-menu"
import { Minus, Plus, createElement } from "lucide"

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
    <ui-navigation-menu aria-label="Main" class="rounded-3xl border border-border p-1 data-nested:border-0 data-nested:p-0">
      <ui-navigation-menu-list class="flex items-center gap-1 data-[orientation=vertical]:flex-col">
        ${sections
          .map(
            (section) => `
        <ui-navigation-menu-item value="${section.value}">
          <ui-navigation-menu-trigger>
            <button class="group inline-flex h-8 items-center gap-1.5 rounded-2xl px-2.5 text-sm font-medium outline-none transition-[color,background-color,box-shadow] hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30 data-open:bg-muted data-open:text-foreground cursor-default motion-reduce:transition-none">
              ${section.label}
              ${createElement(Plus, { class: "size-3 group-data-open:hidden", "aria-hidden": "true" }).outerHTML}
              ${createElement(Minus, { class: "hidden size-3 group-data-open:block", "aria-hidden": "true" }).outerHTML}
            </button>
          </ui-navigation-menu-trigger>
          <ui-navigation-menu-content as-child>
            <section aria-label="${section.label}" class="group absolute start-0 top-0 w-[min(300px,calc(100vw-2rem))] p-1.5">
              <p class="px-2 pt-1 pb-1 text-xs text-muted-foreground">
                <span class="group-data-motion:hidden">Opened</span>
                <span class="hidden group-data-[motion=from-end]:inline">Moved in from-end</span>
                <span class="hidden group-data-[motion=from-start]:inline">Moved in from-start</span>
              </p>
              <ul class="grid gap-1">
                ${section.links
                  .map(
                    (link, index) => `
                <li>
                  <ui-navigation-menu-link${index === 0 ? " current" : ""}>
                    <a href="${link.href}" class="group/link flex flex-col gap-0.5 rounded-xl p-2 text-sm outline-none transition-[color,background-color,box-shadow] hover:bg-muted focus-visible:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30 data-current:bg-muted/50 data-current:hover:bg-muted motion-reduce:transition-none">
                      <span class="leading-none font-medium">${link.title}</span>
                      <span class="hidden text-xs text-muted-foreground group-data-current/link:inline">You're here</span>
                    </a>
                  </ui-navigation-menu-link>
                </li>`,
                  )
                  .join("")}
              </ul>
            </section>
          </ui-navigation-menu-content>
        </ui-navigation-menu-item>`,
          )
          .join("")}
        <ui-navigation-menu-item value="pricing">
          <ui-navigation-menu-trigger disabled>
            <button class="group inline-flex h-8 items-center gap-1.5 rounded-2xl px-2.5 text-sm font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/30 data-disabled:text-muted-foreground cursor-default data-disabled:pointer-events-none data-disabled:opacity-50">
              Pricing
              <span class="hidden h-5 items-center rounded-2xl bg-muted px-2 text-xs font-medium text-muted-foreground group-data-disabled:inline-flex">Soon</span>
            </button>
          </ui-navigation-menu-trigger>
          <ui-navigation-menu-content class="absolute start-0 top-0 w-[min(200px,calc(100vw-2rem))] p-4 text-sm max-h-[var(--available-height,var(--panel-height))] overflow-y-auto">Plans for teams.</ui-navigation-menu-content>
        </ui-navigation-menu-item>
      </ui-navigation-menu-list>
      <ui-navigation-menu-viewport side-offset="8" class="h-(--viewport-height) w-(--viewport-width) [--panel-height:var(--available-height)] origin-(--transform-origin) overflow-hidden rounded-3xl bg-popover text-popover-foreground shadow-lg ring-1 ring-foreground/5 outline-none transition-[opacity,scale,width,height,left,top] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 motion-reduce:transition-none dark:ring-foreground/10"></ui-navigation-menu-viewport>
    </ui-navigation-menu>
  `
}

export { mount }
