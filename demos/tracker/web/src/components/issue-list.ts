import { createMenuController } from "@ui-sdk/core/menu"
import { confirm, toast } from "@ui-sdk/web"
import { cn } from "cn"
import { html, nothing } from "lit-html"
import { createRef } from "lit-html/directives/ref.js"
import { repeat } from "lit-html/directives/repeat.js"
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
import { icon } from "../lib/icons"
import { navigate } from "../lib/router"
import { deleteIssues, issueOf, updateIssues } from "../lib/tracker"
import { assignee, button, checkbox, issueLabels, priorityIcon, statusIcon, styles } from "../lib/ui"
import { onChange, redraw } from "../lib/view"
import { pagination } from "./pagination"

const menu = createMenuController<Issue>()
const all = createRef<HTMLElement>()

let selected: string[] = []
let shown: string[] = []
let payload: Issue | null = null
let current: Query

function plural(count: number) {
  return count === 1 ? "1 issue" : `${count} issues`
}

function select(ids: string[]) {
  selected = ids
  redraw()
}

function setStatus(ids: string[], status: Status) {
  updateIssues(ids, { status })
  toast(`${ids.length === 1 ? ids[0] : plural(ids.length)} moved to ${statusOf(status).label}`)
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
  if (!yes) return
  selected = []
  deleteIssues(ids)
  if (current.issue && ids.includes(current.issue)) navigate(href(current, { issue: null }))
  all.value?.focus()
  toast.success(`${plural(ids.length)} deleted`)
}

async function run(action: string) {
  const issue = menu.getPayload()
  if (!issue) return
  if (action === "open") navigate(href(current, { issue: issue.id }))
  if (action === "copy") {
    await navigator.clipboard.writeText(issue.id)
    toast(`Copied ${issue.id}`)
  }
  if (action === "delete") remove([issue.id])
}

function radioItem(value: string, label: string) {
  return html`<ui-menu-radio-item value=${value} class=${cn(styles.menuItem, "pe-8")}>
    ${label}
    <ui-menu-item-indicator class=${styles.indicator}>${icon("check")}</ui-menu-item-indicator>
  </ui-menu-radio-item>`
}

function subMenu(label: string, content: unknown) {
  return html`<ui-menu-sub>
    <ui-menu-sub-trigger class=${cn(styles.menuItem, "data-open:bg-accent")}>
      ${label} ${icon("chevron-right", "ms-auto text-muted-foreground rtl:rotate-180")}
    </ui-menu-sub-trigger>
    <ui-menu-sub-content class=${styles.menu}>${content}</ui-menu-sub-content>
  </ui-menu-sub>`
}

function rowMenu() {
  const issue = payload && issueOf(payload.id)
  return html`<ui-menu
    id="issue-actions"
    .controller=${menu}
    @action=${(event: CustomEvent<{ value: string }>) => run(event.detail.value)}
    @payloadchange=${(event: CustomEvent<{ value: Issue | null }>) => {
      payload = event.detail.value
      redraw()
    }}
  >
    <ui-menu-content align="end" side-offset="6" class=${styles.menu}>
      ${
        issue
          ? html`<ui-menu-group>
                <ui-menu-group-label class=${styles.menuGroupLabel}>${issue.id}</ui-menu-group-label>
                <ui-menu-item value="open" class=${styles.menuItem}>Open</ui-menu-item>
                ${subMenu(
                  "Status",
                  html`<ui-menu-radio-group
                    .value=${issue.status}
                    @valuechange=${onChange(
                      () => issueOf(issue.id)?.status,
                      (status) => status && setStatus([issue.id], status),
                    )}
                  >
                    ${statuses.map((status) => radioItem(status.value, status.label))}
                  </ui-menu-radio-group>`,
                )}
                ${subMenu(
                  "Priority",
                  html`<ui-menu-radio-group
                    .value=${issue.priority}
                    @valuechange=${onChange(
                      () => issueOf(issue.id)?.priority,
                      (priority) => priority && setPriority([issue.id], priority),
                    )}
                  >
                    ${priorities.map((priority) => radioItem(priority.value, priority.label))}
                  </ui-menu-radio-group>`,
                )}
                <ui-menu-item value="copy" class=${styles.menuItem}>Copy ID</ui-menu-item>
              </ui-menu-group>
              <ui-menu-separator class=${styles.menuSeparator}></ui-menu-separator>
              <ui-menu-item value="delete" class=${cn(styles.menuItem, styles.menuDestructive)}
                >Delete</ui-menu-item
              >`
          : nothing
      }
    </ui-menu-content>
  </ui-menu>`
}

