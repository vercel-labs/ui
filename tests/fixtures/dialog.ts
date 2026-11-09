import { presentationOption } from "./presentation"

// The dialog and alert dialog every implementation renders. Labels and order
// are the contract the specs rely on, so change them here and nowhere else.
//
// Page: Before, the dialog's trigger, the dialog, the alert dialog's trigger,
// the alert dialog, After, the last action, and a button that opens the
// dialog through a controller.
// Dialog: a backdrop, the title, the description, a labelled text field, a
// Save button that reports "save" without closing, and a close button.
// Alert dialog: a backdrop, the title, the description, Cancel, and Delete,
// which reports "delete" and closes.
const dialogFixture = {
  trigger: "Edit profile",
  title: "Profile settings",
  description: "Make changes to your profile.",
  field: "Display name",
  defaultValue: "Ada",
  action: "Save",
  close: "Close",
  // Rendered inside the dialog with ?nested.
  nested: { trigger: "Advanced", title: "Advanced settings", close: "Done" },
  // A button inside the dialog that removes its trigger, with ?removable.
  remove: "Remove trigger",
  // A form with method="dialog" inside the dialog, with ?form. Its button closes
  // the dialog and reports its value.
  form: { label: "Archive", value: "archive" },
  // A tall block of text that scrolls the dialog, with ?long.
  long: "Terms",
  // With ?shortcut: a trigger after the page's buttons, connected through the
  // controller, with these keys and a Shortcut part that shows them.
  shortcut: { trigger: "Quick edit", keys: "mod+e" },
}

const alertDialogFixture = {
  trigger: "Delete project",
  title: "Delete project?",
  description: "This permanently deletes the project and its files.",
  cancel: "Cancel",
  action: "Delete",
}

// Parts a spec can leave out or add through the URL: ?untitled drops the
// title, ?nested adds a dialog inside the dialog, ?removable adds a button
// that removes the trigger, ?form adds a method="dialog" form, ?long adds
// scrolling text, ?shortcut adds a trigger connected through the controller
// with a Shortcut part, and ?backdrop=none renders no backdrop part.
function dialogParts() {
  const params = new URLSearchParams(location.search)
  return {
    title: !params.has("untitled"),
    nested: params.has("nested"),
    removable: params.has("removable"),
    form: params.has("form"),
    long: params.has("long"),
    shortcut: params.has("shortcut"),
    backdrop: params.get("backdrop") !== "none",
  }
}

// Dialog options a spec can set through the URL:
// ?open&modal=true|false|trap-focus&outside=false&container=id&alert-open.
function dialogOptions() {
  const params = new URLSearchParams(location.search)
  const modal = params.get("modal")
  const container = params.get("container")
  return {
    ...(params.has("open") && { defaultOpen: true }),
    ...(modal && {
      modal:
        modal === "trap-focus" ? ("trap-focus" as const) : modal === "true",
    }),
    ...(params.get("outside") === "false" && { closeOnOutsidePress: false }),
    ...(container && { container: document.getElementById(container) }),
    ...presentationOption(),
  }
}

// Alert dialog options: ?alert-open starts it open.
function alertDialogOptions() {
  const params = new URLSearchParams(location.search)
  const container = params.get("container")
  return {
    ...(params.has("alert-open") && { defaultOpen: true }),
    ...(container && { container: document.getElementById(container) }),
  }
}

// Focus options for the dialog's content part: ?initialFocus=content|none&finalFocus=none.
function dialogContentOptions() {
  const params = new URLSearchParams(location.search)
  const initial = params.get("initialFocus")
  const final = params.get("finalFocus")
  return {
    ...(initial && { initialFocus: initial as "content" | "none" }),
    ...(final && { finalFocus: final as "none" }),
  }
}

// The dialog patterns page (?fixture=dialog-patterns): a menu item that opens
// a dialog, shortcuts, a dirty form that refuses to close, an async action, a
// persistent element, and popups inside a popover rendered into a container.
//
// Page: Before, the File menu, the Rename trigger (shortcut mod+k), the rename
// dialog, the Delete trigger, the delete alert dialog, a Search field, the
// Chat button (persistent), the Share popover (rendered into #popover-root),
// After, and the last action. A page shortcut, mod+j, reports "page shortcut".
const dialogPatternsFixture = {
  menu: {
    trigger: "File",
    rename: "Rename",
    close: "Close file",
    shortcut: "mod+u",
  },
  rename: {
    trigger: "Rename",
    shortcut: "mod+k",
    title: "Rename file",
    field: "Name",
    defaultValue: "notes.txt",
    cancel: "Cancel",
    // A shortcut that only works inside the dialog, reporting "saved".
    save: "mod+s",
  },
  remove: {
    trigger: "Delete",
    title: "Delete file?",
    description: "This can't be undone.",
    cancel: "Cancel",
    action: "Delete",
  },
  // A menu item that opens a dialog by setting the state its `open` prop reads.
  details: {
    menu: "Edit",
    item: "Details",
    title: "File details",
    done: "Done",
  },
  pageShortcut: "mod+j",
  // A page shortcut without a modifier, which typing in a field never runs.
  slashShortcut: "/",
  search: "Search",
  chat: "Chat",
  share: {
    trigger: "Share",
    shortcut: "mod+i",
    title: "Share",
    menu: "Options",
    item: "Copy link",
    dialog: "Invite",
    dialogTitle: "Invite people",
    done: "Done",
  },
}

export {
  alertDialogFixture,
  alertDialogOptions,
  dialogContentOptions,
  dialogFixture,
  dialogOptions,
  dialogParts,
  dialogPatternsFixture,
}
