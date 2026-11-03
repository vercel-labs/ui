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

function Example() {
  const [value, setValue] = React.useState<string | null>(null)
  const [reason, setReason] = React.useState("")

  return (
    <div data-slot="stack">
      <div data-slot="row">
        <button
          onClick={() => {
            setValue("components")
            setReason("imperative")
          }}
        >
          Open Components
        </button>
        <button
          onClick={() => {
            setValue(null)
            setReason("imperative")
          }}
        >
          Close
        </button>
      </div>
      <NavigationMenu
        aria-label="Main"
        value={value}
        onValueChange={(next, details) => {
          setValue(next)
          setReason(details.reason)
        }}
      >
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
        <NavigationMenuViewport />
      </NavigationMenu>
      <output data-slot="output">
        {value ? `Open: ${value}` : "Closed"}
        {reason && `, last change: ${reason}`}
      </output>
    </div>
  )
}

export { Example }
