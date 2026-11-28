import { Component } from "@angular/core"
import { LucideMinus, LucidePlus } from "@lucide/angular"
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
    LucideMinus,
    LucidePlus,
  ],
  template: `
    <nav uiNavigationMenu aria-label="Main">
      <ul uiNavigationMenuList>
        @for (section of sections; track section.value) {
          <li uiNavigationMenuItem [value]="section.value">
            <button
              uiNavigationMenuTrigger
              #navigationMenuTrigger2="uiNavigationMenuTrigger"
            >
              {{ section.label }}
              @if (navigationMenuTrigger2.state().open) {
                <svg lucideMinus></svg>
              } @else {
                <svg lucidePlus></svg>
              }
            </button>
            <section
              *uiNavigationMenuContent="let content"
              [attr.aria-label]="section.label"
            >
              <p data-slot="hint">
                {{ content.motion ? "Moved in " + content.motion : "Opened" }}
              </p>
              <ul>
                @for (
                  link of section.links;
                  track link.title;
                  let index = $index
                ) {
                  <li>
                    <a
                      uiNavigationMenuLink
                      #navigationMenuLink="uiNavigationMenuLink"
                      [href]="link.href"
                      [current]="index === 0"
                    >
                      <span>{{ link.title }}</span>
                      @if (navigationMenuLink.state().current) {
                        <span data-slot="hint" data-show="current"
                          >You're here</span
                        >
                      }
                    </a>
                  </li>
                }
              </ul>
            </section>
          </li>
        }
        <li uiNavigationMenuItem value="pricing">
          <button
            uiNavigationMenuTrigger
            #navigationMenuTrigger="uiNavigationMenuTrigger"
            disabled
          >
            Pricing
            @if (navigationMenuTrigger.state().disabled) {
              <span data-slot="badge" data-show="disabled">Soon</span>
            }
          </button>
          <div *uiNavigationMenuContent>Plans for teams.</div>
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
