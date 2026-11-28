import { Component } from "@angular/core"
import {
  LucideArrowRight,
  LucideChevronDown,
  LucideCircle,
  LucideCircleCheck,
  LucideCircleQuestionMark,
  LucideDynamicIcon,
} from "@lucide/angular"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuLinkIcon,
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
    NavigationMenuLinkIcon,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
    LucideChevronDown,
    LucideDynamicIcon,
  ],
  template: `
    <nav uiNavigationMenu aria-label="Main">
      <ul uiNavigationMenuList>
        <li uiNavigationMenuItem value="getting-started">
          <button uiNavigationMenuTrigger>
            Getting started
            <svg lucideChevronDown></svg>
          </button>
          <div *uiNavigationMenuContent>
            <ul data-slot="grid">
              <li>
                <a uiNavigationMenuLink href="#" data-variant="featured">
                  <span>ui-sdk</span>
                  <span data-slot="hint">
                    Accessible components for React, Vue, Svelte, Solid and Web
                    Components.
                  </span>
                </a>
              </li>
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
        <li uiNavigationMenuItem value="with-icon">
          <button uiNavigationMenuTrigger>
            With Icon
            <svg lucideChevronDown></svg>
          </button>
          <div *uiNavigationMenuContent>
            <ul>
              @for (status of statuses; track status.title) {
                <li>
                  <a uiNavigationMenuLink [href]="status.href">
                    <span uiNavigationMenuLinkIcon [mirror]="status.mirror">
                      <svg [lucideIcon]="status.icon"></svg>
                    </span>
                    {{ status.title }}
                  </a>
                </li>
              }
            </ul>
          </div>
        </li>
        <li uiNavigationMenuItem>
          <a uiNavigationMenuLink href="#">Docs</a>
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

  readonly statuses = [
    { title: "Backlog", href: "#", icon: LucideCircleQuestionMark },
    { title: "To do", href: "#", icon: LucideCircle },
    { title: "Done", href: "#", icon: LucideCircleCheck },
    { title: "All issues", href: "#", icon: LucideArrowRight, mirror: true },
  ]
}

export { Example }
