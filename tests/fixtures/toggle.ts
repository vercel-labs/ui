// What every Toggle, Toggle Group, Button and Separator fixture renders.
// Labels, values and order are the contract the specs rely on, so change them
// here and nowhere else.
type ToggleFixtureItem = { value: string; label: string; disabled?: boolean }

const toggleFixture = {
  // A toggle on its own, named by its text.
  toggle: { value: "bookmark", label: "Bookmark" },
  // One pressed at a time.
  alignment: {
    name: "alignment",
    label: "Text alignment",
    defaultValue: ["left"],
    items: [
      { value: "left", label: "Left" },
      { value: "center", label: "Center" },
      { value: "right", label: "Right" },
    ] satisfies ToggleFixtureItem[] as ToggleFixtureItem[],
  },
  // Any number pressed, with one disabled toggle.
  formatting: {
    name: "formatting",
    label: "Text formatting",
    defaultValue: ["bold"],
    items: [
      { value: "bold", label: "Bold" },
      { value: "italic", label: "Italic" },
      { value: "underline", label: "Underline" },
      { value: "strikethrough", label: "Strikethrough", disabled: true },
    ] satisfies ToggleFixtureItem[] as ToggleFixtureItem[],
  },
  // Buttons, by their text. "Submit" returns a Promise that "Finish saving"
  // resolves, and "Publish" one that "Finish publishing" resolves or "Fail
  // publishing" rejects.
  form: { label: "Profile", field: "Name", defaultName: "Ada" },
  docs: { label: "Docs", href: "#docs" },
  changelog: { label: "Changelog", href: "#changelog" },
}

// What the "Last action" status says after a change.
const toggleAction = {
  toggle: (pressed: boolean) => `bookmark: ${pressed ? "on" : "off"}`,
  group: (name: string, value: string[]) =>
    `${name}: ${value.join(", ") || "none"}`,
}

export { toggleAction, toggleFixture, type ToggleFixtureItem }
