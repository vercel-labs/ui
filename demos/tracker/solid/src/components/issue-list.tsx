import { useNavigate } from "@solidjs/router"
import { createMemo, createSignal, For, Show } from "solid-js"
import {
  formatDate,
  href,
  priorities,
  statuses,
  statusOf,
  type Issue,
  type Priority,
  type Query,
  type Status,
} from "tracker-data"
import { Assignee } from "@/components/assignee"
import { Ellipsis, Inbox, Trash2, X } from "@/components/icons"
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
import {
  Toolbar,
  ToolbarButton,
  ToolbarSeparator,
} from "@/components/ui/toolbar"
import { deleteIssues, updateIssues } from "@/lib/tracker"

function plural(count: number) {
  return count === 1 ? "1 issue" : `${count} issues`
}

function IssueList(props: { issues: Issue[]; query: Query; pageSize: number }) {
  const navigate = useNavigate()
  const menu = createMenuController<Issue>()
  const [selected, setSelected] = createSignal<string[]>([])
  let all: HTMLButtonElement | undefined
  const pageCount = createMemo(() =>
    Math.max(1, Math.ceil(props.issues.length / props.pageSize))
  )
  const page = createMemo(() => Math.min(props.query.page, pageCount()))
  const rows = createMemo(() =>
    props.issues.slice((page() - 1) * props.pageSize, page() * props.pageSize)
  )
  const pageHref = createMemo(() => {
    const query = props.query
    return (page: number) => href(query, { page })
  })
  const checked = createMemo(() =>
    selected().filter((id) => rows().some((issue) => issue.id === id))
  )

  function setStatus(ids: string[], status: Status) {
    updateIssues(ids, { status })
    toast(
      `${ids.length === 1 ? ids[0] : plural(ids.length)} moved to ${statusOf(status).label}`
    )
  }

  function setPriority(ids: string[], priority: Priority) {
    updateIssues(ids, { priority })
  }

  async function remove(ids: string[]) {
    const yes = await confirm({
      title: `Delete ${ids.length === 1 ? ids[0] : plural(ids.length)}?`,
      description: "Deleted issues and their comments can't be brought back.",
      confirmLabel: "Delete",
    })
    if (!yes) {
      return
    }
    deleteIssues(ids)
    setSelected([])
    if (props.query.issue && ids.includes(props.query.issue)) {
      navigate(href(props.query, { issue: null }), { scroll: false })
    }
    all?.focus()
    toast.success(`${plural(ids.length)} deleted`)
  }

  async function run(action: string) {
    const issue = menu.getPayload()
    if (!issue) {
      return
    }
    if (action === "open") {
      navigate(href(props.query, { issue: issue.id }), { scroll: false })
    }
    if (action === "copy") {
      await navigator.clipboard.writeText(issue.id)
      toast(`Copied ${issue.id}`)
    }
    if (action === "delete") {
      remove([issue.id])
    }
  }

  return (
    <div class="flex min-h-0 flex-1 flex-col">
      <CheckboxGroup
        aria-label="Issues"
        value={checked()}
        onValueChange={setSelected}
        allValues={rows().map((issue) => issue.id)}
        class="flex min-h-0 flex-1 flex-col"
      >
        <div class="flex h-11 shrink-0 items-center gap-3 border-b border-border ps-4 pe-2">
          <Checkbox
            ref={(element) => (all = element)}
            parent
            aria-label="Select all issues on this page"
            disabled={rows().length === 0}
          />
          <Show
            when={checked().length > 0}
            fallback={
              <span class="text-sm text-muted-foreground">
                {plural(props.issues.length)}
              </span>
            }
          >
            <Toolbar aria-label="Selected issues" class="flex-1 gap-1">
              <span class="me-2 text-sm font-medium">
                {checked().length} selected
              </span>
              <Menu
                onAction={(status) => setStatus(checked(), status as Status)}
              >
                <ToolbarButton
                  render={(attributes) => <MenuTrigger {...attributes} />}
                  class={buttonVariants({ size: "sm", variant: "ghost" })}
                >
                  Set status
                </ToolbarButton>
                <MenuContent align="start">
                  <For each={statuses}>
                    {(status) => (
                      <MenuItem value={status.value}>
                        <MenuItemIcon>
                          <StatusIcon status={status.value} />
                        </MenuItemIcon>
                        {status.label}
                      </MenuItem>
                    )}
                  </For>
                </MenuContent>
              </Menu>
              <ToolbarButton
                onClick={() => remove(checked())}
                class={buttonVariants({ size: "sm", variant: "ghost" })}
              >
                <Trash2 aria-hidden="true" />
                Delete
              </ToolbarButton>
              <ToolbarSeparator />
              <ToolbarButton
                onClick={() => setSelected([])}
                aria-label="Clear selection"
                class={buttonVariants({ size: "icon-sm", variant: "ghost" })}
              >
                <X aria-hidden="true" />
              </ToolbarButton>
            </Toolbar>
          </Show>
        </div>
        <ScrollArea label="Issue list" class="flex-1">
          <Show
            when={rows().length > 0}
            fallback={
              <div class="flex flex-col items-center gap-2 py-24 text-muted-foreground">
                <Inbox aria-hidden="true" class="size-6" />
                No issues match these filters.
              </div>
            }
          >
            <ul class="@container">
              <For each={rows()} keyed={(issue) => issue.id}>
                {(issue) => (
                  <li
                    data-current={issue().id === props.query.issue || undefined}
                    class="flex h-11 items-center gap-3 border-b border-border ps-4 pe-2 transition-colors hover:bg-muted/50 has-data-checked:bg-muted/70 data-current:bg-muted"
                  >
                    <Checkbox
                      value={issue().id}
                      aria-label={`Select ${issue().id}`}
                    />
                    <PriorityIcon priority={issue().priority} label />
                    <span class="hidden w-12 shrink-0 text-xs text-muted-foreground tabular-nums @md:block">
                      {issue().id}
                    </span>
                    <StatusIcon status={issue().status} label />
                    <a
                      href={href(props.query, { issue: issue().id })}
                      noscroll
                      class="min-w-0 flex-1 truncate rounded-md font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
                    >
                      {issue().title}
                    </a>
                    <IssueLabels
                      labels={issue().labels}
                      class="hidden shrink-0 gap-1 @3xl:flex"
                    />
                    <Show when={issue().due}>
                      {(due) => (
                        <span class="hidden w-12 shrink-0 text-end text-xs text-muted-foreground @lg:block">
                          {formatDate(due())}
                        </span>
                      )}
                    </Show>
                    <Assignee id={issue().assignee} />
                    <MenuTrigger
                      controller={menu}
                      payload={issue()}
                      aria-label={`Actions for ${issue().id}`}
                      class={buttonVariants({
                        size: "icon-sm",
                        variant: "ghost",
                      })}
                    >
                      <Ellipsis aria-hidden="true" />
                    </MenuTrigger>
                  </li>
                )}
              </For>
            </ul>
          </Show>
        </ScrollArea>
      </CheckboxGroup>
      <Show when={pageCount() > 1}>
        <footer class="flex shrink-0 justify-center border-t border-border p-2">
          <Pagination
            page={page()}
            pageCount={pageCount()}
            getHref={pageHref()}
          />
        </footer>
      </Show>
      <Menu controller={menu} onAction={run}>
        <MenuContent<Issue> align="end">
          {(state) => (
            <Show when={state.payload}>
              {(payload) => (
                <>
                  <MenuGroup>
                    <MenuGroupLabel>{payload().id}</MenuGroupLabel>
                    <MenuItem value="open">Open</MenuItem>
                    <MenuSub>
                      <MenuSubTrigger>Status</MenuSubTrigger>
                      <MenuSubContent>
                        <MenuRadioGroup
                          value={payload().status}
                          onValueChange={(status) =>
                            setStatus([payload().id], status as Status)
                          }
                        >
                          <For each={statuses}>
                            {(status) => (
                              <MenuRadioItem value={status.value}>
                                {status.label}
                              </MenuRadioItem>
                            )}
                          </For>
                        </MenuRadioGroup>
                      </MenuSubContent>
                    </MenuSub>
                    <MenuSub>
                      <MenuSubTrigger>Priority</MenuSubTrigger>
                      <MenuSubContent>
                        <MenuRadioGroup
                          value={payload().priority}
                          onValueChange={(priority) =>
                            setPriority([payload().id], priority as Priority)
                          }
                        >
                          <For each={priorities}>
                            {(priority) => (
                              <MenuRadioItem value={priority.value}>
                                {priority.label}
                              </MenuRadioItem>
                            )}
                          </For>
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
              )}
            </Show>
          )}
        </MenuContent>
      </Menu>
    </div>
  )
}

export { IssueList }
