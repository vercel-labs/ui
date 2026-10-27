"use client"

import { isFramework } from "@/lib/frameworks"
import { menu } from "@/lib/menu"
import type { Section } from "@/lib/sections"
import type { Root } from "fumadocs-core/page-tree"
import { usePathname } from "next/navigation"
import { useSavedFramework } from "./remember-framework"

// Where a menu link goes and whether it's the current section. Before hydration
// and without JavaScript there's no saved framework to read, so the Guides and
// Components links keep their framework-less hrefs, which redirects resolve
// from the cookie.
function useMenuLink(section?: Section) {
  const saved = useSavedFramework()
  const pathname = usePathname()
  const activeLink = menu.findLast(({ href }) => pathname === href || pathname.startsWith(`${href}/`))
  const current = section && isFramework(section) ? section : undefined
  const framework = current ?? saved
  const onComponents = !!current && pathname.startsWith(`/docs/${current}/components`)
  return (href: string) => {
    if (href === "/docs/frameworks") {
      return { href: framework ? `/docs/${framework}` : href, current: !!current && !onComponents }
    }
    if (href === "/docs/components") {
      return { href: framework ? `/docs/${framework}/components` : href, current: onComponents }
    }
    return { href, current: href === activeLink?.href }
  }
}

function useActiveTree(tree?: Root, componentsTree?: Root) {
  const pathname = usePathname()
  if (!componentsTree) return tree
  const home = componentsTree.children.find((node) => node.type === "page")?.url
  if (!home) return tree
  return pathname === home || pathname.startsWith(`${home}/`) ? componentsTree : tree
}

export { useActiveTree, useMenuLink }
