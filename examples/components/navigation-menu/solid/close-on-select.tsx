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
  const [opened, setOpened] = createSignal("")

  return (
    <div data-slot="stack">
      <NavigationMenu aria-label="Main" closeOnSelect={false}>
        <NavigationMenuList>
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
              <ul>
                <For each={components}>
                  {(page) => (
                    <li>
                      <NavigationMenuLink
                        href={page.href}
                        onClick={(event) => {
                          event.preventDefault()
                          setOpened(page.title)
                        }}
                      >
                        {page.title}
                      </NavigationMenuLink>
                    </li>
                  )}
                </For>
              </ul>
              <ul>
                <li>
                  <NavigationMenuLink
                    href="https://example.com/docs/components"
                    closeOnSelect
                    onClick={(event) => {
                      event.preventDefault()
                      setOpened("All components")
                    }}
                  >
                    Browse all
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuViewport />
      </NavigationMenu>
      <output data-slot="output">{opened() ? `Opened: ${opened()}` : "Press a link"}</output>
    </div>
  )
}

export { Example }
