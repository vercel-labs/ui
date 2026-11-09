"use client"

import { cn } from "cn"
import { bindPersistentLayer } from "@ui-sdk/core"
import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from "@ui-sdk/react/popover"
import { frameworkIds, frameworks } from "@/lib/frameworks"
import { menu } from "@/lib/menu"
import type { Section } from "@/lib/sections"
import type * as PageTree from "fumadocs-core/page-tree"
import { ArrowUpRightIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"
import { BetaCard } from "./beta-card"
import { GitHubLink } from "./github-link"
import { FrameworkCheck } from "./site-preferences"
import { Logo, VercelLogo } from "./logo"
import { SearchTrigger } from "./search"
import { useCurrentUrl, useFrameworkLink, useMenuLink } from "./section-nav"

// The header on small screens. The menu fills the screen below it. Pages outside
// the docs, like the homepage, have no section and list only the menu.
function MobileNav({
  section,
  tree,
  urls = [],
}: {
  section?: Section
  tree?: PageTree.Root
  urls?: string[]
}) {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()
  const header = React.useRef<HTMLElement>(null)

  // Search can navigate while the menu is open, so the menu closes on any navigation.
  React.useEffect(() => setOpen(false), [pathname])

  // The modal menu makes the page inert, but the header stays usable above it.
  React.useEffect(() => (open && header.current ? bindPersistentLayer(header.current) : undefined), [open])

  const [hidden, setHidden] = React.useState(false)
  React.useEffect(() => {
    let last = window.scrollY
    let anchor = last
    let down = true
    const onScroll = () => {
      const y = window.scrollY
      if (y > last !== down && y !== last) {
        down = y > last
        anchor = last
      }
      last = y
      if (y < 56 || (!down && anchor - y > 120)) setHidden(false)
      else if (down && y - anchor > 8) setHidden(true)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      ref={header}
      data-mobile-header
      data-hidden={hidden && !open ? "" : undefined}
      className="container sticky top-0 z-10 flex h-14 items-center gap-3 bg-canvas transition-transform duration-200 data-hidden:-translate-y-[calc(100%+12px)] motion-reduce:transition-none lg:hidden"
    >
      <a
        href="https://vercel.com"
        target="_blank"
        rel="noreferrer"
        aria-label="Vercel"
        className="hit-area rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
      >
        <VercelLogo className="h-[18px] w-auto" />
      </a>
      <span aria-hidden className="text-lg font-light text-foreground/20">
        /
      </span>
      <Link
        href="/"
        aria-label="ui-sdk home"
        className="hit-area rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
      >
        <Logo className="h-[18px] w-auto" />
      </Link>
      <div className="ms-auto flex items-center gap-1">
        {/* Phones show the icon alone, so the breadcrumb fits. */}
        <SearchTrigger className="flex size-8 items-center justify-center rounded-2xl border border-foreground text-sm text-foreground outline-none transition-colors hover:bg-foreground/[0.06] focus-visible:ring-3 focus-visible:ring-ring/30 max-sm:[&>span]:sr-only sm:w-auto sm:gap-2 sm:ps-2.5 sm:pe-3" />
        <GitHubLink className="border border-foreground text-foreground hover:bg-foreground/[0.06]" />
        <Popover open={open} onOpenChange={setOpen} modal>
          <PopoverTrigger
            aria-label="Menu"
            className="group relative inline-flex size-8 touch-manipulation items-center justify-center rounded-2xl border border-foreground outline-none transition-colors after:absolute after:-inset-1.5 hover:bg-foreground/[0.06] focus-visible:ring-3 focus-visible:ring-ring/30"
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
            className="h-(--available-height) w-(--anchor-width) overflow-y-auto overscroll-contain bg-canvas outline-none [scrollbar-width:none] lg:hidden"
          >
            <PopoverTitle className="sr-only">Menu</PopoverTitle>
            <MobileMenu section={section} tree={tree} urls={urls} onNavigate={() => setOpen(false)} />
          </PopoverContent>
        </Popover>
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-6 -bottom-px h-px sm:inset-x-8">
        <span className="absolute inset-x-3.5 top-0 h-px bg-foreground" />
        <span className="pointer-events-none absolute size-[11px] text-foreground before:absolute before:inset-x-0 before:top-[5px] before:h-px before:bg-current/40 after:absolute after:inset-y-0 after:start-[5px] after:w-px after:bg-current/40 -start-[5px] -top-[5px]" />
        <span className="pointer-events-none absolute size-[11px] text-foreground before:absolute before:inset-x-0 before:top-[5px] before:h-px before:bg-current/40 after:absolute after:inset-y-0 after:start-[5px] after:w-px after:bg-current/40 -end-[5px] -top-[5px]" />
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
  urls,
  onNavigate,
}: {
  section?: Section
  tree?: PageTree.Root
  urls: string[]
  onNavigate: () => void
}) {
  const currentUrl = useCurrentUrl(tree)
  const link = useMenuLink(section)
  const frameworkLink = useFrameworkLink(urls)
  const groups = tree ? groupPages(tree.children, String(tree.name)) : []

  return (
    // Two landmarks, like the header and sidebar on large screens.
    <div className="flex flex-col gap-12 px-6 pt-6 pb-12 sm:px-8">
      <nav aria-label="Sections" className="flex flex-col gap-12">
        <MenuGroup label="Menu">
          {menu.map((item) => {
            if (item.href === "/docs/frameworks") return null
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
        <MenuGroup label="Frameworks">
          {frameworkIds.map((framework) => (
            <MenuLink
              key={framework}
              href={frameworkLink(framework)}
              current={section === framework}
              onNavigate={onNavigate}
            >
              <span className="flex items-center gap-3">
                {frameworks[framework].label}
                <FrameworkCheck framework={framework} className="size-6" />
              </span>
            </MenuLink>
          ))}
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
                  current={page.url === currentUrl}
                  onNavigate={onNavigate}
                >
                  {page.name}
                </MenuLink>
              ))}
            </MenuGroup>
          ))}
        </nav>
      )}
      {section && <BetaCard />}
    </div>
  )
}

function MenuGroup({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      {label && <div className="font-mono text-[11px] tracking-[0.06em] text-muted-foreground uppercase">{label}</div>}
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
          current ? "text-foreground underline decoration-1 underline-offset-[0.2em]" : "text-foreground/60 hover:text-foreground",
        )}
      >
        {children}
      </Link>
    </li>
  )
}

export { MobileNav }
