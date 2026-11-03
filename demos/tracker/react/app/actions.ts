"use server"

// These actions accept any caller. Production code must authenticate the user
// and authorize each action before it reads or changes data.
import { updateTag } from "next/cache"
import { readIds, readIssuePatch, readNewIssue, readSettings, viewer, type IssuePatch } from "tracker-data"
import * as db from "tracker-data/store"
import { tags } from "@/app/data"

type CreateIssueState = { error?: string; id?: string }

function invalid(): never {
  throw new Error("Invalid input")
}

function expireIssues(ids: string[]) {
  updateTag(tags.issues)
  for (const id of ids) updateTag(tags.issue(id))
}

async function createIssue(_state: CreateIssueState, form: FormData): Promise<CreateIssueState> {
  const input = readNewIssue(Object.fromEntries(form))
  if ("error" in input) return { error: input.error }
  const issue = db.createIssue(input)
  expireIssues([issue.id])
  return { id: issue.id }
}

async function updateIssues(ids: string[], patch: IssuePatch) {
  const valid = readIssuePatch(patch)
  if (!readIds(ids) || !valid) invalid()
  db.updateIssues(ids, valid)
  expireIssues(ids)
}

async function deleteIssues(ids: string[]) {
  if (!readIds(ids)) invalid()
  db.deleteIssues(ids)
  expireIssues(ids)
}

async function setSubtasksDone(id: string, done: string[]) {
  if (!db.getIssue(id) || !Array.isArray(done)) invalid()
  db.setSubtasksDone(id, done.map(String))
  updateTag(tags.issue(id))
}

async function addComment(id: string, body: string) {
  if (!db.getIssue(id) || typeof body !== "string") invalid()
  if (!body.trim()) return
  db.addComment(id, viewer.id, body.trim())
  updateTag(tags.issue(id))
}

async function saveSettings(form: FormData) {
  db.updateSettings(readSettings(Object.fromEntries(form)))
  updateTag(tags.settings)
}

export { addComment, createIssue, deleteIssues, saveSettings, setSubtasksDone, updateIssues }
export type { CreateIssueState }
