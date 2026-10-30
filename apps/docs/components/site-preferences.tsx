"use client"

import { cn } from "cn"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type Framework, frameworkIds, frameworks, isFramework } from "@/lib/frameworks"
import {
  colorScheme,
  framework as frameworkPreference,
  packageManager,
  setFramework,
  useFramework,
  useSavedFramework,
} from "@/lib/preferences"
import { frameworkHref, isSection, utilitiesFolder } from "@/lib/sections"
import { Preferences } from "@ui-sdk/react/preferences"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
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

const items = frameworkIds.map((value) => ({ value, label: frameworks[value].label }))

const shownFor = {
  react: "[html[data-framework=react]_&]:inline",
  vue: "[html[data-framework=vue]_&]:inline",
  svelte: "[html[data-framework=svelte]_&]:inline",
  "web-components": "[html[data-framework=web-components]_&]:inline",
  solid: "[html[data-framework=solid]_&]:inline",
}

function SavedLabel() {
  return (
    <>
      <span className="text-muted-foreground [html[data-framework]:not([data-framework=''])_&]:hidden">
        Framework
      </span>
      {items.map(({ value, label }) => (
        <span key={value} className={cn("hidden", shownFor[value])}>
          {label}
        </span>
      ))}
    </>
  )
}

function FrameworkPicker({ urls }: { urls: string[] }) {
  const section = useSection()
  const pathname = usePathname()
  const router = useRouter()
  const saved = useSavedFramework()
  const inFramework = section !== undefined && isFramework(section)
  const framework = inFramework ? section : (saved ?? null)

  return (
    <Select
      items={items}
      value={framework}
      onValueChange={(next) => {
        if (!next || !isFramework(next) || next === framework) return
        if (!inFramework) return setFramework(next)
        router.push(frameworkHref(pathname + location.search + location.hash, next, urls))
      }}
    >
      <SelectTrigger
        variant="ghost"
        aria-label="Framework"
        className="h-8 min-w-0 rounded-2xl px-2.5 data-placeholder:text-foreground bg-foreground/5 hover:bg-foreground/10"
      >
        <SelectValue className="truncate">{inFramework ? undefined : <SavedLabel />}</SelectValue>
      </SelectTrigger>
      <SelectContent align="start" sideOffset={6} className="min-w-44 transition-none">
        {items.map(({ value, label }) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
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

export { FrameworkContent, FrameworkLink, FrameworkPicker, SitePreferences, useSection }
