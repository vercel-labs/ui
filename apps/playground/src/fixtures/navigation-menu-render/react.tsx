import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@ui-sdk/react/navigation-menu"
import * as React from "react"
import { createRoot } from "react-dom/client"

// A client-side router's link: it navigates without a page load.
function RouterLink({ to, ...props }: React.ComponentProps<"a"> & { to: string }) {
  return (
    <a
      {...props}
      href={to}
      onClick={(event) => {
        props.onClick?.(event)
        event.preventDefault()
        history.pushState(null, "", to)
      }}
    />
  )
}

function Fixture() {
  const [action, setAction] = React.useState("")
  return (
    <div className="fixture">
      <button>Before</button>
      <NavigationMenu
        aria-label="Docs"
        className="nav-menu"
        onValueChange={(value, { reason }) => setAction(`${value ?? "close"}: ${reason}`)}
      >
        <NavigationMenuList className="nav-list">
          <NavigationMenuItem value="guides">
            <NavigationMenuTrigger
              className={(state) => (state.open ? "nav-trigger is-open" : "nav-trigger is-closed")}
              render={(props, state) => (
                <button {...props}>
                  Guides <span aria-hidden="true">{state.open ? "▲" : "▼"}</span>
                </button>
              )}
            />
            <NavigationMenuContent className="nav-content" render={<section aria-label="Guides panel" />}>
              <NavigationMenuLink render={<RouterLink to="#intro" />} current>
                Introduction
              </NavigationMenuLink>
              <NavigationMenuLink render={<RouterLink to="#install" />}>Install</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuViewport className="nav-viewport" />
      </NavigationMenu>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action}
      </output>
    </div>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(<Fixture />)
}

export { mount }
