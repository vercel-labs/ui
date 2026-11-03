import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@ui-sdk/solid/navigation-menu"
import type { JSX } from "@solidjs/web"
import { createSignal, For, merge, omit } from "solid-js"

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

function Link(props: JSX.IntrinsicElements["a"] & { href: string; onNavigate: (href: string) => void }) {
  const onClick: JSX.EventHandler<HTMLAnchorElement, MouseEvent> = (event) => {
    if (typeof props.onClick === "function") {
      props.onClick(event)
    }
    event.preventDefault()
    props.onNavigate(props.href)
  }
  const link = merge(omit(props, "href", "onNavigate", "onClick"), {
    get href() {
      return props.href
    },
    onClick,
  })
  return <a {...link} />
}

function Example() {
  const [route, setRoute] = createSignal("#introduction")

  return (
    <div data-slot="stack">
      <NavigationMenu aria-label="Docs">
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
                      <NavigationMenuLink
                        render={(props) => <Link {...props} href={page.href} onNavigate={setRoute} />}
                        current={route() === page.href}
                      >
                        <span>{page.title}</span>
                        <span data-slot="hint">{page.description}</span>
                      </NavigationMenuLink>
                    </li>
                  )}
                </For>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              render={(props) => <Link {...props} href="#components" onNavigate={setRoute} />}
              current={route() === "#components"}
            >
              Components
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuViewport />
      </NavigationMenu>
      <output data-slot="output">Route: {route()}</output>
    </div>
  )
}

export { Example }
