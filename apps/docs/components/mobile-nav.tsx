"use client"

import { cn } from "cn"
import { bindPersistentLayer } from "@ui-sdk/core"
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/react/popover"
import { frameworkIds, frameworks } from "@/lib/frameworks"
import { menu } from "@/lib/menu"
import type { Section } from "@/lib/sections"
import type * as PageTree from "fumadocs-core/page-tree"
import { ArrowUpRightIcon } from "lucide-react"
import Link from "next/link"
import { useDocsPathname } from "@/lib/pathname"
import * as React from "react"
import { BetaCard } from "./beta-card"
import { HeaderCopyPrompt } from "./copy-prompt"
import { GitHubLink } from "./github-link"
import { FrameworkCheck } from "./site-preferences"
import { Logo, VercelLogo } from "./logo"
import { SearchTrigger, setSearchOpen, useSearchOpen } from "./search"
import { useCurrentUrl, useFrameworkLink, useMenuLink } from "./section-nav"

// The header on small screens. The menu fills the screen below it. Pages outside
// the docs, like the homepage, have no section and list only the menu.
function MobileNav({
  section,
  tree,
  urls = [],
  docs = !!section,
  registry,
}: {
  section?: Section
  tree?: PageTree.Root
  urls?: string[]
  docs?: boolean
  registry?: string
}) {
  const [open, setOpen] = React.useState(false)
  const searching = useSearchOpen()
  const pathname = useDocsPathname()
  const header = React.useRef<HTMLElement>(null)

  // Search can navigate while the menu is open, so the menu closes on any navigation.
  React.useEffect(() => setOpen(false), [pathname])
  React.useEffect(() => {
    if (searching) {
      setOpen(false)
    }
  }, [searching])

  // The modal menu makes the page inert, but the header stays usable above it.
  React.useEffect(
    () =>
      open && header.current ? bindPersistentLayer(header.current) : undefined,
    [open]
  )

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
      if (y < 56 || (!down && anchor - y > 120)) {
        setHidden(false)
      } else if (down && y - anchor > 8) {
        setHidden(true)
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      ref={header}
      data-mobile-header
      data-hidden={hidden && !open && !searching ? "" : undefined}
      data-open={open || searching ? "" : undefined}
      data-docs={docs ? "" : undefined}
      className="group/header container sticky top-0 z-10 flex h-14 items-center gap-3 bg-canvas transition-transform duration-200 data-hidden:-translate-y-[calc(100%+12px)] motion-reduce:transition-none lg:hidden"
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
        <HeaderCopyPrompt
          registry={registry}
          className="me-1.5 h-7 px-2.5 text-[13px]"
        />
        {/* Phones show the icon alone, so the breadcrumb fits. */}
        <SearchTrigger className="hit-area flex size-8 items-center justify-center rounded-2xl text-sm text-foreground outline-none transition-colors hover:bg-foreground/[0.06] focus-visible:ring-3 focus-visible:ring-ring/30 max-sm:[&>span]:sr-only max-sm:[&_svg]:size-5 sm:h-8 sm:w-auto sm:gap-2 sm:ps-2.5 sm:pe-3" />
        <GitHubLink className="text-foreground hover:bg-foreground/[0.06] [&_svg]:size-5" />
        <Popover open={open} onOpenChange={setOpen} modal>
          {searching ? (
            <button
              type="button"
              aria-label="Close search"
              onClick={() => setSearchOpen(false)}
              className={menuButton}
            >
              <MenuIcon open />
            </button>
          ) : (
            <PopoverTrigger aria-label="Menu" className={menuButton}>
              <MenuIcon open={open} />
            </PopoverTrigger>
          )}
          <PopoverContent
            anchor="[data-mobile-header]"
            side="bottom"
            align="start"
            sideOffset={0}
            collisionPadding={0}
            className="h-(--available-height) w-(--anchor-width) overflow-y-auto overscroll-contain bg-canvas outline-none [scrollbar-width:none] lg:hidden"
          >
            <PopoverTitle className="sr-only">Menu</PopoverTitle>
            <MobileMenu
              section={section}
              tree={tree}
              urls={urls}
              onNavigate={() => setOpen(false)}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 -bottom-px h-px sm:inset-x-8"
      >
        <span
          className={cn(
            "absolute inset-x-3.5 top-0 h-px",
            docs ? "bg-foreground/[0.06]" : "bg-foreground"
          )}
        />
        <span className="pointer-events-none absolute size-[11px] text-foreground group-data-docs/header:text-foreground/30 before:absolute before:inset-x-0 before:top-[5px] before:h-px before:bg-current/40 after:absolute after:inset-y-0 after:start-[5px] after:w-px after:bg-current/40 -start-[5px] -top-[5px] group-data-open/header:hidden" />
        <span className="pointer-events-none absolute size-[11px] text-foreground group-data-docs/header:text-foreground/30 before:absolute before:inset-x-0 before:top-[5px] before:h-px before:bg-current/40 after:absolute after:inset-y-0 after:start-[5px] after:w-px after:bg-current/40 -end-[5px] -top-[5px] group-data-open/header:hidden" />
      </div>
    </header>
  )
}

