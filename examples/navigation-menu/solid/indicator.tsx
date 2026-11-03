import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@ui-sdk/solid/navigation-menu"
import { For } from "solid-js"

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

function Example() {
  return (
    <NavigationMenu aria-label="Main" class="relative">
      <NavigationMenuList class="flex flex-wrap items-center">
        <For each={sections}>
          {(section) => (
            <NavigationMenuItem value={section.value}>
              <NavigationMenuTrigger class="group inline-flex h-8 items-center justify-center rounded-2xl px-2.5 text-sm font-medium outline-none transition-[color,background-color,box-shadow] hover:bg-muted focus-visible:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30 data-open:bg-muted/50 data-open:hover:bg-muted cursor-default motion-reduce:transition-none">
                {section.label}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                  class="relative top-px ms-1 size-3 transition-transform duration-300 group-data-open:rotate-180 motion-reduce:transition-none"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </NavigationMenuTrigger>
              <NavigationMenuContent class="absolute start-0 top-0 w-[min(300px,calc(100vw-2rem))] p-1.5 max-h-[var(--available-height,var(--panel-height))] overflow-y-auto">
                <ul class="grid gap-1">
                  <For each={section.links}>
                    {(link) => (
                      <li>
                        <NavigationMenuLink
                          href={link.href}
                          class="flex flex-col gap-1 rounded-xl p-2 text-sm outline-none transition-[color,background-color,box-shadow] hover:bg-muted focus-visible:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30 motion-reduce:transition-none"
                        >
                          <span class="leading-none font-medium">{link.title}</span>
                          <span class="line-clamp-2 leading-snug text-muted-foreground">
                            {link.description}
                          </span>
                        </NavigationMenuLink>
                      </li>
                    )}
                  </For>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          )}
        </For>
        <NavigationMenuItem>
          <NavigationMenuLink
            href="https://example.com/docs"
            current
            class="inline-flex h-8 items-center rounded-2xl px-2.5 text-sm font-medium outline-none transition-[color,background-color,box-shadow] hover:bg-muted focus-visible:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30 data-current:bg-muted/50 data-current:hover:bg-muted cursor-default motion-reduce:transition-none"
          >
            Docs
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuIndicator class="absolute bottom-(--active-item-bottom) left-(--active-item-left) h-0.5 w-(--active-item-width) rounded-full bg-foreground opacity-0 transition-[left,width,opacity] duration-200 ease-out data-visible:opacity-100 motion-reduce:transition-none" />
      <NavigationMenuViewport
        sideOffset={8}
        class="h-(--viewport-height) w-(--viewport-width) [--panel-height:var(--available-height)] origin-(--transform-origin) overflow-hidden rounded-3xl bg-popover text-popover-foreground shadow-lg ring-1 ring-foreground/5 outline-none transition-[opacity,scale,width,height,left,top] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 motion-reduce:transition-none dark:ring-foreground/10"
      />
    </NavigationMenu>
  )
}

export { Example }
