import { issues as seedIssues, settings as seedSettings } from "./seed"
import { markSubtasks } from "./tracker"
import type { Issue, Settings } from "./types"

type Store = { issues: Issue[]; settings: Settings; nextId: number }

const cache = globalThis as typeof globalThis & { tracker?: Store }

const store = (cache.tracker ??= {
  issues: structuredClone(seedIssues),
  settings: { ...seedSettings },
  nextId: seedIssues.length + 1,
})

function listIssues() {
  return store.issues
}

function getIssue(id: string) {
  return store.issues.find((issue) => issue.id === id) ?? null
}

function createIssue(input: Pick<Issue, "title" | "description" | "status" | "priority" | "assignee">) {
  const issue: Issue = {
    ...input,
    id: `TRK-${store.nextId++}`,
    labels: [],
    due: null,
    createdAt: new Date().toISOString(),
    subtasks: [],
    comments: [],
  }
  store.issues.unshift(issue)
  return issue
}

function updateIssues(ids: string[], patch: Partial<Omit<Issue, "id">>) {
  for (const issue of store.issues) if (ids.includes(issue.id)) Object.assign(issue, patch)
}

function deleteIssues(ids: string[]) {
  store.issues = store.issues.filter((issue) => !ids.includes(issue.id))
}

function setSubtasksDone(id: string, done: string[]) {
  const issue = getIssue(id)
  if (issue) issue.subtasks = markSubtasks(issue.subtasks, done)
}

function addComment(id: string, author: string, body: string) {
  getIssue(id)?.comments.push({
    id: crypto.randomUUID(),
    author,
    body,
    createdAt: new Date().toISOString(),
  })
}

function getSettings() {
  return store.settings
}

function updateSettings(settings: Settings) {
  store.settings = settings
}

export {
  addComment,
  createIssue,
  deleteIssues,
  getIssue,
  getSettings,
  listIssues,
  setSubtasksDone,
  updateIssues,
  updateSettings,
}
