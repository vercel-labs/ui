import { Component, signal } from "@angular/core"
import { LucideChevronDown } from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@ui-sdk/angular/navigation-menu"

@Component({
  imports: [
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
    LucideChevronDown,
  ],
  template: `
    <nav uiNavigationMenu aria-label="Docs">
      <ul uiNavigationMenuList>
        <li uiNavigationMenuItem value="guides">
          <button uiNavigationMenuTrigger>
            Guides
            <svg lucideChevronDown></svg>
          </button>
          <div *uiNavigationMenuContent>
            <ul>
              @for (page of gettingStarted; track page.title) {
                <li>
                  <a
                    uiNavigationMenuLink
                    [href]="page.href"
                    [current]="route() === page.href"
                    (click)="navigate($event, page.href)"
                  >
                    <span>{{ page.title }}</span>
                    <span data-slot="hint">{{ page.description }}</span>
                  </a>
                </li>
              }
            </ul>
          </div>
        </li>
        <li uiNavigationMenuItem>
          <a
            uiNavigationMenuLink
            href="#components"
            [current]="route() === '#components'"
            (click)="navigate($event, '#components')"
          >
            Components
          </a>
        </li>
      </ul>
      <div *uiNavigationMenuViewport="{ sideOffset: 8 }"></div>
    </nav>
  `,
})
class Example {
  readonly gettingStarted = [
    {
      title: "Introduction",
      href: "#introduction",
      description: "Unstyled components with one core for every framework.",
    },
    {
      title: "Installation",
      href: "#installation",
      description:
        "Add the package for your framework and render your first part.",
    },
    {
      title: "Styling",
      href: "#styling",
      description:
        "Style parts with data attributes, CSS variables and any CSS.",
    },
  ]

  readonly log = useLog()

  readonly route = signal("#introduction")

  navigate(event: MouseEvent, href: string) {
    event.preventDefault()
    this.route.set(href)
    this.log(`Navigated to ${href}`)
  }
}

export { Example }
