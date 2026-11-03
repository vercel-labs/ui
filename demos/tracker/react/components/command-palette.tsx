"use client"

import { cn } from "cn"
import { CircleDot, Columns3, List, Plus, Search, Settings } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { href, parseQuery } from "tracker-data"
import { newIssue } from "@/components/new-issue-dialog"
import { buttonVariants } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandItemIcon,
  CommandList,
} from "@/components/ui/command"
import {
  Dialog,
  DialogBackdrop,
  DialogContent,
  DialogShortcut,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

function CommandPalette({ issues }: { issues: { id: string; title: string }[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  function run(value: string) {
    const query = parseQuery(Object.fromEntries(new URLSearchParams(location.search)))
    setOpen(false)
    if (value === "new-issue") newIssue.open()
    else if (value === "settings") router.push("/settings")
    else if (value === "list" || value === "board") router.push(href(query, { view: value, page: 1 }))
    else router.push(href(query, { issue: value }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        shortcut="mod+k"
        className={cn(
          buttonVariants({ variant: "outline" }),
          "w-48 justify-between font-normal text-muted-foreground max-sm:w-8 max-sm:px-0",
        )}
      >
        <Search aria-hidden="true" className="sm:hidden" />
        <span className="max-sm:sr-only">Search…</span>
        <DialogShortcut className="inline-flex h-5 items-center rounded-lg bg-muted px-1 text-xs font-medium max-sm:hidden" />
      </DialogTrigger>
      <DialogBackdrop />
      <DialogContent className="top-[min(6rem,10dvh)] translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogTitle className="sr-only">Search</DialogTitle>
        <Command onAction={run}>
          <CommandInput
            aria-label="Search issues and commands"
            placeholder="Search issues or type a command…"
          />
          <CommandEmpty>No results.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              <CommandGroupLabel>Commands</CommandGroupLabel>
              <CommandItem value="new-issue">
                <CommandItemIcon>
                  <Plus />
                </CommandItemIcon>
                New issue
              </CommandItem>
              <CommandItem value="list">
                <CommandItemIcon>
                  <List />
                </CommandItemIcon>
                Show as list
              </CommandItem>
              <CommandItem value="board">
                <CommandItemIcon>
                  <Columns3 />
                </CommandItemIcon>
                Show as board
              </CommandItem>
              <CommandItem value="settings">
                <CommandItemIcon>
                  <Settings />
                </CommandItemIcon>
                Settings
              </CommandItem>
            </CommandGroup>
            <CommandGroup>
              <CommandGroupLabel>Issues</CommandGroupLabel>
              {issues.map((issue) => (
                <CommandItem key={issue.id} value={issue.id} label={issue.title} keywords={[issue.id]}>
                  <CommandItemIcon>
                    <CircleDot />
                  </CommandItemIcon>
                  <span className="truncate">{issue.title}</span>
                  <span className="ms-auto text-xs text-muted-foreground">{issue.id}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}

export { CommandPalette }
