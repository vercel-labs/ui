"use server"

import { refresh } from "next/cache"
import { readIds, readIssuePatch, readNewIssue, readSettings, viewer, type IssuePatch } from "tracker-data"
import * as db from "tracker-data/store"

type CreateIssueState = { error?: string; id?: string }

function invalid(): never {
  throw new Error("Invalid input")
}

async function createIssue(_state: CreateIssueState, form: FormData): Promise<CreateIssueState> {
  const input = readNewIssue(Object.fromEntries(form))
  if ("error" in input) return { error: input.error }
  const issue = db.createIssue(input)
  refresh()
  return { id: issue.id }
}

async function updateIssues(ids: string[], patch: IssuePatch) {
  const valid = readIssuePatch(patch)
  if (!readIds(ids) || !valid) invalid()
  db.updateIssues(ids, valid)
  refresh()
}

async function deleteIssues(ids: string[]) {
  if (!readIds(ids)) invalid()
  db.deleteIssues(ids)
  refresh()
}

async function setSubtasksDone(id: string, done: string[]) {
  if (!db.getIssue(id) || !Array.isArray(done)) invalid()
  db.setSubtasksDone(id, done.map(String))
  refresh()
}

async function addComment(id: string, body: string) {
  if (!db.getIssue(id) || typeof body !== "string") invalid()
  if (!body.trim()) return
  db.addComment(id, viewer.id, body.trim())
  refresh()
}

async function saveSettings(form: FormData) {
  db.updateSettings(readSettings(Object.fromEntries(form)))
  refresh()
}

export { addComment, createIssue, deleteIssues, saveSettings, setSubtasksDone, updateIssues }
export type { CreateIssueState }
