import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@ui-sdk/solid/navigation-menu"
import { createSignal, For } from "solid-js"

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

function Example() {
  const [status, setStatus] = createSignal("Closed")

  return (
    <div data-slot="stack">
      <NavigationMenu
        aria-label="Main"
        onValueChange={(value) => setStatus(value ? `Showing ${value}` : "Closing")}
        onOpenChangeComplete={(open) => setStatus(open ? "Open" : "Closed")}
      >
        <NavigationMenuList>
          <NavigationMenuItem value="guides">
            <NavigationMenuTrigger>
              Guides
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul>
                <For each={gettingStarted}>
                  {(page) => (
                    <li>
                      <NavigationMenuLink href={page.href}>
                        <span>{page.title}</span>
                        <span data-slot="hint">{page.description}</span>
                      </NavigationMenuLink>
                    </li>
                  )}
                </For>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem value="components">
            <NavigationMenuTrigger>
              Components
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul data-slot="grid">
                <For each={components}>
                  {(page) => (
                    <li>
                      <NavigationMenuLink href={page.href}>
                        <span>{page.title}</span>
                        <span data-slot="hint">{page.description}</span>
                      </NavigationMenuLink>
                    </li>
                  )}
                </For>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuViewport data-variant="slide" />
      </NavigationMenu>
      <output data-slot="output">{status()}</output>
    </div>
  )
}

export { Example }
