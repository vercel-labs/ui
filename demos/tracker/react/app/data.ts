import { cacheLife, cacheTag } from "next/cache"
import * as db from "tracker-data/store"

const tags = {
  issues: "issues",
  issue: (id: string) => `issue:${id}`,
  settings: "settings",
}

async function listIssues() {
  "use cache"
  cacheLife("max")
  cacheTag(tags.issues)
  return db.listIssues()
}

async function getIssue(id: string) {
  "use cache"
  cacheLife("max")
  cacheTag(tags.issue(id))
  return db.getIssue(id)
}

async function getSettings() {
  "use cache"
  cacheLife("max")
  cacheTag(tags.settings)
  return db.getSettings()
}

export { getIssue, getSettings, listIssues, tags }
