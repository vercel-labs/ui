"use client"

import { cn } from "cn"
import { type Framework, isFramework } from "@/lib/frameworks"
import {
  colorScheme,
  framework as frameworkPreference,
  packageManager,
  setFramework,
  useFramework,
} from "@/lib/preferences"
import { isSection, utilitiesFolder } from "@/lib/sections"
import { Preferences } from "@ui-sdk/react/preferences"
import { CheckIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"

const preferences = [colorScheme, frameworkPreference, packageManager]

/** The section of the page being read, from its path. */
function useSection() {
  const segment = usePathname().split("/")[2] ?? ""
  return isSection(segment) ? segment : undefined
}

function SitePreferences({ children }: { children: React.ReactNode }) {
  const section = useSection()

  React.useEffect(() => {
    if (section && isFramework(section)) setFramework(section)
  }, [section])

  return <Preferences preferences={preferences}>{children}</Preferences>
}

// The remembered framework, from the attribute the preference sets before the page
// paints, so the check doesn't move after hydration. React until one is saved.
const savedCheck = {
  react: "[html[data-framework]:not([data-framework='']):not([data-framework=react])_&]:invisible",
  vue: "invisible [html[data-framework=vue]_&]:visible",
  svelte: "invisible [html[data-framework=svelte]_&]:visible",
  "web-components": "invisible [html[data-framework=web-components]_&]:visible",
  solid: "invisible [html[data-framework=solid]_&]:visible",
}

/** A check on the current framework: the page's, else the remembered one, else React. */
function FrameworkCheck({ framework, className }: { framework: Framework; className?: string }) {
  const section = useSection()
  const shown =
    section && isFramework(section) ? (section === framework ? "" : "invisible") : savedCheck[framework]
  return <CheckIcon aria-hidden className={cn("size-4 shrink-0", shown, className)} />
}

function FrameworkLink({ href, ...props }: React.ComponentProps<typeof Link> & { href: string }) {
  const [framework] = useFramework()
  const [resolved, setResolved] = React.useState(href)
  React.useEffect(() => {
    const [, , folder, ...rest] = href.split("/")
    const target = folder === "utilities" ? utilitiesFolder(framework) : folder
    setResolved(["", "docs", framework, target, ...rest].join("/"))
  }, [framework, href])
  return <Link href={resolved} {...props} />
}

function FrameworkContent({ value, children }: { value: Framework; children: React.ReactNode }) {
  const [framework] = useFramework()
  return framework === value ? children : null
}

export { FrameworkCheck, FrameworkContent, FrameworkLink, SitePreferences, useSection }
