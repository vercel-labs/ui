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
import {
  navigationMenuFixture as fixture,
  navigationMenuLayout,
} from "tests/fixtures/navigation-menu.ts"

const w = window as any
w.__calls = []

function Nested() {
  const nested = fixture.nested
  return (
    <NavigationMenu
      orientation="vertical"
      onValueChange={(v, d) => w.__calls.push(["nested", v, d.reason])}
    >
      <NavigationMenuList className="nav-list vertical">
        <NavigationMenuItem value={nested.value}>
          <NavigationMenuTrigger className="nav-trigger">
            {nested.trigger}
          </NavigationMenuTrigger>
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
      {new URLSearchParams(location.search).has("nested-viewport") && (
        <NavigationMenuViewport className="nav-viewport nested-vp" />
      )}
    </NavigationMenu>
  )
}

function Fixture() {
  const params = new URLSearchParams(location.search)
  const layout = navigationMenuLayout()
  const refuse = params.has("refuse")
  const controlled = params.has("controlled") || refuse
  const [value, setValue] = React.useState<string | null>(null)
  const state = controlled ? { value } : {}
  return (
    <div className="fixture">
      <button>Before</button>
      <NavigationMenu
        aria-label="Main"
        className="nav-menu"
        delay={0}
        closeDelay={0}
        openOnHover={false}
        {...state}
        onValueChange={(v, d) => {
          w.__calls.push(["root", v, d.reason])
          if (refuse && v === null) return
          setValue(v)
        }}
      >
        <NavigationMenuList className="nav-list">
          {fixture.items.map((item, index) => (
            <NavigationMenuItem key={item.value} value={item.value}>
              <NavigationMenuTrigger className="nav-trigger">{item.trigger}</NavigationMenuTrigger>
              <NavigationMenuContent
                className="nav-content"
                keepMounted={layout.keepMounted}
                hiddenUntilFound={layout.hiddenUntilFound}
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
            <NavigationMenuLink className="nav-link" href={fixture.link.href}>
              {fixture.link.label}
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuViewport className="nav-viewport root-vp" />
      </NavigationMenu>
    </div>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(
    params().has("strict") ? (
      <React.StrictMode>
        <Fixture />
      </React.StrictMode>
    ) : (
      <Fixture />
    )
  )
}
const params = () => new URLSearchParams(location.search)

export { mount }
