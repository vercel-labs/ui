import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@ui-sdk/solid/navigation-menu"
import { render } from "@solidjs/web"
import { createSignal, For, Show } from "solid-js"
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
      <NavigationMenuList class="nav-list vertical">
        <NavigationMenuItem value={nested.value}>
          <NavigationMenuTrigger class="nav-trigger">
            {nested.trigger}
          </NavigationMenuTrigger>
          <NavigationMenuContent class="nav-content narrow">
            <ul>
              <For each={nested.links}>
                {(link) => (
                  <li>
                    <NavigationMenuLink href={link.href}>
                      {link.label}
                    </NavigationMenuLink>
                  </li>
                )}
              </For>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

function Fixture() {
  const [action, setAction] = createSignal("")
  const options = navigationMenuOptions()
  const layout = navigationMenuLayout()
  return (
    <div class="fixture">
      <button>Before</button>
      <NavigationMenu
        {...options}
        aria-label={fixture.label}
        class="nav-menu"
        onValueChange={(value, { reason }) =>
          setAction(navigationMenuAction(value, reason))
        }
      >
        <NavigationMenuList
          class={
            options.orientation === "vertical"
              ? "nav-list vertical"
              : "nav-list"
          }
        >
          <For each={fixture.items}>
            {(item, index) => (
              <NavigationMenuItem value={item.value}>
                <NavigationMenuTrigger class="nav-trigger">
                  {item.trigger}
                </NavigationMenuTrigger>
                <NavigationMenuContent
                  class={index() === 0 ? "nav-content" : "nav-content narrow"}
                  keepMounted={layout.keepMounted}
                  hiddenUntilFound={layout.hiddenUntilFound}
                  {...layout.placement}
                >
                  <ul>
                    <For each={item.links}>
                      {(link) => (
                        <li>
                          <NavigationMenuLink href={link.href}>
                            {link.label}
                          </NavigationMenuLink>
                        </li>
                      )}
                    </For>
                  </ul>
                  <Show when={index() === 1 && layout.nested}>
                    <Nested />
                  </Show>
                </NavigationMenuContent>
              </NavigationMenuItem>
            )}
          </For>
          <NavigationMenuItem>
            <NavigationMenuLink
              class="nav-link"
              href={fixture.link.href}
              current
            >
              {fixture.link.label}
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuIndicator class="nav-indicator" />
        <Show when={layout.viewport}>
          <NavigationMenuViewport class="nav-viewport" {...layout.placement} />
        </Show>
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

export { Fixture, mount }
