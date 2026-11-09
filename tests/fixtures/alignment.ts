// Content every alignment fixture renders: popups opened from outside their
// root, a context menu, a data menu that reports through the menu, and tabs
// with find in page in a scrolling list.
const alignmentFixture = {
  rows: ["One", "Two", "Three"],
  rowActions: [
    { value: "rename", label: "Rename" },
    { value: "details", label: "Open details" },
  ],
  canvasActions: [
    { value: "cut", label: "Cut" },
    { value: "copy", label: "Copy" },
    { value: "paste", label: "Paste" },
  ],
  sections: [
    "Alpha",
    "Bravo",
    "Charlie",
    "Delta",
    "Echo",
    "Foxtrot",
    "Golf",
    "Hotel",
  ],
}

// ?keep-mounted keeps the row menu in the page while closed.
function alignmentOptions() {
  const params = new URLSearchParams(location.search)
  return { keepMounted: params.has("keep-mounted") }
}

// Counts renders of the view menu's checkbox items, by value.
function renderCounter() {
  const counts = ((
    window as unknown as { __renders?: Record<string, number> }
  ).__renders ??= {})
  return (value: string) => {
    counts[value] = (counts[value] ?? 0) + 1
    return "item"
  }
}

export { alignmentFixture, alignmentOptions, renderCounter }
