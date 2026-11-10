import type { IssuePatch } from "tracker-data"
import { toast } from "~/components/ui/toast"

type Options = NonNullable<Parameters<typeof $fetch>[1]>

async function send(url: string, options: Options) {
  try {
    await $fetch(url, options)
    return true
  } catch {
    toast.error("Couldn't save your changes. Try again.")
    return false
  } finally {
    await refreshNuxtData("issues")
  }
}

async function createIssue(form: FormData) {
  const issue = await $fetch("/api/issues", { method: "POST", body: form })
  await refreshNuxtData("issues")
  return issue
}

function updateIssues(ids: string[], patch: IssuePatch) {
  return send("/api/issues", { method: "PATCH", body: { ids, patch } })
}

function deleteIssues(ids: string[]) {
  return send("/api/issues", { method: "DELETE", body: { ids } })
}

function setSubtasksDone(id: string, done: string[]) {
  return send(`/api/issues/${id}/subtasks`, { method: "PUT", body: { done } })
}

function addComment(id: string, form: FormData) {
  return send(`/api/issues/${id}/comments`, { method: "POST", body: form })
}

export { addComment, createIssue, deleteIssues, setSubtasksDone, updateIssues }
