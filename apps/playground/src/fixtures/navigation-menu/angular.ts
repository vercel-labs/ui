import { Component } from "@angular/core"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  type NavigationMenuValueChange,
  NavigationMenuViewport,
} from "@ui-sdk/angular/navigation-menu"
import {
  navigationMenuAction,
  navigationMenuFixture,
  navigationMenuLayout,
  navigationMenuOptions,
} from "../../../../../tests/fixtures/navigation-menu"
import { indicatorOptions } from "../../../../../tests/fixtures/page"
import { mountAngular, state } from "../../angular-mount"

@Component({
  imports: [
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
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
        class="nav-menu"
        [attr.aria-label]="f.label"
        [delay]="options.delay"
        [closeDelay]="options.closeDelay"
        [defaultValue]="options.defaultValue"
        [orientation]="options.orientation"
        [openOnHover]="options.openOnHover"
        [closeOnSelect]="options.closeOnSelect"
        [container]="options.container"
        (beforeValueChange)="onValueChange($event)"
      >
        <ul
          uiNavigationMenuList
          class="nav-list"
          [class.vertical]="options.orientation === 'vertical'"
        >
          @for (item of f.items; track item.value; let index = $index) {
            <li uiNavigationMenuItem [value]="item.value">
              <button uiNavigationMenuTrigger class="nav-trigger">
                {{ item.trigger }}
              </button>
              <div
                *uiNavigationMenuContent="content"
                class="nav-content"
                [class.narrow]="index > 0"
              >
                <ul>
                  @for (link of item.links; track link.href) {
                    <li>
                      <a uiNavigationMenuLink [href]="link.href">{{
                        link.label
                      }}</a>
                    </li>
                  }
                </ul>
                @if (index === 1 && layout.nested) {
                  <div uiNavigationMenu orientation="vertical">
                    <ul uiNavigationMenuList class="nav-list vertical">
                      <li uiNavigationMenuItem [value]="f.nested.value">
                        <button uiNavigationMenuTrigger class="nav-trigger">
                          {{ f.nested.trigger }}
                        </button>
                        <div
                          *uiNavigationMenuContent
                          class="nav-content narrow"
                        >
                          <ul>
                            @for (link of f.nested.links; track link.href) {
                              <li>
                                <a uiNavigationMenuLink [href]="link.href">{{
                                  link.label
                                }}</a>
                              </li>
                            }
                          </ul>
                        </div>
                      </li>
                    </ul>
                  </div>
                }
              </div>
            </li>
          }
          <li uiNavigationMenuItem>
            <a
              uiNavigationMenuLink
              class="nav-link"
              [href]="f.link.href"
              current
              >{{ f.link.label }}</a
            >
          </li>
        </ul>
        <div
          uiNavigationMenuIndicator
          class="nav-indicator"
          [followHover]="indicator.followHover"
        ></div>
        @if (layout.viewport) {
          <div
            *uiNavigationMenuViewport="layout.placement"
            class="nav-viewport"
          ></div>
        }
      </nav>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
    </div>
  `,
})
class Fixture {
  readonly f = navigationMenuFixture
  readonly options: {
    delay: number
    closeDelay: number
    defaultValue?: string
    orientation?: "horizontal" | "vertical"
    openOnHover?: boolean
    closeOnSelect?: boolean
    container?: HTMLElement | null
  } = navigationMenuOptions()
  readonly layout = navigationMenuLayout()
  readonly indicator = indicatorOptions()
  readonly content = {
    keepMounted: this.layout.keepMounted,
    hiddenUntilFound: this.layout.hiddenUntilFound,
    ...this.layout.placement,
  }
  readonly action = state("")

  onValueChange({ value, reason }: NavigationMenuValueChange) {
    this.action.set(navigationMenuAction(value, reason))
  }
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
