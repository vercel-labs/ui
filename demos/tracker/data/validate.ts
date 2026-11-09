import { labels, people, priorities, statuses } from "./seed"
import type { Issue, Priority, Settings, Status } from "./types"

type IssuePatch = Partial<
  Pick<
    Issue,
    | "title"
    | "description"
    | "status"
    | "priority"
    | "assignee"
    | "due"
    | "labels"
  >
>

type NewIssue = Pick<
  Issue,
  "title" | "description" | "status" | "priority" | "assignee"
>

type Fields = Record<string, unknown>

const invalid = Symbol("invalid")

function fieldsOf(input: unknown): Fields | null {
  return input && typeof input === "object" && !Array.isArray(input)
    ? (input as Fields)
    : null
}

function title(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : invalid
}

function status(value: unknown) {
  return statuses.find((status) => status.value === value)?.value ?? invalid
}

function priority(value: unknown) {
  return (
    priorities.find((priority) => priority.value === value)?.value ?? invalid
  )
}

function assignee(value: unknown) {
  if (value === null || value === "") {
    return null
  }
  return people.find((person) => person.id === value)?.id ?? invalid
}

function due(value: unknown) {
  if (value === null || value === "") {
    return null
  }
  const valid =
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(value))
  return valid ? value : invalid
}

function labelIds(value: unknown) {
  if (!Array.isArray(value)) {
    return invalid
  }
  const ids = value.filter((id) => id !== "")
  return ids.every((id) => labels.some((label) => label.id === id))
    ? (ids as string[])
    : invalid
}

const readers = {
  title,
  description: (value: unknown) =>
    typeof value === "string" ? value : invalid,
  status,
  priority,
  assignee,
  due,
  labels: labelIds,
}

function readIssuePatch(input: unknown): IssuePatch | null {
  const fields = fieldsOf(input)
  if (!fields) {
    return null
  }
  const patch: Record<string, unknown> = {}
  for (const [key, read] of Object.entries(readers)) {
    if (!(key in fields) || fields[key] === undefined) {
      continue
    }
    const value = read(fields[key])
    if (value === invalid) {
      return null
    }
    patch[key] = value
  }
  return patch as IssuePatch
}

function readNewIssue(input: unknown): NewIssue | { error: string } {
  const fields = fieldsOf(input) ?? {}
  const value = title(fields.title)
  if (value === invalid) {
    return { error: "Give the issue a title." }
  }
  const owner = assignee(fields.assignee ?? null)
  return {
    title: value,
    description:
      typeof fields.description === "string" ? fields.description.trim() : "",
    status: (status(fields.status) === invalid
      ? "todo"
      : status(fields.status)) as Status,
    priority: (priority(fields.priority) === invalid
      ? "none"
      : priority(fields.priority)) as Priority,
    assignee: owner === invalid ? null : owner,
  }
}

function readIds(input: unknown) {
  return Array.isArray(input) &&
    input.length > 0 &&
    input.every((id) => typeof id === "string")
    ? (input as string[])
    : null
}

function clamp(value: unknown, min: number, max: number, fallback: number) {
  const number = Number(value)
  return Number.isFinite(number) && value !== "" && value !== null
    ? Math.min(max, Math.max(min, Math.round(number)))
    : fallback
}

function readSettings(input: unknown): Settings {
  const fields = fieldsOf(input) ?? {}
  return {
    emailNotifications:
      fields.emailNotifications === true || fields.emailNotifications === "on",
    pageSize: clamp(fields.pageSize, 5, 50, 10),
    autoCloseDays: clamp(fields.autoCloseDays, 7, 90, 30),
  }
}

function savedSizes(cookie: string | null | undefined): [number, number] {
  try {
    const [list, detail] = JSON.parse(cookie ?? "{}")["list,detail"] ?? []
    if (Number.isFinite(list) && Number.isFinite(detail)) {
      return [list, detail]
    }
  } catch {}
  return [58, 42]
}

export { readIds, readIssuePatch, readNewIssue, readSettings, savedSizes }
export type { IssuePatch, NewIssue }
