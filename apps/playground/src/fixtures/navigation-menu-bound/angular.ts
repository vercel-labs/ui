import { Component } from "@angular/core"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@ui-sdk/angular/navigation-menu"
import {
  exposeNavigationMenuValue,
  navigationMenuFixture,
  navigationMenuLayout,
} from "../../../../../tests/fixtures/navigation-menu"
import { mountAngular, state } from "../../angular-mount"

@Component({
  imports: [
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <nav
        uiNavigationMenu
        aria-label="Main"
        class="nav-menu"
        [delay]="0"
        [closeDelay]="0"
        [value]="value()"
        (valueChange)="value.set($event)"
        (openChangeComplete)="completed.set(completed().concat($event))"
      >
        <ul uiNavigationMenuList class="nav-list">
          @for (item of f.items; track item.value) {
            <li uiNavigationMenuItem [value]="item.value">
              <button
                uiNavigationMenuTrigger
                class="nav-trigger"
                [textContent]="item.trigger"
              ></button>
              <div *uiNavigationMenuContent class="nav-content">
                <ul>
                  @for (link of item.links; track link.href) {
                    <li>
                      <a uiNavigationMenuLink [href]="link.href">{{
                        link.label
                      }}</a>
                    </li>
                  }
                </ul>
              </div>
            </li>
          }
        </ul>
        @if (layout.viewport) {
          <div *uiNavigationMenuViewport class="nav-viewport"></div>
        }
      </nav>
      <button>After</button>
      <output role="status" aria-label="Completed">{{
        completed().join(",")
      }}</output>
    </div>
  `,
})
class Fixture {
  readonly f = navigationMenuFixture
  readonly layout = navigationMenuLayout()
  readonly value = state<string | null>(null)
  readonly completed = state<boolean[]>([])

  constructor() {
    exposeNavigationMenuValue((value) => this.value.set(value))
  }
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
