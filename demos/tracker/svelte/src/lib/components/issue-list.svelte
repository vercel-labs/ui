<script lang="ts">
  import { Ellipsis, Inbox, Trash2, X } from "@lucide/svelte"
  import { goto } from "$app/navigation"
  import { tick } from "svelte"
  import Assignee from "#lib/components/assignee.svelte"
  import IssueLabels from "#lib/components/issue-labels.svelte"
  import PriorityIcon from "#lib/components/priority-icon.svelte"
  import StatusIcon from "#lib/components/status-icon.svelte"
  import { act } from "#lib/act.ts"
  import { buttonVariants } from "#ui/button"
  import { Checkbox, CheckboxGroup } from "#ui/checkbox"
  import {
    createMenuController,
    Menu,
    MenuContent,
    type MenuContentState,
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
  } from "#ui/menu"
  import { Pagination } from "#ui/pagination"
  import { ScrollArea } from "#ui/scroll-area"
  import { toast } from "#ui/toast"
  import { Toolbar, ToolbarButton, ToolbarSeparator } from "#ui/toolbar"
  import { getTracker } from "#lib/tracker.svelte.ts"
  import {
    formatDate,
    href,
    priorities,
    statusOf,
    statuses,
    type Issue,
    type Priority,
    type Query,
    type Status,
  } from "tracker-data"

  let { issues, query, pageSize }: { issues: Issue[]; query: Query; pageSize: number } = $props()

  const { confirm } = getTracker()
  const menu = createMenuController<Issue>()
  let selected = $state<string[]>([])
  let head = $state<HTMLElement>()

  const pageCount = $derived(Math.max(1, Math.ceil(issues.length / pageSize)))
  const page = $derived(Math.min(query.page, pageCount))
  const rows = $derived(issues.slice((page - 1) * pageSize, page * pageSize))
  const checked = $derived(selected.filter((id) => rows.some((issue) => issue.id === id)))

  function plural(count: number) {
    return count === 1 ? "1 issue" : `${count} issues`
  }

  async function setStatus(ids: string[], status: Status) {
    const result = await act("update", { id: ids, status })
    if (result.type === "success") toast(`${ids.length === 1 ? ids[0] : plural(ids.length)} moved to ${statusOf(status).label}`)
  }

  async function setPriority(ids: string[], priority: Priority) {
    await act("update", { id: ids, priority })
  }

  async function remove(ids: string[]) {
    const yes = await confirm({
      title: `Delete ${ids.length === 1 ? ids[0] : plural(ids.length)}?`,
      description: "Deleted issues and their comments can't be brought back.",
      confirmLabel: "Delete",
    })
    if (!yes) return
    const result = await act("delete", { id: ids })
    if (result.type !== "success") return
    selected = []
    if (query.issue && ids.includes(query.issue)) await goto(href(query, { issue: null }), { reset: false })
    toast.success(`${plural(ids.length)} deleted`)
    await tick()
    head?.querySelector("button")?.focus()
  }

  async function run(action: string) {
    const issue = menu.getPayload()
    if (!issue) return
    if (action === "open") goto(href(query, { issue: issue.id }), { reset: false })
    if (action === "copy") {
      await navigator.clipboard.writeText(issue.id)
      toast(`Copied ${issue.id}`)
    }
    if (action === "delete") remove([issue.id])
  }
</script>

