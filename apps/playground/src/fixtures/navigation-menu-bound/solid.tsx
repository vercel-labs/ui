import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@ui-sdk/solid/navigation-menu"
import { render } from "@solidjs/web"
import { createSignal, For, Show } from "solid-js"
import {
  exposeNavigationMenuValue,
  navigationMenuFixture as fixture,
  navigationMenuLayout,
} from "tests/fixtures/navigation-menu.ts"

function Fixture() {
  const layout = navigationMenuLayout()
  const [value, setValue] = createSignal<string | null>(null)
  const [completed, setCompleted] = createSignal<boolean[]>([])
  exposeNavigationMenuValue(setValue)
  return (
    <div class="fixture">
      <button>Before</button>
      <NavigationMenu
        aria-label="Main"
        class="nav-menu"
        delay={0}
        closeDelay={0}
        value={value()}
        onValueChange={setValue}
        onOpenChangeComplete={(open) => setCompleted([...completed(), open])}
      >
        <NavigationMenuList class="nav-list">
          <For each={fixture.items}>
            {(item) => (
              <NavigationMenuItem value={item.value}>
                <NavigationMenuTrigger class="nav-trigger">
                  {item.trigger}
                </NavigationMenuTrigger>
                <NavigationMenuContent class="nav-content">
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
                </NavigationMenuContent>
              </NavigationMenuItem>
            )}
          </For>
        </NavigationMenuList>
        <Show when={layout.viewport}>
          <NavigationMenuViewport class="nav-viewport" />
        </Show>
      </NavigationMenu>
      <button>After</button>
      <output role="status" aria-label="Completed">
        {completed().join(",")}
      </output>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { mount }