const menuButton =
  "relative -me-1.5 inline-flex size-8 touch-manipulation after:absolute after:-inset-1.5 items-center justify-center rounded-2xl outline-none transition-colors hover:bg-foreground/[0.06] focus-visible:ring-3 focus-visible:ring-ring/30"

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span
      data-open={open ? "" : undefined}
      className="group/icon relative size-5"
    >
      <span className="absolute start-0 top-[0.375rem] h-[1.5px] w-5 bg-foreground transition-transform duration-100 group-data-open/icon:[transform:translateY(0.1875rem)_rotate(-45deg)] motion-reduce:transition-none" />
      <span className="absolute start-0 top-[0.75rem] h-[1.5px] w-5 bg-foreground transition-transform duration-100 group-data-open/icon:[transform:translateY(-0.1875rem)_rotate(45deg)] motion-reduce:transition-none" />
    </span>
  )
}

type Group = { label?: string; pages: PageTree.Item[] }

// The page tree as labeled groups, read like the sidebar: a separator or a folder starts one,
// and the pages after it join it.
function groupPages(nodes: PageTree.Node[], label?: string) {
  const groups: Group[] = [{ label, pages: [] }]
  for (const node of nodes) {
    if (node.type === "separator") {
      groups.push({ label: String(node.name), pages: [] })
    } else if (node.type === "page") {
      groups[groups.length - 1].pages.push(node)
    } else {
      const pages = groupPages(node.children).flatMap((group) => group.pages)
      groups.push({
        label: String(node.name),
        pages: node.index ? [node.index, ...pages] : pages,
      })
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
            if (item.href === "/docs/frameworks") {
              return null
            }
            if (item.href.startsWith("http")) {
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-fit items-center gap-1 rounded-md text-2xl font-medium tracking-tight text-foreground outline-none hover:underline hover:decoration-1 hover:underline-offset-[0.2em] focus-visible:ring-3 focus-visible:ring-ring/30"
                  >
                    {item.title}
                    <ArrowUpRightIcon className="size-5" />
                  </a>
                </li>
              )
            }
            const { href, current } = link(item.href)
            return (
              <MenuLink
                key={item.href}
                href={href}
                current={current}
                onNavigate={onNavigate}
              >
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

function MenuGroup({
  label,
  children,
}: {
  label?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-4">
      {label && (
        <div className="font-mono text-[11px] tracking-[0.06em] text-muted-foreground uppercase">
          {label}
        </div>
      )}
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
          "text-foreground decoration-1 underline-offset-[0.2em] hover:underline",
          current && "underline"
        )}
      >
        {children}
      </Link>
    </li>
  )
}

export { MobileNav }
