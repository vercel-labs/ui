"use client"

import { cn } from "cn"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { frameworkIds, frameworks, isFramework } from "@/lib/frameworks"
import { frameworkHref, type Section } from "@/lib/sections"
import { usePathname, useRouter } from "next/navigation"
import { setFramework, useSavedFramework } from "./remember-framework"

const items = frameworkIds.map((value) => ({ value, label: frameworks[value].label }))

// Each label shows when <html data-framework> names its framework. Tailwind needs the
// classes written out.
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

function FrameworkPicker({ section, urls }: { section?: Section; urls: string[] }) {
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

export { FrameworkPicker }
