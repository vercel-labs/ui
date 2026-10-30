import { resizableStorageKey } from "@ui-sdk/core/resizable"
import { fail } from "@sveltejs/kit"
import {
  countByTab,
  filterIssues,
  parseQuery,
  readIds,
  readIssuePatch,
  readNewIssue,
  savedSizes,
  viewer,
} from "tracker-data"
import * as db from "tracker-data/store"
import type { Actions, PageServerLoad } from "./$types"

const load: PageServerLoad = ({ url, cookies }) => {
  const query = parseQuery(Object.fromEntries(url.searchParams))
  const issues = db.listIssues()
  return {
    query,
    matching: filterIssues(issues, query),
    counts: countByTab(issues),
    issue: query.issue ? db.getIssue(query.issue) : null,
    pageSize: db.getSettings().pageSize,
    sizes: savedSizes(cookies.get(resizableStorageKey("tracker"))),
  }
}

function fieldsOf(form: FormData) {
  return Object.fromEntries(
    [...new Set(form.keys())].map((key) => [key, key === "labels" ? form.getAll(key) : form.get(key)]),
  )
}

const actions: Actions = {
  create: async ({ request }) => {
    const input = readNewIssue(fieldsOf(await request.formData()))
    if ("error" in input) return fail(400, { error: input.error })
    return { id: db.createIssue(input).id }
  },
  update: async ({ request }) => {
    const form = await request.formData()
    const ids = readIds(form.getAll("id"))
    const patch = readIssuePatch(fieldsOf(form))
    if (!ids || !patch) return fail(400)
    db.updateIssues(ids, patch)
  },
  delete: async ({ request }) => {
    const ids = readIds((await request.formData()).getAll("id"))
    if (!ids) return fail(400)
    db.deleteIssues(ids)
  },
  subtasks: async ({ request }) => {
    const form = await request.formData()
    const id = String(form.get("id"))
    if (!db.getIssue(id)) return fail(404)
    db.setSubtasksDone(id, form.getAll("done").map(String))
  },
  comment: async ({ request }) => {
    const form = await request.formData()
    const id = String(form.get("id"))
    const body = String(form.get("body") ?? "").trim()
    if (!db.getIssue(id) || !body) return fail(400)
    db.addComment(id, viewer.id, body)
  },
}

export { actions, load }
