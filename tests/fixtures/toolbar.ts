// What every Toolbar fixture renders, in this order. Labels, values and order
// are the contract the specs rely on, so change them here and nowhere else.
const toolbarFixture = {
  label: "Formatting",
  // A toggle group that joins the toolbar, any number pressed.
  style: {
    label: "Text style",
    defaultValue: ["bold"],
    items: [
      { value: "bold", label: "Bold" },
      { value: "italic", label: "Italic" },
      { value: "underline", label: "Underline", disabled: true },
    ],
  },
  // One pressed at a time.
  alignment: {
    label: "Alignment",
    defaultValue: ["left"],
    items: [
      { value: "left", label: "Left" },
      { value: "center", label: "Center" },
      { value: "right", label: "Right" },
    ],
  },
  // A menu trigger rendered through a toolbar button.
  font: { trigger: "Font", items: ["Sans", "Serif", "Mono"] },
  // A number field rendered through a toolbar input.
  size: { label: "Font size", defaultValue: 14 },
  // A plain text field.
  comment: { label: "Comment", defaultValue: "Draft" },
  // A group of buttons, Redo disabled.
  history: { label: "History", items: [{ label: "Undo" }, { label: "Redo", disabled: true }] },
  // A toggle on its own.
  spellcheck: { label: "Spellcheck" },
  help: { label: "Help", href: "#help" },
}

// Every item arrow keys reach, in order.
const toolbarItems = [
  "Bold",
  "Italic",
  "Underline",
  "Left",
  "Center",
  "Right",
  "Font",
  "Font size",
  "Comment",
  "Undo",
  "Redo",
  "Spellcheck",
  "Help",
]

// With ?locked, disabled toolbar groups hold the Text style toggle group, the
// Spellcheck toggle, History and Help, until the Unlock button outside enables them.
const toolbarLocked = () => new URLSearchParams(location.search).has("locked")

// Toolbar options a spec can set through the URL: ?orientation=vertical&loop=false&disabled.
function toolbarOptions() {
  const params = new URLSearchParams(location.search)
  const orientation = params.get("orientation")
  return {
    ...(orientation && { orientation: orientation as "horizontal" | "vertical" }),
    ...(params.get("loop") === "false" && { loop: false }),
    ...(params.has("disabled") && { disabled: true }),
  }
}

export { toolbarFixture, toolbarItems, toolbarLocked, toolbarOptions }
