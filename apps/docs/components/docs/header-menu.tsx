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
import type { Section } from "@/lib/sections"
import { ArrowUpRightIcon, ChevronDownIcon } from "lucide-react"
import Link from "next/link"
import { useMenuLink } from "./section-nav"

const itemClassName =
  "inline-flex items-center rounded-md py-1.5 text-sm text-subtle outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30 data-active:text-foreground"

function HeaderMenu({ section }: { section?: Section }) {
  const link = useMenuLink(section)

  return (
    <NavigationMenu aria-label="Sections">
      <NavigationMenuList className="flex items-center gap-6">
        {menu.map((item) => {
          if (item.href.startsWith("http")) {
            return (
              <NavigationMenuItem key={item.href}>
                <NavigationMenuLink
                  render={<a href={item.href} target="_blank" rel="noreferrer" />}
                  className={cn("gap-1", itemClassName)}
                >
                  {item.title}
                  <ArrowUpRightIcon className="size-3.5" />
                </NavigationMenuLink>
              </NavigationMenuItem>
            )
          }
          const { href, current } = link(item.href)
          if (item.href === "/docs/frameworks") {
            return (
              <NavigationMenuItem key={item.href} value="frameworks">
                <NavigationMenuTrigger
                  data-active={current ? "" : undefined}
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
                  className="min-w-44 rounded-3xl bg-popover p-1 text-sm text-popover-foreground shadow-lg ring-1 ring-foreground/5 outline-none dark:ring-foreground/10"
                >
                  <ul className="flex flex-col">
                    {frameworkIds.map((framework) => (
                      <li key={framework}>
                        <NavigationMenuLink
                          active={section === framework && current}
                          render={<Link href={`/docs/${framework}`} />}
                          className="flex items-center rounded-full px-3 py-2 outline-none hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground data-active:font-medium"
                        >
                          {frameworks[framework].label}
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
              <NavigationMenuLink active={current} render={<Link href={href} />} className={itemClassName}>
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
