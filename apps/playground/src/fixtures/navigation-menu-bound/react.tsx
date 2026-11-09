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
  exposeNavigationMenuValue,
  navigationMenuFixture as fixture,
  navigationMenuLayout,
} from "tests/fixtures/navigation-menu.ts"

function Fixture() {
  const layout = navigationMenuLayout()
  const [value, setValue] = React.useState<string | null>(null)
  const [completed, setCompleted] = React.useState<boolean[]>([])
  exposeNavigationMenuValue(setValue)
  return (
    <div className="fixture">
      <button>Before</button>
      <NavigationMenu
        aria-label="Main"
        className="nav-menu"
        delay={0}
        closeDelay={0}
        value={value}
        onValueChange={setValue}
        onOpenChangeComplete={(open) => setCompleted((list) => [...list, open])}
      >
        <NavigationMenuList className="nav-list">
          {fixture.items.map((item) => (
            <NavigationMenuItem key={item.value} value={item.value}>
              <NavigationMenuTrigger className="nav-trigger">
                {item.trigger}
              </NavigationMenuTrigger>
              <NavigationMenuContent className="nav-content">
                <ul>
                  {item.links.map((link) => (
                    <li key={link.href}>
                      <NavigationMenuLink href={link.href}>
                        {link.label}
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
        {layout.viewport && <NavigationMenuViewport className="nav-viewport" />}
      </NavigationMenu>
      <button>After</button>
      <output role="status" aria-label="Completed">
        {completed.join(",")}
      </output>
    </div>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(
    <React.StrictMode>
      <Fixture />
    </React.StrictMode>
  )
}

export { mount }
