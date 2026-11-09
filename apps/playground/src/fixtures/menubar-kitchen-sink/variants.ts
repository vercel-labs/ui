// Every scenario in the kitchen sink. Each framework renders the same list.
type Variant = {
  id: string
  section: "Toolbar" | "Menubar"
  title: string
  note?: string
  // Options passed as they are.
  options?: Record<string, unknown>
  place?: "rtl"
  // Toolbar: which items it holds.
  content?: "basic" | "composed" | "groups"
  // Toolbar: a disabled button that's skipped instead of focusable.
  skipDisabled?: boolean
  // Menubar: menus written as data.
  data?: boolean
  controller?: boolean
}

// What a menubar's menus hold, in every variant.
type MenuEntry = {
  value: string
  label: string
  shortcut?: string
  disabled?: boolean
}
const menus = {
  file: {
    trigger: "File",
    items: [
      { value: "new", label: "New Tab", shortcut: "mod+t" },
      { value: "open", label: "Open…" },
      { value: "close", label: "Close", disabled: true },
    ] as MenuEntry[],
    share: ["Email link", "Messages"],
  },
  edit: {
    trigger: "Edit",
    items: [
      { value: "undo", label: "Undo" },
      { value: "redo", label: "Redo" },
    ] as MenuEntry[],
  },
  view: {
    trigger: "View",
    checkboxes: [
      { value: "bookmarks", label: "Show bookmarks" },
      { value: "urls", label: "Show full URLs" },
    ],
  },
  profiles: { trigger: "Profiles", radios: ["Andy", "Benoit", "Luis"] },
}

const variants: Variant[] = [
  { id: "toolbar", section: "Toolbar", title: "Default", content: "basic" },
  {
    id: "toolbar-vertical",
    section: "Toolbar",
    title: "orientation",
    options: { orientation: "vertical" },
    content: "basic",
  },
  {
    id: "toolbar-no-loop",
    section: "Toolbar",
    title: "loop",
    options: { loop: false },
    content: "basic",
  },
  {
    id: "toolbar-disabled",
    section: "Toolbar",
    title: "disabled",
    note: "Items stay focusable with aria-disabled.",
    options: { disabled: true },
    content: "basic",
  },
  {
    id: "toolbar-skip-disabled",
    section: "Toolbar",
    title: "focusableWhenDisabled",
    note: "The disabled button is skipped.",
    content: "basic",
    skipDisabled: true,
  },
  {
    id: "toolbar-composed",
    section: "Toolbar",
    title: "Menus, selects and fields",
    note: "Rendered through ToolbarButton and ToolbarInput.",
    content: "composed",
  },
  {
    id: "toolbar-groups",
    section: "Toolbar",
    title: "Groups",
    note: "The second group is disabled.",
    content: "groups",
  },
  {
    id: "toolbar-rtl",
    section: "Toolbar",
    title: "Right to left",
    place: "rtl",
    content: "basic",
  },
  {
    id: "toolbar-controller",
    section: "Toolbar",
    title: "Controller",
    controller: true,
    content: "basic",
  },

  { id: "menubar", section: "Menubar", title: "Default" },
  {
    id: "menubar-vertical",
    section: "Menubar",
    title: "orientation",
    options: { orientation: "vertical" },
  },
  {
    id: "menubar-no-loop",
    section: "Menubar",
    title: "loop",
    options: { loop: false },
  },
  {
    id: "menubar-disabled",
    section: "Menubar",
    title: "disabled",
    options: { disabled: true },
  },
  {
    id: "menubar-modal",
    section: "Menubar",
    title: "modal",
    note: "Locks the page, except the menubar.",
    options: { modal: true },
  },
  {
    id: "menubar-not-modal",
    section: "Menubar",
    title: "modal",
    options: { modal: false },
  },
  { id: "menubar-data", section: "Menubar", title: "Data menus", data: true },
  {
    id: "menubar-rtl",
    section: "Menubar",
    title: "Right to left",
    place: "rtl",
  },
  {
    id: "menubar-controller",
    section: "Menubar",
    title: "Controller",
    controller: true,
  },
]

export { menus, type Variant, variants }
