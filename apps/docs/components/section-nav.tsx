"use client"

import { type Framework, isFramework } from "@/lib/frameworks"
import { menu } from "@/lib/menu"
import { setFramework, useSavedFramework } from "@/lib/preferences"
import { frameworkHref, sharedSections, type Section } from "@/lib/sections"
import { flattenTree, type Root } from "fumadocs-core/page-tree"
import { useDocsPathname } from "@/lib/pathname"
import { useRouter } from "next/navigation"
import type * as React from "react"

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

// Switching framework keeps the page: a framework's page goes to its copy in the
// other, and Get Started, Core, Agents and Guides stay put, as they're built for
// every framework. Anywhere else goes to the framework's introduction.
function useFrameworkSwitch(urls: string[]) {
  const pathname = useDocsPathname()
  const router = useRouter()
  const section = pathname.split("/")[2] ?? ""
  const shared = pathname === "/docs" || section in sharedSections
  const href = (framework: Framework) =>
    isFramework(section)
      ? frameworkHref(pathname, framework, urls)
      : shared
        ? pathname
        : `/docs/${framework}`
  // A shared page stays put: saving the choice is enough, and `PageFramework`
  // fetches the page built for it.
  const select = (framework: Framework) =>
    shared ? setFramework(framework) : router.push(href(framework))
  // For a link: a press with a modifier key opens a new tab, as links do.
  const onClick =
    (framework: Framework) => (event: React.MouseEvent<HTMLElement>) => {
      if (
        !shared ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return
      }
      event.preventDefault()
      setFramework(framework)
    }
  return { href, select, onClick }
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

export { useCurrentUrl, useFrameworkSwitch, useMenuLink }
