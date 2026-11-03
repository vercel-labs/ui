"use client"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@ui-sdk/react/navigation-menu"
import { ChevronDownIcon } from "lucide-react"
import * as React from "react"

const sections = [
  {
    value: "guides",
    label: "Guides",
    links: [
      {
        title: "Introduction",
        href: "https://example.com/docs",
        description: "Unstyled components with one core for every framework.",
      },
      {
        title: "Installation",
        href: "https://example.com/docs/installation",
        description: "Add the package for your framework and render your first part.",
      },
      {
        title: "Styling",
        href: "https://example.com/docs/styling",
        description: "Style parts with data attributes, CSS variables and any CSS.",
      },
    ],
  },
  {
    value: "components",
    label: "Components",
    links: [
      {
        title: "Alert Dialog",
        href: "https://example.com/docs/components/alert-dialog",
        description: "Asks for a decision before anything else on the page can be used.",
      },
      {
        title: "Hover Card",
        href: "https://example.com/docs/components/hover-card",
        description: "A preview of what a link points to, for people who pause on it.",
      },
      {
        title: "Progress",
        href: "https://example.com/docs/components/progress",
        description: "Shows how far along a task is, like an upload.",
      },
      {
        title: "Scroll Area",
        href: "https://example.com/docs/components/scroll-area",
        description: "Scrolls its content with scrollbars you can style.",
      },
    ],
  },
]

const sides = ["bottom", "top"] as const
const aligns = ["start", "center", "end"] as const
const anchors = ["trigger", "bar"] as const

function Example() {
  const [side, setSide] = React.useState<(typeof sides)[number]>("bottom")
  const [align, setAlign] = React.useState<(typeof aligns)[number]>("start")
  const [anchor, setAnchor] = React.useState<(typeof anchors)[number]>("trigger")
  const [bar, setBar] = React.useState<HTMLDivElement | null>(null)

  return (
    <div data-slot="stack">
      <div data-slot="row">
        <div role="group" aria-label="side" data-slot="row">
          {sides.map((option) => (
            <button key={option} aria-pressed={side === option} onClick={() => setSide(option)}>
              {option}
            </button>
          ))}
        </div>
        <div role="group" aria-label="align" data-slot="row">
          {aligns.map((option) => (
            <button key={option} aria-pressed={align === option} onClick={() => setAlign(option)}>
              {option}
            </button>
          ))}
        </div>
        <div role="group" aria-label="anchor" data-slot="row">
          {anchors.map((option) => (
            <button key={option} aria-pressed={anchor === option} onClick={() => setAnchor(option)}>
              {option}
            </button>
          ))}
        </div>
      </div>
      <div ref={setBar}>
        <NavigationMenu aria-label="Main">
          <NavigationMenuList>
            {sections.map((section) => (
              <NavigationMenuItem key={section.value} value={section.value}>
                <NavigationMenuTrigger>
                  {section.label}
                  <ChevronDownIcon />
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul>
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <NavigationMenuLink href={link.href}>
                          <span>{link.title}</span>
                          <span data-slot="hint">{link.description}</span>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
          <NavigationMenuViewport
            side={side}
            align={align}
            anchor={anchor === "bar" ? bar : undefined}
            sideOffset={8}
            alignOffset={0}
            collisionPadding={16}
          />
        </NavigationMenu>
      </div>
    </div>
  )
}

export { Example }