<div class="flex min-h-0 flex-1 flex-col">
  <CheckboxGroup
    aria-label="Issues"
    bind:value={() => checked, (next) => (selected = next)}
    allValues={rows.map((issue) => issue.id)}
    class="flex min-h-0 flex-1 flex-col"
  >
    <div bind:this={head} class="flex h-11 shrink-0 items-center gap-3 border-b border-border ps-4 pe-2">
      <Checkbox parent aria-label="Select all issues on this page" disabled={rows.length === 0} />
      {#if checked.length > 0}
        <Toolbar aria-label="Selected issues" class="flex-1 gap-1">
          <span class="me-2 text-sm font-medium">{checked.length} selected</span>
          <Menu onAction={(status: string) => setStatus(checked, status as Status)}>
            <ToolbarButton class={buttonVariants({ size: "sm", variant: "ghost" })}>
              {#snippet render({ props })}
                <MenuTrigger {...props}>Set status</MenuTrigger>
              {/snippet}
            </ToolbarButton>
            <MenuContent align="start">
              {#each statuses as status (status.value)}
                <MenuItem value={status.value}>
                  <MenuItemIcon><StatusIcon status={status.value} /></MenuItemIcon>
                  {status.label}
                </MenuItem>
              {/each}
            </MenuContent>
          </Menu>
          <ToolbarButton onclick={() => remove(checked)} class={buttonVariants({ size: "sm", variant: "ghost" })}>
            <Trash2 aria-hidden="true" />
            Delete
          </ToolbarButton>
          <ToolbarSeparator />
          <ToolbarButton
            onclick={() => (selected = [])}
            aria-label="Clear selection"
            class={buttonVariants({ size: "icon-sm", variant: "ghost" })}
          >
            <X aria-hidden="true" />
          </ToolbarButton>
        </Toolbar>
      {:else}
        <span class="text-sm text-muted-foreground">{plural(issues.length)}</span>
      {/if}
    </div>
    <ScrollArea label="Issue list" class="flex-1">
      {#if rows.length === 0}
        <div class="flex flex-col items-center gap-2 py-24 text-muted-foreground">
          <Inbox aria-hidden="true" class="size-6" />
          No issues match these filters.
        </div>
      {:else}
        <ul class="@container">
          {#each rows as issue (issue.id)}
            <li
              data-current={issue.id === query.issue || undefined}
              class="flex h-11 items-center gap-3 border-b border-border ps-4 pe-2 transition-colors hover:bg-muted/50 has-data-checked:bg-muted/70 data-current:bg-muted"
            >
              <Checkbox value={issue.id} aria-label={`Select ${issue.id}`} />
              <PriorityIcon priority={issue.priority} label />
              <span class="hidden w-12 shrink-0 text-xs text-muted-foreground tabular-nums @md:block">{issue.id}</span>
              <StatusIcon status={issue.status} label />
              <a
                href={href(query, { issue: issue.id })}
                aria-current={issue.id === query.issue || undefined}
                class="min-w-0 flex-1 truncate rounded-md font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
              >
                {issue.title}
              </a>
              <IssueLabels labels={issue.labels} class="hidden shrink-0 gap-1 @3xl:flex" />
              {#if issue.due}
                <span class="hidden w-12 shrink-0 text-end text-xs text-muted-foreground @lg:block">
                  {formatDate(issue.due)}
                </span>
              {/if}
              <Assignee id={issue.assignee} />
              <MenuTrigger
                controller={menu}
                payload={issue}
                aria-label={`Actions for ${issue.id}`}
                class={buttonVariants({ size: "icon-sm", variant: "ghost" })}
              >
                <Ellipsis aria-hidden="true" />
              </MenuTrigger>
            </li>
          {/each}
        </ul>
      {/if}
    </ScrollArea>
  </CheckboxGroup>
  {#if pageCount > 1}
    <footer class="flex shrink-0 justify-center border-t border-border p-2">
      <Pagination {page} {pageCount} getHref={(page) => href(query, { page })} />
    </footer>
  {/if}
  <Menu controller={menu} onAction={run}>
    <MenuContent align="end">
      {#snippet children({ payload }: MenuContentState<Issue>)}
        {#if payload}
          <MenuGroup>
            <MenuGroupLabel>{payload.id}</MenuGroupLabel>
            <MenuItem value="open">Open</MenuItem>
            <MenuSub>
              <MenuSubTrigger>Status</MenuSubTrigger>
              <MenuSubContent>
                <MenuRadioGroup
                  value={payload.status}
                  onValueChange={(status: string) => setStatus([payload.id], status as Status)}
                >
                  {#each statuses as status (status.value)}
                    <MenuRadioItem value={status.value}>{status.label}</MenuRadioItem>
                  {/each}
                </MenuRadioGroup>
              </MenuSubContent>
            </MenuSub>
            <MenuSub>
              <MenuSubTrigger>Priority</MenuSubTrigger>
              <MenuSubContent>
                <MenuRadioGroup
                  value={payload.priority}
                  onValueChange={(priority: string) => setPriority([payload.id], priority as Priority)}
                >
                  {#each priorities as priority (priority.value)}
                    <MenuRadioItem value={priority.value}>{priority.label}</MenuRadioItem>
                  {/each}
                </MenuRadioGroup>
              </MenuSubContent>
            </MenuSub>
            <MenuItem value="copy">Copy ID</MenuItem>
          </MenuGroup>
          <MenuSeparator />
          <MenuItem value="delete" variant="destructive">Delete</MenuItem>
        {/if}
      {/snippet}
    </MenuContent>
  </Menu>
</div>