function selectionToolbar(checked: string[]) {
  return html`<ui-toolbar aria-label="Selected issues" class="flex flex-1 items-center gap-1">
    <span class="me-2 text-sm font-medium">${checked.length} selected</span>
    <ui-menu
      @action=${(event: CustomEvent<{ value: string }>) => setStatus(checked, event.detail.value as Status)}
    >
      <ui-toolbar-button>
        <ui-menu-trigger
          ><button class=${button({ size: "sm", variant: "ghost" })}>Set status</button></ui-menu-trigger
        >
      </ui-toolbar-button>
      <ui-menu-content align="start" side-offset="6" class=${styles.menu}>
        ${statuses.map(
          (status) =>
            html`<ui-menu-item value=${status.value} class=${styles.menuItem}>
              <ui-menu-item-icon class=${styles.menuItemIcon}>${statusIcon(status.value)}</ui-menu-item-icon>
              ${status.label}
            </ui-menu-item>`,
        )}
      </ui-menu-content>
    </ui-menu>
    <ui-toolbar-button>
      <button class=${button({ size: "sm", variant: "ghost" })} @click=${() => remove(checked)}>
        ${icon("trash")} Delete
      </button>
    </ui-toolbar-button>
    <ui-toolbar-separator class="mx-1 h-5 w-px shrink-0 bg-border"></ui-toolbar-separator>
    <ui-toolbar-button>
      <button
        aria-label="Clear selection"
        class=${button({ size: "icon-sm", variant: "ghost" })}
        @click=${() => select([])}
      >
        ${icon("x")}
      </button>
    </ui-toolbar-button>
  </ui-toolbar>`
}

function row(issue: Issue, query: Query) {
  return html`<li
    ?data-current=${issue.id === query.issue}
    class="flex h-11 items-center gap-3 border-b border-border ps-4 pe-2 transition-colors hover:bg-muted/50 has-data-checked:bg-muted/70 data-current:bg-muted"
  >
    ${checkbox({ value: issue.id, label: `Select ${issue.id}` })}
    ${priorityIcon(issue.priority, { label: true })}
    <span class="hidden w-12 shrink-0 text-xs text-muted-foreground tabular-nums @md:block">${issue.id}</span>
    ${statusIcon(issue.status, { label: true })}
    <a
      href=${href(query, { issue: issue.id })}
      aria-current=${issue.id === query.issue ? "true" : nothing}
      class="min-w-0 flex-1 truncate rounded-md font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
    >
      ${issue.title}
    </a>
    ${issueLabels(issue.labels, "hidden shrink-0 gap-1 @3xl:flex")}
    ${
      issue.due
        ? html`<span class="hidden w-12 shrink-0 text-end text-xs text-muted-foreground @lg:block">
            ${formatDate(issue.due)}
          </span>`
        : nothing
    }
    ${assignee(issue.assignee)}
    <ui-menu-trigger for="issue-actions" .payload=${issue}>
      <button aria-label=${`Actions for ${issue.id}`} class=${button({ size: "icon-sm", variant: "ghost" })}>
        ${icon("ellipsis")}
      </button>
    </ui-menu-trigger>
  </li>`
}

function issueList(issues: Issue[], query: Query, pageSize: number) {
  current = query
  const pageCount = Math.max(1, Math.ceil(issues.length / pageSize))
  const page = Math.min(query.page, pageCount)
  const rows = issues.slice((page - 1) * pageSize, page * pageSize)
  const checked = selected.filter((id) => rows.some((issue) => issue.id === id))
  shown = checked

  return html`<div class="flex min-h-0 flex-1 flex-col">
    <ui-checkbox-group
      aria-label="Issues"
      .value=${checked}
      all-values=${rows.map((issue) => issue.id).join(",")}
      @valuechange=${onChange(() => shown, select)}
      class="flex min-h-0 flex-1 flex-col"
    >
      <div class="flex h-11 shrink-0 items-center gap-3 border-b border-border ps-4 pe-2">
        ${checkbox({ label: "Select all issues on this page", parent: true, disabled: rows.length === 0, target: all })}
        ${
          checked.length > 0
            ? selectionToolbar(checked)
            : html`<span class="text-sm text-muted-foreground">${plural(issues.length)}</span>`
        }
      </div>
      <ui-scroll-area class="relative min-h-0 flex-1">
        <ui-scroll-area-viewport
          aria-label="Issue list"
          class="size-full rounded-[inherit] outline-none focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:ring-inset"
        >
          <ui-scroll-area-content>
            ${
              rows.length > 0
                ? html`<ul class="@container">
                    ${repeat(
                      rows,
                      (issue) => issue.id,
                      (issue) => row(issue, query),
                    )}
                  </ul>`
                : html`<div class="flex flex-col items-center gap-2 py-24 text-muted-foreground">
                    ${icon("inbox", "size-6")} No issues match these filters.
                  </div>`
            }
          </ui-scroll-area-content>
        </ui-scroll-area-viewport>
        <ui-scroll-area-scrollbar
          class="flex w-2.5 p-px opacity-0 transition-opacity duration-150 data-visible:opacity-100 motion-reduce:transition-none"
        >
          <ui-scroll-area-thumb class="relative flex-1 rounded-full bg-border"></ui-scroll-area-thumb>
        </ui-scroll-area-scrollbar>
      </ui-scroll-area>
    </ui-checkbox-group>
    ${
      pageCount > 1
        ? html`<footer class="flex shrink-0 justify-center border-t border-border p-2">
            ${pagination(page, pageCount, (page) => href(query, { page }))}
          </footer>`
        : nothing
    }
    ${rowMenu()}
  </div>`
}

export { issueList }
