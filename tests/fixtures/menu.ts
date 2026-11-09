// The menu every implementation renders. Labels, order and values are the contract
// the specs rely on, so change them here and nowhere else.
type MenuFixtureItem =
  | {
      type: "item"
      value: string
      label: string
      shortcut?: string
      disabled?: boolean
    }
  | { type: "separator" }
  | { type: "group"; label: string; items: MenuFixtureItem[] }
  | { type: "checkbox"; value: string; label: string; defaultChecked?: boolean }
  | {
      type: "radio-group"
      label: string
      defaultValue: string
      items: { value: string; label: string }[]
    }
  | { type: "submenu"; label: string; items: MenuFixtureItem[] }

const menuFixture = {
  trigger: "File",
  items: [
    { type: "item", value: "new", label: "New file", shortcut: "mod+n" },
    { type: "item", value: "open", label: "Open…", shortcut: "mod+o" },
    { type: "item", value: "save", label: "Save", disabled: true },
    { type: "separator" },
    {
      type: "group",
      label: "View",
      items: [
        {
          type: "checkbox",
          value: "sidebar",
          label: "Show sidebar",
          defaultChecked: true,
        },
        { type: "checkbox", value: "statusbar", label: "Show status bar" },
      ],
    },
    { type: "separator" },
    {
      type: "radio-group",
      label: "Sort by",
      defaultValue: "name",
      items: [
        { value: "name", label: "Name" },
        { value: "date", label: "Date" },
        { value: "size", label: "Size" },
      ],
    },
    { type: "separator" },
    {
      type: "submenu",
      label: "Share",
      items: [
        { type: "item", value: "email", label: "Email" },
        { type: "item", value: "link", label: "Copy link" },
        {
          type: "submenu",
          label: "More",
          items: [{ type: "item", value: "embed", label: "Embed" }],
        },
      ],
    },
    { type: "item", value: "delete", label: "Delete" },
  ] satisfies MenuFixtureItem[] as MenuFixtureItem[],
}

export { menuFixture, type MenuFixtureItem }
