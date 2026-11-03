import {
  NavigationMenu,
  NavigationMenuContent,
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
    <NavigationMenu
      aria-label="Main"
      class={(state) => (state.nested ? "" : "rounded-3xl border border-border p-1")}
    >
      <NavigationMenuList
        class={(state) =>
          state.orientation === "vertical" ? "flex flex-col gap-1" : "flex items-center gap-1"
        }
      >
        <For each={sections}>
          {(section) => (
            <NavigationMenuItem value={section.value}>
              <NavigationMenuTrigger
                render={(props, state) => (
                  <button {...props}>
                    {section.label}
                    {state.open ? (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                        class="size-3"
                      >
                        <path d="M5 12h14" />
                      </svg>
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                        class="size-3"
                      >
                        <path d="M5 12h14" />
                        <path d="M12 5v14" />
                      </svg>
                    )}
                  </button>
                )}
                class="inline-flex h-8 items-center gap-1.5 rounded-2xl px-2.5 text-sm font-medium outline-none transition-[color,background-color,box-shadow] hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30 data-open:bg-muted data-open:text-foreground cursor-default motion-reduce:transition-none"
              />
              <NavigationMenuContent
                render={(props) => <section {...props} aria-label={section.label} />}
                class="absolute start-0 top-0 w-[min(300px,calc(100vw-2rem))] p-1.5"
              >
                {(state) => (
                  <>
                    <p class="px-2 pt-1 pb-1 text-xs text-muted-foreground">
                      {state.motion ? `Moved in ${state.motion}` : "Opened"}
                    </p>
                    <ul class="grid gap-1">
                      <For each={section.links}>
                        {(link, index) => (
                          <li>
                            <NavigationMenuLink
                              href={link.href}
                              current={index() === 0}
                              render={(props, linkState) => (
                                <a {...props}>
                                  <span class="leading-none font-medium">{link.title}</span>
                                  {linkState.current && (
                                    <span class="text-xs text-muted-foreground">You're here</span>
                                  )}
                                </a>
                              )}
                              class="flex flex-col gap-0.5 rounded-xl p-2 text-sm outline-none transition-[color,background-color,box-shadow] hover:bg-muted focus-visible:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30 data-current:bg-muted/50 data-current:hover:bg-muted motion-reduce:transition-none"
                            />
                          </li>
                        )}
                      </For>
                    </ul>
                  </>
                )}
              </NavigationMenuContent>
            </NavigationMenuItem>
          )}
        </For>
        <NavigationMenuItem value="pricing">
          <NavigationMenuTrigger
            disabled
            render={(props, state) => (
              <button {...props}>
                Pricing
                {state.disabled && (
                  <span class="inline-flex h-5 items-center rounded-2xl bg-muted px-2 text-xs font-medium text-muted-foreground">
                    Soon
                  </span>
                )}
              </button>
            )}
            class="inline-flex h-8 items-center gap-1.5 rounded-2xl px-2.5 text-sm font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/30 data-disabled:text-muted-foreground cursor-default data-disabled:pointer-events-none data-disabled:opacity-50"
          />
          <NavigationMenuContent class="absolute start-0 top-0 w-[min(200px,calc(100vw-2rem))] p-4 text-sm max-h-[var(--available-height,var(--panel-height))] overflow-y-auto">
            Plans for teams.
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuViewport
        sideOffset={8}
        class="h-(--viewport-height) w-(--viewport-width) [--panel-height:var(--available-height)] origin-(--transform-origin) overflow-hidden rounded-3xl bg-popover text-popover-foreground shadow-lg ring-1 ring-foreground/5 outline-none transition-[opacity,scale,width,height,left,top] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 motion-reduce:transition-none dark:ring-foreground/10"
      />
    </NavigationMenu>
  )
}

export { Example }
