"use client"

import { isFramework } from "@/lib/frameworks"
import { menu } from "@/lib/menu"
import { useSavedFramework } from "@/lib/preferences"
import type { Section } from "@/lib/sections"
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

export { useMenuLink }
