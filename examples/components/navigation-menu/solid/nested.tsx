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

const groups = [
  {
    value: "overlays",
    label: "Overlays",
    links: [
      { title: "Dialog", href: "https://example.com/docs/components/dialog" },
      { title: "Popover", href: "https://example.com/docs/components/popover" },
      { title: "Tooltip", href: "https://example.com/docs/components/tooltip" },
    ],
  },
  {
    value: "forms",
    label: "Forms",
    links: [
      { title: "Input", href: "https://example.com/docs/components/input" },
      { title: "Select", href: "https://example.com/docs/components/select" },
      { title: "Checkbox", href: "https://example.com/docs/components/checkbox" },
    ],
  },
]

function Example() {
  return (
    <NavigationMenu aria-label="Main">
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
                {(link) => (
                  <li>
                    <NavigationMenuLink href={link.href}>
                      <span>{link.title}</span>
                      <span data-slot="hint">{link.description}</span>
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
            <NavigationMenu orientation="vertical">
              <NavigationMenuList>
                <For each={groups}>
                  {(group) => (
                    <NavigationMenuItem value={group.value}>
                      <NavigationMenuTrigger>
                        {group.label}
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          aria-hidden="true"
                        >
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      </NavigationMenuTrigger>
                      <NavigationMenuContent sideOffset={12}>
                        <ul>
                          <For each={group.links}>
                            {(link) => (
                              <li>
                                <NavigationMenuLink href={link.href}>{link.title}</NavigationMenuLink>
                              </li>
                            )}
                          </For>
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  )}
                </For>
              </NavigationMenuList>
            </NavigationMenu>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuViewport />
    </NavigationMenu>
  )
}

export { Example }
