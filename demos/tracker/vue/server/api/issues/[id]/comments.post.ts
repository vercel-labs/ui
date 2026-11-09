import { viewer } from "tracker-data"
import { addComment, getIssue } from "tracker-data/store"

export default defineEventHandler(async (event) => {
  const issue = getIssue(getRouterParam(event, "id") ?? "")
  if (!issue) {
    throw createError({ statusCode: 404, message: "No such issue" })
  }
  const body = String((await readFormData(event)).get("body") ?? "").trim()
  if (!body) {
    throw createError({ statusCode: 400, message: "Write a comment first." })
  }
  addComment(issue.id, viewer.id, body)
})
