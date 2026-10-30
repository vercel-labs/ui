import { deserialize, type ActionResult } from "$app/forms"
import { refreshAll } from "$app/navigation"
import { toast } from "#ui/toast"

async function act(action: string, fields: Record<string, string | string[] | null>) {
  const body = new FormData()
  for (const [name, value] of Object.entries(fields)) {
    const items = Array.isArray(value) ? value : [value ?? ""]
    for (const item of items.length ? items : [""]) body.append(name, item)
  }
  let result: ActionResult
  try {
    const response = await fetch(`/?/${action}`, {
      method: "POST",
      body,
      headers: { accept: "application/json", "x-sveltekit-action": "true" },
    })
    result = deserialize(await response.text())
  } catch {
    result = { type: "error", error: { status: 0, message: "Network error" } }
  }
  await refreshAll()
  if (result.type !== "success") toast.error("Couldn't save your changes. Try again.")
  return result
}

export { act }
