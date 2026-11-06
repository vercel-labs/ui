"use client"

import { isFramework } from "@/lib/frameworks"
import { menu } from "@/lib/menu"
import { useSavedFramework } from "@/lib/preferences"
import type { Section } from "@/lib/sections"
import { flattenTree, type Root } from "fumadocs-core/page-tree"
import { usePathname } from "next/navigation"

function useMenuLink(section?: Section) {
  const saved = useSavedFramework()
  const pathname = usePathname()
  const activeLink = menu.findLast(({ href }) => pathname === href || pathname.startsWith(`${href}/`))
  const current = section && isFramework(section) ? section : undefined
  const framework = current ?? saved
  return (href: string) => {
    if (href === "/docs/frameworks") {
      return { href: framework ? `/docs/${framework}` : href, current: !!current }
    }
    return { href, current: href === activeLink?.href }
  }
}

// The sidebar link for the page being read. A page the sidebar doesn't list,
// like a changelog post, gets the closest link above it.
function useCurrentUrl(tree?: Root) {
  const pathname = usePathname()
  const urls = tree ? flattenTree(tree.children).map((page) => page.url) : []
  if (urls.includes(pathname)) return pathname
  return urls.filter((url) => pathname.startsWith(`${url}/`)).sort((a, b) => b.length - a.length)[0]
}

export { useCurrentUrl, useMenuLink }
