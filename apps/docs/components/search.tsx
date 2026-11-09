"use client"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { type Framework, isFramework } from "@/lib/frameworks"
import { useFramework } from "@/lib/preferences"
import { createSearchIndex, type SearchPage, searchIndex } from "@/lib/search"
import type { Section } from "@/lib/sections"
import { createDialogController, DialogShortcut } from "@ui-sdk/react/dialog"
import { SearchIcon } from "lucide-react"
import { bindPersistentLayer } from "@ui-sdk/core"
import { useRouter } from "next/navigation"
import * as React from "react"

function Highlighted({ text }: { text: string }) {
  return text.split(/(<mark>.*?<\/mark>|`[^`]+`)/).map((part, index) => {
    if (part.startsWith("<mark>")) {
      return (
        <mark
          key={index}
          className="bg-transparent font-medium text-foreground"
        >
          {part.slice(6, -7)}
        </mark>
      )
    }
    if (part.startsWith("`")) {
      return (
        <code key={index} className="font-mono text-[0.9em]">
          <Highlighted text={part.slice(1, -1)} />
        </code>
      )
    }
    return part
  })
}

const searchDialog = createDialogController()

// The phone header reads this to show its close button and stay usable over the search.
let searchOpen = false
const searchListeners = new Set<() => void>()

function setSearchOpen(next: boolean) {
  if (next === searchOpen) {
    return
  }
  searchOpen = next
  searchListeners.forEach((listener) => listener())
}

function subscribeSearch(listener: () => void) {
  searchListeners.add(listener)
  return () => searchListeners.delete(listener)
}

function useSearchOpen() {
  return React.useSyncExternalStore(
    subscribeSearch,
    () => searchOpen,
    () => false
  )
}

const indexes = new Map<
  Framework,
  Promise<ReturnType<typeof createSearchIndex>>
>()

function loadIndex(framework: Framework) {
  let index = indexes.get(framework)
  if (!index) {
    index = fetch(`/api/search/${framework}`).then(async (response) => {
      if (!response.ok) {
        throw new Error(`Search index responded ${response.status}`)
      }
      return createSearchIndex((await response.json()) as SearchPage[])
    })
    index.catch(() => indexes.delete(framework))
    indexes.set(framework, index)
  }
  return index
}

function useSearchIndex(framework: Framework, enabled: boolean) {
  const [loaded, setLoaded] = React.useState<{
    framework: Framework
    index?: Awaited<ReturnType<typeof loadIndex>>
    error?: unknown
  }>()
  React.useEffect(() => {
    if (!enabled) {
      return
    }
    let current = true
    loadIndex(framework).then(
      (index) => current && setLoaded({ framework, index }),
      (error: unknown) => current && setLoaded({ framework, error })
    )
    return () => {
      current = false
    }
  }, [framework, enabled])
  return loaded?.framework === framework ? loaded : undefined
}

function SearchTrigger({
  label = "Search",
  shortcut,
  icon = true,
  className,
}: {
  label?: string
  shortcut?: boolean
  icon?: boolean
  className?: string
}) {
  return (
    <DialogTrigger
      controller={searchDialog}
      shortcut={shortcut ? "mod+k" : undefined}
      className={
        className ??
        "flex h-8 w-full items-center gap-2 rounded-2xl px-3 text-sm text-subtle outline-none transition-colors hover:bg-foreground/5 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30"
      }
    >
      {icon && <SearchIcon className="size-4 shrink-0" />}
      <span>{label}</span>
    </DialogTrigger>
  )
}

function Search({
  section,
  pages,
}: {
  section?: Section
  pages: { name: string; url: string }[]
}) {
  const open = useSearchOpen()
  const [preferredFramework] = useFramework()
  const router = useRouter()

  const [search, setSearch] = React.useState("")
  React.useEffect(() => {
    if (!open) {
      setSearch("")
    }
  }, [open])

  React.useEffect(() => {
    const header = document.querySelector<HTMLElement>("[data-mobile-header]")
    return open && header?.checkVisibility()
      ? bindPersistentLayer(header)
      : undefined
  }, [open])

  const framework =
    section && isFramework(section) ? section : preferredFramework
  const loaded = useSearchIndex(framework, open)
  const searching = search !== "" && !loaded
  const results = React.useMemo(
    () => (loaded?.index ? searchIndex(loaded.index, search) : []),
    [loaded, search]
  )

  // The dialog opens into this wrapper. Added beside the page instead, it took
  // the page's place as last child, which restyled the whole page.
  return (
    <div className="contents">
      <Dialog
        controller={searchDialog}
        open={open}
        onOpenChange={setSearchOpen}
      >
        {/* No backdrop. Phones get a full panel under the header, like the menu. */}
        <DialogContent
          instant
          initialFocus="input"
          backdropClassName="hidden"
          className="max-w-[37rem] max-lg:top-14 max-lg:bottom-0 max-lg:left-0 max-lg:max-h-none max-lg:w-full max-lg:max-w-none max-lg:translate-x-0 max-lg:bg-canvas max-lg:text-lg max-lg:shadow-none max-lg:ring-0"
        >
          <DialogTitle className="sr-only">Search the docs</DialogTitle>
          <Command
            filter={false}
            onQueryChange={setSearch}
            onAction={(value) => {
              const url =
                results.find((result) => result.id === value)?.url ?? value
              setSearchOpen(false)
              router.push(url)
            }}
            className="flex min-h-0 flex-1 flex-col max-lg:px-3"
          >
            <CommandInput
              aria-label="Search the docs"
              placeholder="Search the docs"
              className="max-lg:text-xl!"
            />
            <CommandEmpty>
              {searching
                ? "Searching…"
                : loaded?.error
                  ? "Search isn’t available right now."
                  : search && `Nothing found for “${search}”.`}
            </CommandEmpty>
            <CommandList aria-busy={searching || undefined}>
              {search ? (
                results.map((result) => (
                  <CommandItem
                    key={result.id}
                    value={result.id}
                    label={result.content.replace(/<\/?mark>|`/g, "")}
                    className={result.type === "page" ? "" : "ps-6 text-subtle"}
                  >
                    <span className="line-clamp-1">
                      <Highlighted text={result.content} />
                    </span>
                  </CommandItem>
                ))
              ) : (
                <CommandGroup>
                  <CommandGroupLabel>Pages</CommandGroupLabel>
                  {pages.map((page) => (
                    <CommandItem
                      key={page.url}
                      value={page.url}
                      label={page.name}
                    >
                      {page.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export { Search, SearchTrigger, setSearchOpen, useSearchOpen }
