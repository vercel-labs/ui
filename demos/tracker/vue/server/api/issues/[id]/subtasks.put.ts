import { getIssue, setSubtasksDone } from "tracker-data/store"

export default defineEventHandler(async (event) => {
  const issue = getIssue(getRouterParam(event, "id") ?? "")
  if (!issue) throw createError({ statusCode: 404, message: "No such issue" })
  const { done } = (await readBody<{ done?: unknown }>(event)) ?? {}
  if (!Array.isArray(done)) throw createError({ statusCode: 400, message: "Invalid input" })
  setSubtasksDone(issue.id, done.map(String))
})
