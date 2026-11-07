"use client"

import { cn } from "cn"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@ui-sdk/react/navigation-menu"
import { frameworkIds, frameworks } from "@/lib/frameworks"
import { menu } from "@/lib/menu"
import { ChevronDownIcon } from "lucide-react"
import Link from "next/link"
import { useFrameworkLink, useMenuLink } from "./section-nav"
import { FrameworkCheck, useSection } from "./site-preferences"

const itemClassName =
  "inline-flex items-center rounded-md py-1.5 text-sm text-subtle outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30 data-current:text-foreground"

function HeaderMenu({ urls }: { urls: string[] }) {
  const section = useSection()
  const link = useMenuLink(section)
  const frameworkLink = useFrameworkLink(urls)

  return (
    <NavigationMenu aria-label="Sections">
      <NavigationMenuList className="flex items-center gap-6">
        {menu.map((item) => {
          if (item.href.startsWith("http")) return null
          const { href, current } = link(item.href)
          if (item.href === "/docs/frameworks") {
            return (
              <NavigationMenuItem key={item.href} value="frameworks">
                <NavigationMenuTrigger
                  data-current={current ? "" : undefined}
                  className={cn("group gap-1 cursor-default", itemClassName)}
                >
                  {item.title}
                  <ChevronDownIcon className="size-3.5 text-subtle transition-transform duration-200 group-data-open:rotate-180 motion-reduce:transition-none" />
                </NavigationMenuTrigger>
                <NavigationMenuContent
                  side="bottom"
                  align="start"
                  alignOffset={-12}
                  sideOffset={6}
                  className="min-w-44 rounded-2xl bg-popover p-1 text-sm text-popover-foreground shadow-lg ring-1 ring-foreground/5 outline-none dark:ring-foreground/10"
                >
                  <ul className="flex flex-col">
                    {frameworkIds.map((framework) => (
                      <li key={framework}>
                        <NavigationMenuLink
                          current={section === framework}
                          render={<Link href={frameworkLink(framework)} />}
                          className="relative flex min-h-7 items-center rounded-xl py-1.5 ps-2 pe-8 outline-none hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground"
                        >
                          {frameworks[framework].label}
                          <FrameworkCheck framework={framework} className="absolute end-2" />
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            )
          }
          return (
            <NavigationMenuItem key={item.href}>
              <NavigationMenuLink current={current} render={<Link href={href} />} className={itemClassName}>
                {item.title}
              </NavigationMenuLink>
            </NavigationMenuItem>
          )
        })}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

export { HeaderMenu }
