import { readNewIssue } from "tracker-data"
import { createIssue } from "tracker-data/store"

export default defineEventHandler(async (event) => {
  const input = readNewIssue(Object.fromEntries(await readFormData(event)))
  if ("error" in input) {
    throw createError({ statusCode: 400, message: input.error })
  }
  return createIssue(input)
})
