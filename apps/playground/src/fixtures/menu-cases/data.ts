import type { MenuData } from "@ui-sdk/core/menu"

// Edge cases every framework renders the same way, as data. The composition
// fixtures render the same labels with parts, plus an item whose onSelect
// keeps the menu open.
function casesData({
  align,
  journal = false,
}: {
  align: string
  journal?: boolean
}): MenuData {
  return [
    {
      value: "zoom",
      label: "Zoom in",
      shortcut: "shift+z",
      closeOnSelect: false,
    },
    { value: "erase", label: "Erase", shortcut: "mod+backspace" },
    { value: "window", label: "New window", shortcut: "alt+n" },
    ...(journal
      ? [{ value: "journal", label: "Journal", shortcut: "mod+j" }]
      : []),
    { type: "separator" },
    {
      type: "checkbox",
      value: "autosave",
      label: "Autosave",
      closeOnSelect: true,
    },
    { type: "checkbox", value: "pinned", label: "Pinned", checked: true },
    {
      type: "radio-group",
      name: "align",
      label: "Align",
      value: align,
      items: [
        { value: "left", label: "Left" },
        { value: "right", label: "Right" },
      ],
    },
    {
      type: "submenu",
      label: "Share",
      disabled: true,
      items: [{ value: "email", label: "Email" }],
    },
  ]
}

export { casesData }
