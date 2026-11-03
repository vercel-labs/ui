"use client"

import { cn } from "cn"
import type * as PageTree from "fumadocs-core/page-tree"
import { AnchorProvider, useActiveAnchor, type TableOfContents } from "fumadocs-core/toc"
import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"
import { useActiveTree } from "./section-nav"

function Sidebar({
  tree,
  componentsTree,
  tocs,
}: {
  tree: PageTree.Root
  componentsTree?: PageTree.Root
  tocs: Record<string, TableOfContents>
}) {
  const active = useActiveTree(tree, componentsTree) ?? tree
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pt-6 pe-4 pb-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <nav aria-label="Docs">
          <Nodes nodes={active.children} tocs={tocs} />
        </nav>
      </div>
    </div>
  )
}

const groupLabel = "mb-2 text-xs font-medium text-foreground"

function Nodes({ nodes, tocs }: { nodes: PageTree.Node[]; tocs: Record<string, TableOfContents> }) {
  return (
    <ul className="flex flex-col">
      {nodes.map((node, index) => {
        if (node.type === "separator")
          return (
            <li key={index} className={cn(groupLabel, "mt-8 first:mt-0")}>
              {node.name}
            </li>
          )
        if (node.type === "folder")
          return (
            <li key={index}>
              <Folder folder={node} tocs={tocs} />
            </li>
          )
        return (
          <li key={node.url}>
            <PageLink page={node} toc={tocs[node.url]} />
          </li>
        )
      })}
    </ul>
  )
}

function Folder({ folder, tocs }: { folder: PageTree.Folder; tocs: Record<string, TableOfContents> }) {
  const pathname = usePathname()
  return (
    <div className="mt-8">
      {folder.index ? (
        <Link
          href={folder.index.url}
          aria-current={folder.index.url === pathname ? "page" : undefined}
          className={cn(
            groupLabel,
            "block w-fit rounded-md underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/30",
          )}
        >
          {folder.name}
        </Link>
      ) : (
        <div className={groupLabel}>{folder.name}</div>
      )}
      <Nodes nodes={folder.children} tocs={tocs} />
    </div>
  )
}

function PageLink({ page, toc }: { page: PageTree.Item; toc?: TableOfContents }) {
  const pathname = usePathname()
  const active = page.url === pathname
  const items = toc?.filter((item) => item.depth <= 2) ?? []

  return (
    <>
      <Link
        href={page.url}
        aria-current={active ? "page" : undefined}
        className={cn(
          "block rounded-md py-1 text-sm outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/30",
          active ? "text-brand" : "text-subtle hover:text-foreground",
        )}
      >
        {page.name}
      </Link>
      {active && items.length > 1 && (
        <div className="xl:hidden">
          <AnchorProvider toc={items} single>
            <Toc items={items} />
          </AnchorProvider>
        </div>
      )}
    </>
  )
}

function Toc({ items }: { items: TableOfContents }) {
  const active = useActiveAnchor()
  if (items.length < 2) return null

  return (
    <ul className="mt-0.5 mb-2 ms-1 flex flex-col border-s border-foreground/10">
      {items.map((item) => {
        const current = active === item.url.slice(1)
        return (
          <li key={item.url}>
            <a
              href={item.url}
              aria-current={current ? "location" : undefined}
              className={cn(
                "relative -ms-px block border-s py-[3px] ps-3 text-[13px] leading-5 outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/30",
                current
                  ? "border-brand text-brand"
                  : "border-transparent text-subtle hover:text-foreground",
              )}
            >
              {item.title}
            </a>
          </li>
        )
      })}
    </ul>
  )
}

export { Sidebar }
