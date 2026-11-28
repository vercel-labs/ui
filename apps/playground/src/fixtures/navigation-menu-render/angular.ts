import { Component } from "@angular/core"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  type NavigationMenuValueChange,
} from "@ui-sdk/angular/navigation-menu"
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
        aria-label="Docs"
        class="nav-menu"
        (beforeValueChange)="onValueChange($event)"
      >
        <ul uiNavigationMenuList class="nav-list">
          <li uiNavigationMenuItem value="guides">
            <button
              uiNavigationMenuTrigger
              #trigger="uiNavigationMenuTrigger"
              class="nav-trigger"
              [class.is-open]="trigger.state().open"
              [class.is-closed]="!trigger.state().open"
            >
              Guides
              <span aria-hidden="true">{{
                trigger.state().open ? "▲" : "▼"
              }}</span>
            </button>
            <section
              *uiNavigationMenuContent
              class="nav-content"
              aria-label="Guides panel"
            >
              <a
                uiNavigationMenuLink
                href="#intro"
                current
                (click)="route($event)"
                >Introduction</a
              >
              <a uiNavigationMenuLink href="#install" (click)="route($event)"
                >Install</a
              >
            </section>
          </li>
        </ul>
        <div *uiNavigationMenuViewport class="nav-viewport"></div>
      </nav>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
    </div>
  `,
})
class Fixture {
  readonly action = state("")

  onValueChange(change: NavigationMenuValueChange) {
    this.action.set(`${change.value ?? "close"}: ${change.reason}`)
  }

  // A client-side router's link: it navigates without a page load.
  route(event: Event) {
    event.preventDefault()
    history.pushState(
      null,
      "",
      (event.currentTarget as HTMLAnchorElement).getAttribute("href")
    )
  }
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
