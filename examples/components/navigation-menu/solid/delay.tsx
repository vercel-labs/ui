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

function Example() {
  const [timing, setTiming] = createSignal(timings[1])

  return (
    <div data-slot="stack">
      <div role="group" aria-label="Timing" data-slot="row">
        <For each={timings}>
          {(option) => (
            <button aria-pressed={timing() === option ? "true" : "false"} onClick={() => setTiming(option)}>
              {option.label}
            </button>
          )}
        </For>
      </div>
      <NavigationMenu aria-label="Main" delay={timing().delay} closeDelay={timing().closeDelay}>
        <NavigationMenuList>
          <For each={sections}>
            {(section) => (
              <NavigationMenuItem value={section.value}>
                <NavigationMenuTrigger>
                  {section.label}
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
                    <For each={section.links}>
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
            )}
          </For>
        </NavigationMenuList>
        <NavigationMenuViewport />
      </NavigationMenu>
      <output data-slot="output">
        Opens after {timing().delay}ms, closes {timing().closeDelay}ms after the pointer leaves.
      </output>
    </div>
  )
}

export { Example }
