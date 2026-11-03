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
import { ChevronDown } from "lucide-react"
import * as React from "react"

const gettingStarted = [
  {
    title: "Introduction",
    href: "#introduction",
    description: "Unstyled components with one core for every framework.",
  },
  {
    title: "Installation",
    href: "#installation",
    description: "Add the package for your framework and render your first part.",
  },
  {
    title: "Styling",
    href: "#styling",
    description: "Style parts with data attributes, CSS variables and any CSS.",
  },
]

function Link({
  href,
  onNavigate,
  ...props
}: React.ComponentProps<"a"> & { href: string; onNavigate: (href: string) => void }) {
  return (
    <a
      {...props}
      href={href}
      onClick={(event) => {
        props.onClick?.(event)
        event.preventDefault()
        onNavigate(href)
      }}
    />
  )
}

function Example() {
  const [route, setRoute] = React.useState("#introduction")

  return (
    <div className="flex flex-col items-center gap-3">
      <NavigationMenu aria-label="Docs">
        <NavigationMenuList className="flex flex-wrap items-center">
          <NavigationMenuItem value="guides">
            <NavigationMenuTrigger className="group inline-flex h-8 items-center justify-center rounded-2xl px-2.5 text-sm font-medium outline-none transition-[color,background-color,box-shadow] hover:bg-muted focus-visible:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30 data-open:bg-muted/50 data-open:hover:bg-muted cursor-default motion-reduce:transition-none">
              Guides
              <ChevronDown className="relative top-px ms-1 size-3 transition-transform duration-300 group-data-open:rotate-180 motion-reduce:transition-none" />
            </NavigationMenuTrigger>
            <NavigationMenuContent className="absolute start-0 top-0 w-[min(300px,calc(100vw-2rem))] p-1.5 max-h-[var(--available-height,var(--panel-height))] overflow-y-auto">
              <ul className="grid gap-1">
                {gettingStarted.map((page) => (
                  <li key={page.href}>
                    <NavigationMenuLink
                      render={<Link href={page.href} onNavigate={setRoute} />}
                      current={route === page.href}
                      className="flex flex-col gap-1 rounded-xl p-2 text-sm outline-none transition-[color,background-color,box-shadow] hover:bg-muted focus-visible:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30 data-current:bg-muted/50 data-current:hover:bg-muted motion-reduce:transition-none"
                    >
                      <span className="leading-none font-medium">{page.title}</span>
                      <span className="line-clamp-2 leading-snug text-muted-foreground">
                        {page.description}
                      </span>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              render={<Link href="#components" onNavigate={setRoute} />}
              current={route === "#components"}
              className="inline-flex h-8 items-center rounded-2xl px-2.5 text-sm font-medium outline-none transition-[color,background-color,box-shadow] hover:bg-muted focus-visible:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30 data-current:bg-muted/50 data-current:hover:bg-muted cursor-default motion-reduce:transition-none"
            >
              Components
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuViewport className="h-(--viewport-height) w-(--viewport-width) [--panel-height:var(--available-height)] origin-(--transform-origin) overflow-hidden rounded-3xl bg-popover text-popover-foreground shadow-lg ring-1 ring-foreground/5 outline-none transition-[opacity,scale,width,height,left,top] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 motion-reduce:transition-none dark:ring-foreground/10" />
      </NavigationMenu>
      <output className="text-sm text-muted-foreground">Route: {route}</output>
    </div>
  )
}

export { Example }
