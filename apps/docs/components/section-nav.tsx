"use client"

import { type Framework, isFramework } from "@/lib/frameworks"
import { menu } from "@/lib/menu"
import { useSavedFramework } from "@/lib/preferences"
import { frameworkHref, type Section } from "@/lib/sections"
import { flattenTree, type Root } from "fumadocs-core/page-tree"
import { useDocsPathname } from "@/lib/pathname"

function useMenuLink(section?: Section) {
  const saved = useSavedFramework()
  const pathname = useDocsPathname()
  const activeLink = menu.findLast(
    ({ href }) => pathname === href || pathname.startsWith(`${href}/`)
  )
  const current = section && isFramework(section) ? section : undefined
  const framework = current ?? saved
  const onComponents =
    !!current && pathname.startsWith(`/docs/${current}/components`)
  return (href: string) => {
    // Get Started and Core share a sidebar, so Docs covers both.
    if (href === "/docs") {
      return { href, current: pathname === "/docs" || section === "core" }
    }
    if (href === "/docs/frameworks") {
      return {
        href: framework ? `/docs/${framework}` : href,
        current: !!current && !onComponents,
      }
    }
    if (href === "/docs/components") {
      return {
        href: framework ? `/docs/${framework}/components` : href,
        current: onComponents,
      }
    }
    return { href, current: href === activeLink?.href }
  }
}

// Each framework's link from the page being read: the same page in that framework
// on a framework's page, else the framework's introduction.
function useFrameworkLink(urls: string[]) {
  const pathname = useDocsPathname()
  const onFramework = isFramework(pathname.split("/")[2] ?? "")
  return (framework: Framework) =>
    onFramework
      ? frameworkHref(pathname, framework, urls)
      : `/docs/${framework}`
}

// The sidebar link for the page being read. A page the sidebar doesn't list,
// like a changelog post, gets the closest link above it.
function useCurrentUrl(tree?: Root) {
  const pathname = useDocsPathname()
  const urls = tree ? flattenTree(tree.children).map((page) => page.url) : []
  if (urls.includes(pathname)) {
    return pathname
  }
  return urls
    .filter((url) => pathname.startsWith(`${url}/`))
    .sort((a, b) => b.length - a.length)[0]
}

export { useCurrentUrl, useFrameworkLink, useMenuLink }
