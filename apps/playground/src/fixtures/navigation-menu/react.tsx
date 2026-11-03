import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@ui-sdk/react/navigation-menu"
import * as React from "react"
import { createRoot } from "react-dom/client"
import {
  navigationMenuAction,
  navigationMenuFixture as fixture,
  navigationMenuLayout,
  navigationMenuOptions,
} from "tests/fixtures/navigation-menu.ts"

function Nested() {
  const nested = fixture.nested
  return (
    <NavigationMenu orientation="vertical">
      <NavigationMenuList className="nav-list vertical">
        <NavigationMenuItem value={nested.value}>
          <NavigationMenuTrigger className="nav-trigger">{nested.trigger}</NavigationMenuTrigger>
          <NavigationMenuContent className="nav-content narrow">
            <ul>
              {nested.links.map((link) => (
                <li key={link.href}>
                  <NavigationMenuLink href={link.href}>{link.label}</NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

function Fixture() {
  const [action, setAction] = React.useState("")
  const options = navigationMenuOptions()
  const layout = navigationMenuLayout()
  return (
    <div className="fixture">
      <button>Before</button>
      <NavigationMenu
        {...options}
        aria-label={fixture.label}
        className="nav-menu"
        onValueChange={(value, { reason }) => setAction(navigationMenuAction(value, reason))}
      >
        <NavigationMenuList className={options.orientation === "vertical" ? "nav-list vertical" : "nav-list"}>
          {fixture.items.map((item, index) => (
            <NavigationMenuItem key={item.value} value={item.value}>
              <NavigationMenuTrigger className="nav-trigger">{item.trigger}</NavigationMenuTrigger>
              <NavigationMenuContent
                className={index === 0 ? "nav-content" : "nav-content narrow"}
                keepMounted={layout.keepMounted}
                hiddenUntilFound={layout.hiddenUntilFound}
                {...layout.placement}
              >
                <ul>
                  {item.links.map((link) => (
                    <li key={link.href}>
                      <NavigationMenuLink href={link.href}>{link.label}</NavigationMenuLink>
                    </li>
                  ))}
                </ul>
                {index === 1 && layout.nested && <Nested />}
              </NavigationMenuContent>
            </NavigationMenuItem>
          ))}
          <NavigationMenuItem>
            <NavigationMenuLink className="nav-link" href={fixture.link.href} current>
              {fixture.link.label}
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuIndicator className="nav-indicator" />
        {layout.viewport && <NavigationMenuViewport className="nav-viewport" {...layout.placement} />}
      </NavigationMenu>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action}
      </output>
    </div>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(
    <React.StrictMode>
      <Fixture />
    </React.StrictMode>,
  )
}

export { Fixture, mount }
