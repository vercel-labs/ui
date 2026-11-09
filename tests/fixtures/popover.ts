import { presentationOption } from "./presentation"

// The popover every implementation renders. Labels and order are the contract
// the specs rely on, so change them here and nowhere else.
//
// Page: Before, the trigger, the popover, After, the last action, and a
// button that opens the popover through a controller.
// Popover: the title, the description, a labelled text field, a Save button
// that reports "save" without closing, and a close button.
const popoverFixture = {
  trigger: "Profile",
  title: "Edit profile",
  description: "Your name appears on your posts.",
  field: "Display name",
  defaultValue: "Ada",
  action: "Save",
  close: "Close",
  // Rendered inside the popover with ?nested.
  nested: { trigger: "More", title: "More options", action: "Archive" },
  // A menu rendered inside the popover with ?menu. Its items report their value.
  menu: {
    trigger: "Actions",
    items: [
      { value: "duplicate", label: "Duplicate" },
      { value: "rename", label: "Rename" },
    ],
  },
  // A button inside the popover that removes its trigger, with ?removable.
  remove: "Remove trigger",
  // With ?shortcut: the trigger's keys, shown by a Shortcut part inside it, keys
  // the Save button shows with a Shortcut part of its own, and a trigger outside
  // the popover, connected through the controller, with its own keys and part.
  shortcut: {
    trigger: "mod+i",
    save: "mod+s",
    remote: { trigger: "Share", keys: "mod+e" },
  },
}

// Parts a spec can leave out or add through the URL: ?untitled drops the
// title, ?nested adds a popover inside the popover, ?menu adds a menu inside
// it, in the same container, ?removable adds a button that removes the trigger,
// and ?shortcut adds keyboard shortcuts and the parts that show them.
function popoverParts() {
  const params = new URLSearchParams(location.search)
  return {
    title: !params.has("untitled"),
    nested: params.has("nested"),
    menu: params.has("menu"),
    removable: params.has("removable"),
    shortcut: params.has("shortcut"),
  }
}

// Popover options a spec can set through the URL:
// ?open&modal=true|false|trap-focus&hover&delay=0&closeDelay=0&side=top&align=center&container=id&presentation=sheet
// &dismissible=false, which records each refused dismissal for `popoverLog`.
function popoverOptions() {
  const params = new URLSearchParams(location.search)
  const modal = params.get("modal")
  const container = params.get("container")
  const number = (name: string) =>
    params.has(name) ? Number(params.get(name)) : undefined
  return {
    ...(params.has("open") && { defaultOpen: true }),
    ...(modal && {
      modal:
        modal === "trap-focus" ? ("trap-focus" as const) : modal === "true",
    }),
    ...(params.has("hover") && { openOnHover: true }),
    ...(params.has("delay") && { delay: number("delay") }),
    ...(params.has("closeDelay") && { closeDelay: number("closeDelay") }),
    ...(container && { container: document.getElementById(container) }),
    ...(params.get("dismissible") === "false" && {
      dismissible: false,
      onDismissAttempt: (details: { reason: string }) =>
        recordPopover(`attempt:${details.reason}`),
    }),
    ...presentationOption(),
  }
}

// What the popover reported, read by specs through `window.__popoverLog`.
function recordPopover(entry: string) {
  ;((window as unknown as { __popoverLog?: string[] }).__popoverLog ??=
    []).push(entry)
}

// Positioning and focus options for the content part: ?side=top&align=start&initialFocus=none.
function popoverContentOptions() {
  const params = new URLSearchParams(location.search)
  const side = params.get("side") as "top" | "bottom" | "left" | "right" | null
  const align = params.get("align") as "start" | "center" | "end" | null
  const focus = params.get("initialFocus")
  return {
    ...(side && { side }),
    ...(align && { align }),
    ...(focus && { initialFocus: focus as "content" | "none" }),
  }
}

export {
  popoverContentOptions,
  popoverFixture,
  popoverOptions,
  popoverParts,
  recordPopover,
}
