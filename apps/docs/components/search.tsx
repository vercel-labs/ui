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
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { isFramework } from "@/lib/frameworks"
import { useFramework } from "@/lib/preferences"
import type { Section } from "@/lib/sections"
import { createDialogController, DialogShortcut } from "@ui-sdk/react/dialog"
import { useDocsSearch } from "fumadocs-core/search/client"
import { FileTextIcon, HashIcon, SearchIcon, TextIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import * as React from "react"

function Highlighted({ text }: { text: string }) {
  return text.split(/(<mark>.*?<\/mark>|`[^`]+`)/).map((part, index) => {
    if (part.startsWith("<mark>"))
      return (
        <mark key={index} className="bg-transparent font-medium text-foreground">
          {part.slice(6, -7)}
        </mark>
      )
    if (part.startsWith("`"))
      return (
        <code key={index} className="font-mono text-[0.9em]">
          <Highlighted text={part.slice(1, -1)} />
        </code>
      )
    return part
  })
}

const icons = { page: FileTextIcon, heading: HashIcon, text: TextIcon }

const searchDialog = createDialogController()

function SearchTrigger({
  label = "Search",
  shortcut,
  className,
}: {
  label?: string
  shortcut?: boolean
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
      <SearchIcon className="size-4 shrink-0" />
      <span>{label}</span>
      {shortcut && <DialogShortcut className="ms-auto font-sans text-xs tracking-widest text-subtle" />}
    </DialogTrigger>
  )
}

function Search({ section, pages }: { section?: Section; pages: { name: string; url: string }[] }) {
  const [open, setOpen] = React.useState(false)
  const [preferredFramework] = useFramework()
  const router = useRouter()

  const { search, setSearch, query } = useDocsSearch({ type: "fetch", api: "/api/search", delayMs: 100 })
  const framework = section && isFramework(section) ? section : preferredFramework
  const results =
    query.data && query.data !== "empty"
      ? query.data.filter((result) =>
          ["core", "agents", framework].some(
            (shown) =>
              result.url === `/docs/${shown}` ||
              result.url.startsWith(`/docs/${shown}/`) ||
              result.url.startsWith(`/docs/${shown}#`),
          ),
        )
      : []

  return (
    <Dialog
      controller={searchDialog}
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) setSearch("")
      }}
    >
      <DialogContent instant className="max-w-[37rem]">
        <DialogTitle className="sr-only">Search the docs</DialogTitle>
        <Command
          filter={false}
          onQueryChange={setSearch}
          onAction={(value) => {
            const url = results.find((result) => result.id === value)?.url ?? value
            setOpen(false)
            setSearch("")
            router.push(url)
          }}
          className="flex min-h-0 flex-1 flex-col"
        >
          <CommandInput aria-label="Search the docs" placeholder="Search the docs" />
          <CommandEmpty>
            {search && !query.isLoading && query.data === "empty" ? `Nothing found for “${search}”.` : null}
          </CommandEmpty>
          <CommandList aria-busy={query.isLoading || undefined}>
            {search ? (
              results.map((result) => {
                const Icon = icons[result.type]
                return (
                  <CommandItem
                    key={result.id}
                    value={result.id}
                    label={result.content.replace(/<\/?mark>|`/g, "")}
                    className={result.type === "page" ? "" : "ps-8 text-subtle"}
                  >
                    <Icon className="size-3.5 shrink-0 text-subtle" />
                    <span className="line-clamp-1">
                      <Highlighted text={result.content} />
                    </span>
                  </CommandItem>
                )
              })
            ) : (
              <CommandGroup>
                <CommandGroupLabel>Pages</CommandGroupLabel>
                {pages.map((page) => (
                  <CommandItem key={page.url} value={page.url} label={page.name}>
                    <FileTextIcon className="size-3.5 shrink-0 text-subtle" />
                    {page.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}

export { Search, SearchTrigger }
