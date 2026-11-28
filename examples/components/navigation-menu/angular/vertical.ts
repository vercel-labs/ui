import { Component } from "@angular/core"
import { LucideChevronRight } from "@lucide/angular"
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
    LucideChevronRight,
  ],
  template: `
    <nav uiNavigationMenu aria-label="Sidebar" orientation="vertical">
      <ul uiNavigationMenuList>
        @for (section of sections; track section.value) {
          <li uiNavigationMenuItem [value]="section.value">
            <button uiNavigationMenuTrigger>
              {{ section.label }}
              <svg lucideChevronRight></svg>
            </button>
            <div *uiNavigationMenuContent>
              <ul>
                @for (link of section.links; track link.title) {
                  <li>
                    <a uiNavigationMenuLink [href]="link.href">
                      <span>{{ link.title }}</span>
                      <span data-slot="hint">{{ link.description }}</span>
                    </a>
                  </li>
                }
              </ul>
            </div>
          </li>
        }
        <li uiNavigationMenuItem>
          <a uiNavigationMenuLink href="#">Docs</a>
        </li>
      </ul>
      <div *uiNavigationMenuViewport="{ sideOffset: 8 }"></div>
    </nav>
  `,
})
class Example {
  readonly sections = [
    {
      value: "guides",
      label: "Guides",
      links: [
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
      ],
    },
    {
      value: "components",
      label: "Components",
      links: [
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
      ],
    },
  ]
}

export { Example }
