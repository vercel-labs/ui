import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@ui-sdk/solid/navigation-menu"
import { render, type JSX } from "@solidjs/web"
import { createSignal, merge, omit } from "solid-js"

// A client-side router's link: it navigates without a page load.
function RouterLink(props: JSX.IntrinsicElements["a"] & { to: string }) {
  const onClick: JSX.EventHandler<HTMLAnchorElement, MouseEvent> = (event) => {
    if (typeof props.onClick === "function") props.onClick(event)
    event.preventDefault()
    history.pushState(null, "", props.to)
  }
  const link = merge(omit(props, "to", "onClick"), {
    get href() {
      return props.to
    },
    onClick,
  })
  return <a {...link} />
}

function Fixture() {
  const [action, setAction] = createSignal("")
  return (
    <div class="fixture">
      <button>Before</button>
      <NavigationMenu
        aria-label="Docs"
        class="nav-menu"
        onValueChange={(value, { reason }) => setAction(`${value ?? "close"}: ${reason}`)}
      >
        <NavigationMenuList class="nav-list">
          <NavigationMenuItem value="guides">
            <NavigationMenuTrigger
              class={(state) => (state.open ? "nav-trigger is-open" : "nav-trigger is-closed")}
              render={(props, state) => (
                <button {...props}>
                  Guides <span aria-hidden="true">{state.open ? "▲" : "▼"}</span>
                </button>
              )}
            />
            <NavigationMenuContent
              class="nav-content"
              render={(props) => <section {...props} aria-label="Guides panel" />}
            >
              <NavigationMenuLink render={(props) => <RouterLink {...props} to="#intro" />} current>
                Introduction
              </NavigationMenuLink>
              <NavigationMenuLink render={(props) => <RouterLink {...props} to="#install" />}>
                Install
              </NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuViewport class="nav-viewport" />
      </NavigationMenu>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action()}
      </output>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { mount }
