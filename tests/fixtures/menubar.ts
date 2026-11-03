// The menubar every implementation renders. Labels, order and values are the
// contract the specs rely on, so change them here and nowhere else.
const menubarFixture = {
  label: "Editor",
  file: {
    trigger: "File",
    items: [
      { value: "new-tab", label: "New Tab", shortcut: "mod+t" },
      { value: "new-window", label: "New Window" },
    ],
    // A submenu after the items.
    share: {
      trigger: "Share",
      items: [
        { value: "email", label: "Email link" },
        { value: "messages", label: "Messages" },
      ],
    },
    print: { value: "print", label: "Print…" },
  },
  edit: {
    trigger: "Edit",
    items: [
      { value: "undo", label: "Undo" },
      { value: "redo", label: "Redo", disabled: true },
      { value: "cut", label: "Cut" },
    ],
  },
  view: {
    trigger: "View",
    // A shortcut that presses the trigger.
    shortcut: "alt+shift+v",
    checkboxes: [
      { value: "bookmarks", label: "Show bookmarks", defaultChecked: true },
      { value: "urls", label: "Show full URLs" },
    ],
  },
  profiles: {
    trigger: "Profiles",
    defaultValue: "ines",
    items: [
      { value: "hollis", label: "Hollis" },
      { value: "ines", label: "Inès" },
      { value: "kofi", label: "Kofi" },
    ],
  },
  // A menu whose trigger is disabled.
  help: { trigger: "Help", items: [{ value: "docs", label: "Documentation" }] },
}

const menubarTriggers = ["File", "Edit", "View", "Profiles", "Help"]

// Menubar options a spec can set through the URL: ?orientation=vertical&loop=false&disabled&modal=true.
function menubarOptions() {
  const params = new URLSearchParams(location.search)
  const orientation = params.get("orientation")
  const modal = params.get("modal")
  return {
    ...(orientation && { orientation: orientation as "horizontal" | "vertical" }),
    ...(params.get("loop") === "false" && { loop: false }),
    ...(params.has("disabled") && { disabled: true }),
    ...(modal && { modal: modal === "pointer" ? ("pointer" as const) : modal === "true" }),
  }
}

export { menubarFixture, menubarOptions, menubarTriggers }
