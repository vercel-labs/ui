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

const sides = ["bottom", "top"] as const
const aligns = ["start", "center", "end"] as const
const anchors = ["trigger", "bar"] as const

function Example() {
  const [side, setSide] = createSignal<(typeof sides)[number]>("bottom")
  const [align, setAlign] = createSignal<(typeof aligns)[number]>("start")
  const [anchor, setAnchor] = createSignal<(typeof anchors)[number]>("trigger")
  const [bar, setBar] = createSignal<HTMLDivElement | null>(null)

  return (
    <div data-slot="stack">
      <div data-slot="row">
        <div role="group" aria-label="side" data-slot="row">
          <For each={sides}>
            {(option) => (
              <button aria-pressed={side() === option ? "true" : "false"} onClick={() => setSide(option)}>
                {option}
              </button>
            )}
          </For>
        </div>
        <div role="group" aria-label="align" data-slot="row">
          <For each={aligns}>
            {(option) => (
              <button aria-pressed={align() === option ? "true" : "false"} onClick={() => setAlign(option)}>
                {option}
              </button>
            )}
          </For>
        </div>
        <div role="group" aria-label="anchor" data-slot="row">
          <For each={anchors}>
            {(option) => (
              <button aria-pressed={anchor() === option ? "true" : "false"} onClick={() => setAnchor(option)}>
                {option}
              </button>
            )}
          </For>
        </div>
      </div>
      <div ref={setBar}>
        <NavigationMenu aria-label="Main">
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
          <NavigationMenuViewport
            side={side()}
            align={align()}
            anchor={anchor() === "bar" ? (bar() ?? undefined) : undefined}
            sideOffset={8}
            alignOffset={0}
            collisionPadding={16}
          />
        </NavigationMenu>
      </div>
    </div>
  )
}

export { Example }
