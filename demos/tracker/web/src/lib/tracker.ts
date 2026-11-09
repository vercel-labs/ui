import {
  issues as seedIssues,
  markSubtasks,
  settings as seedSettings,
  viewer,
  type Issue,
  type IssuePatch,
  type NewIssue,
  type Settings,
} from "tracker-data"

const db = {
  issues: structuredClone(seedIssues),
  settings: { ...seedSettings },
  nextId: seedIssues.length + 1,
}

const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function changed() {
  for (const listener of listeners) {
    listener()
  }
}

function issueOf(id: string | null) {
  return db.issues.find((issue) => issue.id === id) ?? null
}

function createIssue(input: NewIssue) {
  const issue: Issue = {
    ...input,
    id: `TRK-${db.nextId++}`,
    labels: [],
    due: null,
    createdAt: new Date().toISOString(),
    subtasks: [],
    comments: [],
  }
  db.issues = [issue, ...db.issues]
  changed()
  return issue.id
}

function change(ids: string[], update: (issue: Issue) => Issue) {
  db.issues = db.issues.map((issue) =>
    ids.includes(issue.id) ? update(issue) : issue
  )
  changed()
}

function updateIssues(ids: string[], patch: IssuePatch) {
  change(ids, (issue) => ({ ...issue, ...patch }))
}

function deleteIssues(ids: string[]) {
  db.issues = db.issues.filter((issue) => !ids.includes(issue.id))
  changed()
}

function setSubtasksDone(id: string, done: string[]) {
  change([id], (issue) => ({
    ...issue,
    subtasks: markSubtasks(issue.subtasks, done),
  }))
}

function addComment(id: string, body: string) {
  const comment = {
    id: crypto.randomUUID(),
    author: viewer.id,
    body,
    createdAt: new Date().toISOString(),
  }
  change([id], (issue) => ({
    ...issue,
    comments: [...issue.comments, comment],
  }))
}

function saveSettings(settings: Settings) {
  db.settings = settings
  changed()
}

export {
  addComment,
  createIssue,
  db,
  deleteIssues,
  issueOf,
  saveSettings,
  setSubtasksDone,
  subscribe,
  updateIssues,
}
