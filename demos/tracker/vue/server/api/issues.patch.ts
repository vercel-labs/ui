import { readIds, readIssuePatch } from "tracker-data"
import { updateIssues } from "tracker-data/store"

export default defineEventHandler(async (event) => {
  const body = await readBody<{ ids?: unknown; patch?: unknown }>(event)
  const ids = readIds(body?.ids)
  const patch = readIssuePatch(body?.patch)
  if (!ids || !patch) {
    throw createError({ statusCode: 400, message: "Invalid input" })
  }
  updateIssues(ids, patch)
})
