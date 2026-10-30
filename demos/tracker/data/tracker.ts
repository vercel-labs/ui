import { labels, people, priorities, statuses } from "./seed"
import type { Issue, Priority, Status, Subtask } from "./types"

const tabs = [
  { value: "active", label: "Active", statuses: ["todo", "in-progress"] },
  { value: "backlog", label: "Backlog", statuses: ["backlog"] },
  { value: "closed", label: "Closed", statuses: ["done", "canceled"] },
  { value: "all", label: "All", statuses: statuses.map((status) => status.value) },
] satisfies { value: string; label: string; statuses: Status[] }[]

const viewer = people[0]

type Tab = (typeof tabs)[number]["value"]

type View = "list" | "board"

type Query = {
  tab: Tab
  view: View
  priority: Priority | null
  assignee: string | null
  page: number
  issue: string | null
}

type SearchParam = string | null | undefined

type SearchParams = Record<string, SearchParam | SearchParam[]>

function one(value: SearchParam | SearchParam[]) {
  return Array.isArray(value) ? value[0] : value
}

function parseQuery(params: SearchParams): Query {
  const tab = tabs.find((tab) => tab.value === one(params.tab))?.value ?? "active"
  const priority = priorities.find((priority) => priority.value === one(params.priority))?.value ?? null
  const assignee = people.find((person) => person.id === one(params.assignee))?.id ?? null
  const page = Math.max(1, Number.parseInt(one(params.page) ?? "1", 10) || 1)
  return {
    tab,
    view: one(params.view) === "board" ? "board" : "list",
    priority,
    assignee,
    page,
    issue: one(params.issue) ?? null,
  }
}

function href(query: Query, patch: Partial<Query> = {}) {
  const next = { ...query, ...patch }
  const params = new URLSearchParams()
  if (next.tab !== "active") params.set("tab", next.tab)
  if (next.view !== "list") params.set("view", next.view)
  if (next.priority) params.set("priority", next.priority)
  if (next.assignee) params.set("assignee", next.assignee)
  if (next.page > 1) params.set("page", String(next.page))
  if (next.issue) params.set("issue", next.issue)
  const search = params.toString()
  return search ? `/?${search}` : "/"
}

function filterIssues(issues: Issue[], query: Query) {
  const tab = tabs.find((tab) => tab.value === query.tab)!
  return issues.filter(
    (issue) =>
      (tab.statuses as Status[]).includes(issue.status) &&
      (!query.priority || issue.priority === query.priority) &&
      (!query.assignee || issue.assignee === query.assignee),
  )
}

function countByTab(issues: Issue[]) {
  return Object.fromEntries(
    tabs.map((tab) => [
      tab.value,
      issues.filter((issue) => (tab.statuses as Status[]).includes(issue.status)).length,
    ]),
  ) as Record<Tab, number>
}

function personOf(id: string | null) {
  return people.find((person) => person.id === id) ?? null
}

function labelOf(id: string) {
  return labels.find((label) => label.id === id)
}

function statusOf(value: Status) {
  return statuses.find((status) => status.value === value)!
}

function priorityOf(value: Priority) {
  return priorities.find((priority) => priority.value === value)!
}

function leaves(subtasks: Subtask[]): Subtask[] {
  return subtasks.flatMap((subtask) => (subtask.subtasks ? leaves(subtask.subtasks) : [subtask]))
}

function markSubtasks(subtasks: Subtask[], done: string[]): Subtask[] {
  return subtasks.map((subtask) => {
    if (!subtask.subtasks) return { ...subtask, done: done.includes(subtask.id) }
    const children = markSubtasks(subtask.subtasks, done)
    return { ...subtask, done: children.every((child) => child.done), subtasks: children }
  })
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", timeZone: "UTC" }).format(
    new Date(date),
  )
}

export {
  countByTab,
  filterIssues,
  formatDate,
  href,
  labelOf,
  leaves,
  markSubtasks,
  parseQuery,
  personOf,
  priorityOf,
  statusOf,
  tabs,
  viewer,
}
export type { Query, SearchParams, Tab, View }
