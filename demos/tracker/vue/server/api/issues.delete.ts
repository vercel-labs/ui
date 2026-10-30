import { readIds } from "tracker-data"
import { deleteIssues } from "tracker-data/store"

export default defineEventHandler(async (event) => {
  const ids = readIds((await readBody<{ ids?: unknown }>(event))?.ids)
  if (!ids) throw createError({ statusCode: 400, message: "Invalid input" })
  deleteIssues(ids)
})
