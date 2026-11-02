"use client"

import { Ellipsis, Inbox, Trash2, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useRef, useState, useTransition } from "react"
import {
  formatDate,
  href,
  priorities,
  statuses,
  statusOf,
  type Issue,
  type IssuePatch,
  type Priority,
  type Query,
  type Status,
} from "tracker-data"
import { deleteIssues, updateIssues } from "@/app/actions"
import { Assignee } from "@/components/assignee"
import { PriorityIcon, StatusIcon } from "@/components/issue-icons"
import { IssueLabels } from "@/components/issue-labels"
import { confirm } from "@/components/ui/alert-dialog"
import { buttonVariants } from "@/components/ui/button"
import { Checkbox, CheckboxGroup } from "@/components/ui/checkbox"
import {
  createMenuController,
  Menu,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuItemIcon,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
} from "@/components/ui/menu"
import { Pagination } from "@/components/ui/pagination"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/components/ui/toast"
import { Toolbar, ToolbarButton, ToolbarSeparator } from "@/components/ui/toolbar"

function plural(count: number) {
  return count === 1 ? "1 issue" : `${count} issues`
}

function IssueList({ issues, query, pageSize }: { issues: Issue[]; query: Query; pageSize: number }) {
  const router = useRouter()
  const [selected, setSelected] = useState<string[]>([])
  const [menu] = useState(() => createMenuController<Issue>())
  const [pending, startTransition] = useTransition()
  const all = useRef<HTMLButtonElement>(null)
  const pageCount = Math.max(1, Math.ceil(issues.length / pageSize))
  const page = Math.min(query.page, pageCount)
  const rows = issues.slice((page - 1) * pageSize, page * pageSize)
  const latest = (payload: Issue) => issues.find((issue) => issue.id === payload.id) ?? payload
  const checked = selected.filter((id) => rows.some((issue) => issue.id === id))

  function update(ids: string[], patch: IssuePatch, message?: string) {
    startTransition(async () => {
      try {
        await updateIssues(ids, patch)
        if (message) toast(message)
      } catch {
        toast.error("Couldn't update the issues. Try again.")
      }
    })
  }

  function setStatus(ids: string[], status: Status) {
    update(
      ids,
      { status },
      `${ids.length === 1 ? ids[0] : plural(ids.length)} moved to ${statusOf(status).label}`,
    )
  }

  function setPriority(ids: string[], priority: Priority) {
    update(ids, { priority })
  }

  async function remove(ids: string[]) {
    const yes = await confirm({
      title: `Delete ${ids.length === 1 ? ids[0] : plural(ids.length)}?`,
      description: "Deleted issues and their comments can't be brought back.",
      confirmLabel: "Delete",
    })
    if (!yes) return
    startTransition(async () => {
      try {
        await deleteIssues(ids)
      } catch {
        toast.error("Couldn't delete the issues. Try again.")
        return
      }
      startTransition(() => {
        setSelected([])
        if (query.issue && ids.includes(query.issue))
          router.push(href(query, { issue: null }), { scroll: false })
      })
      all.current?.focus()
      toast.success(`${plural(ids.length)} deleted`)
    })
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <CheckboxGroup
        aria-label="Issues"
        value={checked}
        onValueChange={setSelected}
        allValues={rows.map((issue) => issue.id)}
        aria-busy={pending || undefined}
        className="flex min-h-0 flex-1 flex-col"
      >
        <div className="flex h-11 shrink-0 items-center gap-3 border-b border-border ps-4 pe-2">
          <Checkbox
            ref={all}
            parent
            aria-label="Select all issues on this page"
            disabled={rows.length === 0}
          />
          {checked.length > 0 ? (
            <Toolbar aria-label="Selected issues" className="flex-1 gap-1">
              <span className="me-2 text-sm font-medium">{checked.length} selected</span>
              <Menu onAction={(status) => setStatus(checked, status as Status)}>
                <ToolbarButton
                  render={<MenuTrigger />}
                  className={buttonVariants({ size: "sm", variant: "ghost" })}
                >
                  Set status
                </ToolbarButton>
                <MenuContent align="start">
                  {statuses.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      <MenuItemIcon>
                        <StatusIcon status={status.value} />
                      </MenuItemIcon>
                      {status.label}
                    </MenuItem>
                  ))}
                </MenuContent>
              </Menu>
              <ToolbarButton
                onClick={() => remove(checked)}
                className={buttonVariants({ size: "sm", variant: "ghost" })}
              >
                <Trash2 aria-hidden="true" />
                Delete
              </ToolbarButton>
              <ToolbarSeparator />
              <ToolbarButton
                onClick={() => setSelected([])}
                aria-label="Clear selection"
                className={buttonVariants({ size: "icon-sm", variant: "ghost" })}
              >
                <X aria-hidden="true" />
              </ToolbarButton>
            </Toolbar>
          ) : (
            <span className="text-sm text-muted-foreground">{plural(issues.length)}</span>
          )}
        </div>
        <ScrollArea label="Issue list" className="flex-1">
          {rows.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-24 text-muted-foreground">
              <Inbox aria-hidden="true" className="size-6" />
              No issues match these filters.
            </div>
          ) : (
            <ul className="@container">
              {rows.map((issue) => (
                <li
                  key={issue.id}
                  data-current={issue.id === query.issue || undefined}
                  className="flex h-11 items-center gap-3 border-b border-border ps-4 pe-2 transition-colors hover:bg-muted/50 has-data-checked:bg-muted/70 data-current:bg-muted"
                >
                  <Checkbox value={issue.id} aria-label={`Select ${issue.id}`} />
                  <PriorityIcon priority={issue.priority} label />
                  <span className="hidden w-12 shrink-0 text-xs text-muted-foreground tabular-nums @md:block">
                    {issue.id}
                  </span>
                  <StatusIcon status={issue.status} label />
                  <Link
                    href={href(query, { issue: issue.id })}
                    scroll={false}
                    aria-current={issue.id === query.issue || undefined}
                    className="min-w-0 flex-1 truncate rounded-md font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
                  >
                    {issue.title}
                  </Link>
                  <IssueLabels labels={issue.labels} className="hidden shrink-0 gap-1 @3xl:flex" />
                  {issue.due && (
                    <span className="hidden w-12 shrink-0 text-end text-xs text-muted-foreground @lg:block">
                      {formatDate(issue.due)}
                    </span>
                  )}
                  <Assignee id={issue.assignee} />
                  <MenuTrigger
                    controller={menu}
                    payload={issue}
                    aria-label={`Actions for ${issue.id}`}
                    className={buttonVariants({ size: "icon-sm", variant: "ghost" })}
                  >
                    <Ellipsis aria-hidden="true" />
                  </MenuTrigger>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </CheckboxGroup>
      {pageCount > 1 && (
        <footer className="flex shrink-0 justify-center border-t border-border p-2">
          <Pagination page={page} pageCount={pageCount} getHref={(page) => href(query, { page })} />
        </footer>
      )}
      <Menu
        controller={menu}
        onAction={async (action) => {
          const issue = menu.getPayload()
          if (!issue) return
          if (action === "open") router.push(href(query, { issue: issue.id }), { scroll: false })
          if (action === "copy") {
            await navigator.clipboard.writeText(issue.id)
            toast(`Copied ${issue.id}`)
          }
          if (action === "delete") remove([issue.id])
        }}
      >
        <MenuContent<Issue> align="end">
          {({ payload }) =>
            payload && (
              <>
                <MenuGroup>
                  <MenuGroupLabel>{payload.id}</MenuGroupLabel>
                  <MenuItem value="open">Open</MenuItem>
                  <MenuSub>
                    <MenuSubTrigger>Status</MenuSubTrigger>
                    <MenuSubContent>
                      <MenuRadioGroup
                        value={latest(payload).status}
                        onValueChange={(status) => setStatus([payload.id], status as Status)}
                      >
                        {statuses.map((status) => (
                          <MenuRadioItem key={status.value} value={status.value}>
                            {status.label}
                          </MenuRadioItem>
                        ))}
                      </MenuRadioGroup>
                    </MenuSubContent>
                  </MenuSub>
                  <MenuSub>
                    <MenuSubTrigger>Priority</MenuSubTrigger>
                    <MenuSubContent>
                      <MenuRadioGroup
                        value={latest(payload).priority}
                        onValueChange={(priority) => setPriority([payload.id], priority as Priority)}
                      >
                        {priorities.map((priority) => (
                          <MenuRadioItem key={priority.value} value={priority.value}>
                            {priority.label}
                          </MenuRadioItem>
                        ))}
                      </MenuRadioGroup>
                    </MenuSubContent>
                  </MenuSub>
                  <MenuItem value="copy">Copy ID</MenuItem>
                </MenuGroup>
                <MenuSeparator />
                <MenuItem value="delete" variant="destructive">
                  Delete
                </MenuItem>
              </>
            )
          }
        </MenuContent>
      </Menu>
    </div>
  )
}

export { IssueList }
