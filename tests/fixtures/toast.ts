// The toasts every implementation shows. Labels and order are the contract the
// specs rely on, so change them here and nowhere else.
//
// Page: Before, a button for each kind of toast, a button that opens a modal
// dialog, a Delete button that asks through confirm() (overlay host pages
// only), After, the last action, and the region, placed once. Specs also call
// `window.showToast(options)`, which every fixture maps to its own API.
// Each toast renders its title, its description, its action when it has one,
// and a Dismiss button.
const toastFixture = {
  region: "Notifications",
  dismiss: "Dismiss",
  basic: {
    trigger: "Show toast",
    title: "Event created",
    description: "Sunday, December 3 at 9:00 AM",
    action: "Undo",
  },
  success: { trigger: "Show success", title: "Changes saved" },
  error: { trigger: "Show error", title: "Upload failed", description: "The file is too large." },
  promise: { trigger: "Save with promise", loading: "Saving…", success: "Saved", error: "Could not save" },
  // A modal dialog with a button that shows a toast while it's open.
  dialog: { trigger: "Open dialog", title: "Edit profile", toast: "Notify from dialog", close: "Close" },
  // Asks through confirm() on overlay host pages (?host): "Delete project?",
  // and reports "confirmed" or "declined".
  confirm: { trigger: "Delete project", title: "Delete project?", confirm: "Delete", cancel: "Cancel" },
}

/** What `window.showToast()` takes, the same in every fixture. */
type FixtureToast = {
  title: string
  description?: string
  type?: "default" | "success" | "error" | "info" | "warning" | "loading"
  duration?: number
  id?: string
  // An action button that reports `action:<label>` and closes the toast, or
  // with `pending`, waits that many ms first.
  action?: string
  pending?: number
  dismissible?: boolean
}

// Region options a spec can set through the URL:
// ?side=top&align=start&max-visible=2&duration=1000&expanded&shortcut=alt+t|none&host.
// ?host renders the overlay host, with toasts from data, instead of a placed region.
function toastOptions() {
  const params = new URLSearchParams(location.search)
  const side = params.get("side") as "top" | "bottom" | null
  const align = params.get("align") as "start" | "center" | "end" | null
  const shortcut = params.get("shortcut")
  return {
    ...(side && { side }),
    ...(align && { align }),
    ...(params.has("max-visible") && { maxVisible: Number(params.get("max-visible")) }),
    ...(params.has("expanded") && { expanded: true }),
    ...(shortcut && { shortcut: shortcut === "none" ? null : shortcut }),
  }
}

// The default duration for the page's toasts, from ?duration, else 5000.
function toastDuration() {
  const params = new URLSearchParams(location.search)
  return params.has("duration") ? Number(params.get("duration")) : 5000
}

function usesHost() {
  return new URLSearchParams(location.search).has("host")
}

// The role specs find toasts by: list items named by their titles.
const toastRole = "listitem" as const

export { type FixtureToast, toastDuration, toastFixture, toastOptions, toastRole, usesHost }
