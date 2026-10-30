import { createStore, reconcile } from "solid-js"
import {
  issues as seedIssues,
  markSubtasks,
  settings as seedSettings,
  viewer,
  type IssuePatch,
  type NewIssue,
  type Settings,
} from "tracker-data"

const [db, setDb] = createStore({
  issues: structuredClone(seedIssues),
  settings: { ...seedSettings },
  nextId: seedIssues.length + 1,
})

function getIssue(id: string | null) {
  return db.issues.find((issue) => issue.id === id) ?? null
}

function createIssue(input: NewIssue) {
  const id = `TRK-${db.nextId}`
  setDb((draft) => {
    draft.issues.unshift({
      ...input,
      id,
      labels: [],
      due: null,
      createdAt: new Date().toISOString(),
      subtasks: [],
      comments: [],
    })
    draft.nextId++
  })
  return id
}

function updateIssues(ids: string[], patch: IssuePatch) {
  setDb((draft) => {
    for (const issue of draft.issues) {
      if (!ids.includes(issue.id)) continue
      const { labels, ...rest } = patch
      Object.assign(issue, rest)
      if (labels) issue.labels.splice(0, issue.labels.length, ...labels)
    }
  })
}

function deleteIssues(ids: string[]) {
  setDb((draft) => {
    for (let index = draft.issues.length - 1; index >= 0; index--)
      if (ids.includes(draft.issues[index].id)) draft.issues.splice(index, 1)
  })
}

function setSubtasksDone(id: string, done: string[]) {
  setDb((draft) => {
    const issue = draft.issues.find((issue) => issue.id === id)
    if (issue) reconcile(markSubtasks(issue.subtasks, done), "id")(issue.subtasks)
  })
}

function addComment(id: string, body: string) {
  setDb((draft) => {
    draft.issues
      .find((issue) => issue.id === id)
      ?.comments.push({
        id: crypto.randomUUID(),
        author: viewer.id,
        body,
        createdAt: new Date().toISOString(),
      })
  })
}

function saveSettings(settings: Settings) {
  setDb((draft) => {
    Object.assign(draft.settings, settings)
  })
}

export { addComment, createIssue, db, deleteIssues, getIssue, saveSettings, setSubtasksDone, updateIssues }
