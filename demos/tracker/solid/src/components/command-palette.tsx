import { useNavigate, useSearchParams } from "@solidjs/router"
import { cn } from "cn"
import { createMemo, createSignal, For } from "solid-js"
import { href, parseQuery } from "tracker-data"
import { CircleDot, Columns3, List, Plus, Search, Settings } from "@/components/icons"
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
import { db } from "@/lib/tracker"

function CommandPalette() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const query = createMemo(() => parseQuery(params))
  const [open, setOpen] = createSignal(false)

  function run(value: string) {
    setOpen(false)
    if (value === "new-issue") newIssue.open()
    else if (value === "settings") navigate("/settings")
    else if (value === "list" || value === "board") navigate(href(query(), { view: value, page: 1 }))
    else navigate(href(query(), { issue: value }))
  }

  return (
    <Dialog open={open()} onOpenChange={setOpen}>
      <DialogTrigger
        shortcut="mod+k"
        class={cn(
          buttonVariants({ variant: "outline" }),
          "w-48 justify-between font-normal text-muted-foreground max-sm:w-8 max-sm:px-0",
        )}
      >
        <Search aria-hidden="true" class="sm:hidden" />
        <span class="max-sm:sr-only">Search…</span>
        <DialogShortcut class="inline-flex h-5 items-center rounded-lg bg-muted px-1 text-xs font-medium max-sm:hidden" />
      </DialogTrigger>
      <DialogBackdrop />
      <DialogContent class="top-[min(6rem,10dvh)] translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogTitle class="sr-only">Search</DialogTitle>
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
              <For each={db.issues}>
                {(issue) => (
                  <CommandItem value={issue.id} label={issue.title} keywords={[issue.id]}>
                    <CommandItemIcon>
                      <CircleDot />
                    </CommandItemIcon>
                    <span class="truncate">{issue.title}</span>
                    <span class="ms-auto text-xs text-muted-foreground">{issue.id}</span>
                  </CommandItem>
                )}
              </For>
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}

export { CommandPalette }
