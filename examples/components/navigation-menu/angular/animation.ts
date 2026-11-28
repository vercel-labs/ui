import { Component } from "@angular/core"
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
    <nav
      uiNavigationMenu
      aria-label="Main"
      (beforeValueChange)="
        log($event.value ? 'Showing ' + $event.value : 'Closing')
      "
      (openChangeComplete)="
        log($event ? 'Finished opening' : 'Finished closing')
      "
    >
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
                  <a uiNavigationMenuLink [href]="page.href">
                    <span>{{ page.title }}</span>
                    <span data-slot="hint">{{ page.description }}</span>
                  </a>
                </li>
              }
            </ul>
          </div>
        </li>
        <li uiNavigationMenuItem value="components">
          <button uiNavigationMenuTrigger>
            Components
            <svg lucideChevronDown></svg>
          </button>
          <div *uiNavigationMenuContent>
            <ul data-slot="grid">
              @for (page of components; track page.title) {
                <li>
                  <a uiNavigationMenuLink [href]="page.href">
                    <span>{{ page.title }}</span>
                    <span data-slot="hint">{{ page.description }}</span>
                  </a>
                </li>
              }
            </ul>
          </div>
        </li>
      </ul>
      <div
        *uiNavigationMenuViewport="{ sideOffset: 8 }"
        data-variant="slide"
      ></div>
    </nav>
  `,
})
class Example {
  readonly gettingStarted = [
    {
      title: "Introduction",
      href: "#",
      description: "Unstyled components with one core for every framework.",
    },
    {
      title: "Installation",
      href: "#",
      description:
        "Add the package for your framework and render your first part.",
    },
    {
      title: "Styling",
      href: "#",
      description:
        "Style parts with data attributes, CSS variables and any CSS.",
    },
  ]

  readonly components = [
    {
      title: "Alert Dialog",
      href: "#",
      description:
        "Asks for a decision before anything else on the page can be used.",
    },
    {
      title: "Hover Card",
      href: "#",
      description:
        "A preview of what a link points to, for people who pause on it.",
    },
    {
      title: "Progress",
      href: "#",
      description: "Shows how far along a task is, like an upload.",
    },
    {
      title: "Scroll Area",
      href: "#",
      description: "Scrolls its content with scrollbars you can style.",
    },
    {
      title: "Tabs",
      href: "#",
      description:
        "Shows one panel of content at a time, picked from a list of tabs.",
    },
    {
      title: "Tooltip",
      href: "#",
      description:
        "A short label for a control, shown on hover or keyboard focus.",
    },
  ]

  readonly log = useLog()
}

export { Example }
