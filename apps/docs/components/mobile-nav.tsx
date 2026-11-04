"use client"

import { cn } from "cn"
import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from "@ui-sdk/react/popover"
import { menu } from "@/lib/menu"
import type { Section } from "@/lib/sections"
import type * as PageTree from "fumadocs-core/page-tree"
import { ArrowUpRightIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"
import { FrameworkPicker } from "./site-preferences"
import { Logo, VercelLogo } from "./logo"
import { SearchTrigger } from "./search"
import { useActiveTree, useMenuLink } from "./section-nav"

// The header on small screens. The menu fills the screen below it. Pages outside
// the docs, like the homepage, have no section and list only the menu.
function MobileNav({
  section,
  tree,
  componentsTree,
  urls = [],
}: {
  section?: Section
  tree?: PageTree.Root
  componentsTree?: PageTree.Root
  urls?: string[]
}) {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()
  const active = useActiveTree(tree, componentsTree)

  // Search can navigate while the menu is open, so the menu closes on any navigation.
  React.useEffect(() => setOpen(false), [pathname])

  return (
    <header
      data-mobile-header
      className="container sticky top-0 z-10 flex h-14 items-center gap-4 bg-canvas/85 backdrop-blur-md lg:hidden"
    >
      <a
        href="https://vercel.com"
        target="_blank"
        rel="noreferrer"
        aria-label="Vercel"
        className="rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
      >
        <VercelLogo className="h-[18px] w-auto" />
      </a>
      <span aria-hidden className="ms-0.5 text-lg font-light text-foreground/20">
        /
      </span>
      <Link
        href="/"
        aria-label="ui-sdk home"
        className="rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
      >
        <Logo className="h-[18px] w-auto" />
      </Link>
      <span aria-hidden className="ms-0.5 text-lg font-light text-foreground/20">
        /
      </span>
      <FrameworkPicker urls={urls} />
      <div className="ms-auto flex items-center gap-1">
        {/* Phones show the icon alone, so the breadcrumb fits. */}
        <SearchTrigger className="flex size-8 items-center justify-center rounded-2xl bg-foreground/[0.045] text-sm text-subtle outline-none transition-colors hover:bg-foreground/[0.07] hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30 max-sm:[&>span]:sr-only sm:w-auto sm:gap-2 sm:ps-2.5 sm:pe-3" />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            aria-label="Menu"
            className="group -me-3 inline-flex size-10 touch-manipulation items-center justify-center rounded-2xl outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
          >
            <span className="relative size-4">
              <span className="absolute start-0 top-1 h-0.5 w-4 bg-foreground transition-all duration-100 group-aria-expanded:top-[0.4375rem] group-aria-expanded:-rotate-45 motion-reduce:transition-none" />
              <span className="absolute start-0 top-2.5 h-0.5 w-4 bg-foreground transition-all duration-100 group-aria-expanded:top-[0.4375rem] group-aria-expanded:rotate-45 motion-reduce:transition-none" />
            </span>
          </PopoverTrigger>
          <PopoverContent
            anchor="[data-mobile-header]"
            side="bottom"
            align="start"
            sideOffset={0}
            collisionPadding={0}
            className="h-(--available-height) w-(--anchor-width) overflow-y-auto overscroll-contain bg-canvas/90 outline-none backdrop-blur-md [scrollbar-width:none] lg:hidden"
          >
            <PopoverTitle className="sr-only">Menu</PopoverTitle>
            <MobileMenu section={section} tree={active} onNavigate={() => setOpen(false)} />
          </PopoverContent>
        </Popover>
      </div>
    </header>
  )
}

type Group = { label?: string; pages: PageTree.Item[] }

// The page tree as labeled groups, read like the sidebar: a separator or a folder starts one,
// and the pages after it join it.
function groupPages(nodes: PageTree.Node[], label?: string) {
  const groups: Group[] = [{ label, pages: [] }]
  for (const node of nodes) {
    if (node.type === "separator") groups.push({ label: String(node.name), pages: [] })
    else if (node.type === "page") groups[groups.length - 1].pages.push(node)
    else {
      const pages = groupPages(node.children).flatMap((group) => group.pages)
      groups.push({ label: String(node.name), pages: node.index ? [node.index, ...pages] : pages })
    }
  }
  return groups.filter((group) => group.pages.length)
}

function MobileMenu({
  section,
  tree,
  onNavigate,
}: {
  section?: Section
  tree?: PageTree.Root
  onNavigate: () => void
}) {
  const pathname = usePathname()
  const link = useMenuLink(section)
  const groups = tree ? groupPages(tree.children, String(tree.name)) : []

  return (
    // Two landmarks, like the header and sidebar on large screens.
    <div className="flex flex-col gap-12 px-8 pt-6 pb-12">
      <nav aria-label="Sections">
        <MenuGroup label="Menu">
          {menu.map((item) => {
            if (item.href.startsWith("http")) {
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-fit items-center gap-1 rounded-md text-2xl font-medium tracking-tight text-foreground/70 outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30"
                  >
                    {item.title}
                    <ArrowUpRightIcon className="size-5" />
                  </a>
                </li>
              )
            }
            const { href, current } = link(item.href)
            return (
              <MenuLink key={item.href} href={href} current={current} onNavigate={onNavigate}>
                {item.title}
              </MenuLink>
            )
          })}
        </MenuGroup>
      </nav>
      {groups.length > 0 && (
        <nav aria-label="Docs" className="flex flex-col gap-12">
          {groups.map((group, index) => (
            <MenuGroup key={index} label={group.label}>
              {group.pages.map((page) => (
                <MenuLink
                  key={page.url}
                  href={page.url}
                  current={page.url === pathname}
                  onNavigate={onNavigate}
                >
                  {page.name}
                </MenuLink>
              ))}
            </MenuGroup>
          ))}
        </nav>
      )}
    </div>
  )
}

function MenuGroup({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      {label && <div className="text-sm font-medium text-subtle">{label}</div>}
      <ul className="flex flex-col gap-3">{children}</ul>
    </div>
  )
}

function MenuLink({
  href,
  current,
  onNavigate,
  children,
}: {
  href: string
  current: boolean
  onNavigate: () => void
  children: React.ReactNode
}) {
  return (
    <li>
      <Link
        href={href}
        aria-current={current ? "page" : undefined}
        onClick={onNavigate}
        className={cn(
          "block w-fit rounded-md text-2xl font-medium tracking-tight outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/30",
          current ? "text-brand" : "text-foreground/70 hover:text-foreground",
        )}
      >
        {children}
      </Link>
    </li>
  )
}

export { MobileNav }
