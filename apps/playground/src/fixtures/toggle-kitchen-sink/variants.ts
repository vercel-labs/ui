// Every scenario in the kitchen sink. Each framework renders the same list.
type Variant = {
  id: string
  section: "Toggle" | "Toggle Group" | "Button" | "Separator"
  title: string
  note?: string
  // Options passed as they are.
  options?: Record<string, unknown>
  // Toggle groups: which toggles, and whether one is disabled.
  items?: "alignment" | "formatting"
  // The element the part renders instead of its default.
  render?: "span" | "link" | "hr"
  place?: "rtl"
  controlled?: boolean
  controller?: boolean
  // Cancels every change from the change callback.
  cancel?: boolean
  // Buttons: what the press handler does.
  action?: "log" | "resolve" | "reject"
  // Buttons inside a form, by type.
  form?: "submit" | "reset"
}

const items = {
  alignment: [
    { value: "left", label: "Left" },
    { value: "center", label: "Center" },
    { value: "right", label: "Right" },
  ],
  formatting: [
    { value: "bold", label: "Bold" },
    { value: "italic", label: "Italic" },
    { value: "underline", label: "Underline" },
    { value: "strike", label: "Strike", disabled: true },
  ],
}

// How long a pending press takes.
const pendingMs = 600

const variants: Variant[] = [
  { id: "toggle", section: "Toggle", title: "Default" },
  {
    id: "toggle-default-pressed",
    section: "Toggle",
    title: "defaultPressed",
    options: { defaultPressed: true },
  },
  {
    id: "toggle-disabled",
    section: "Toggle",
    title: "disabled",
    options: { disabled: true },
  },
  {
    id: "toggle-focusable-disabled",
    section: "Toggle",
    title: "focusableWhenDisabled",
    note: "Stays in the tab order with aria-disabled.",
    options: { disabled: true, focusableWhenDisabled: true },
  },
  {
    id: "toggle-controlled",
    section: "Toggle",
    title: "Controlled",
    controlled: true,
  },
  {
    id: "toggle-controller",
    section: "Toggle",
    title: "Controller",
    controller: true,
  },
  {
    id: "toggle-cancel",
    section: "Toggle",
    title: "Canceled",
    note: "Every change is canceled.",
    cancel: true,
  },
  {
    id: "toggle-span",
    section: "Toggle",
    title: "Rendered as a span",
    render: "span",
  },
  {
    id: "toggle-debug",
    section: "Toggle",
    title: "debug",
    note: "Logs to the console.",
    options: { debug: true },
  },

  {
    id: "group-single",
    section: "Toggle Group",
    title: "One at a time",
    items: "alignment",
    options: { defaultValue: ["left"] },
  },
  {
    id: "group-multiple",
    section: "Toggle Group",
    title: "multiple",
    note: "Strike is disabled and stays reachable with arrows.",
    items: "formatting",
    options: { multiple: true, defaultValue: ["bold"] },
  },
  {
    id: "group-not-deselectable",
    section: "Toggle Group",
    title: "deselectable={false}",
    items: "alignment",
    options: { deselectable: false, defaultValue: ["center"] },
  },
  {
    id: "group-vertical",
    section: "Toggle Group",
    title: "Vertical",
    items: "alignment",
    options: { orientation: "vertical" },
  },
  {
    id: "group-no-loop",
    section: "Toggle Group",
    title: "loop={false}",
    items: "alignment",
    options: { loop: false },
  },
  {
    id: "group-disabled",
    section: "Toggle Group",
    title: "disabled",
    items: "formatting",
    options: { multiple: true, disabled: true },
  },
  {
    id: "group-rtl",
    section: "Toggle Group",
    title: "Right to left",
    items: "alignment",
    place: "rtl",
  },
  {
    id: "group-controlled",
    section: "Toggle Group",
    title: "Controlled",
    items: "formatting",
    options: { multiple: true },
    controlled: true,
  },
  {
    id: "group-controller",
    section: "Toggle Group",
    title: "Controller",
    items: "formatting",
    options: { multiple: true },
    controller: true,
  },
  {
    id: "group-cancel",
    section: "Toggle Group",
    title: "Canceled",
    items: "alignment",
    cancel: true,
  },
  {
    id: "group-span",
    section: "Toggle Group",
    title: "Toggles rendered as spans",
    items: "alignment",
    render: "span",
  },

  { id: "button", section: "Button", title: "Default", action: "log" },
  {
    id: "button-pending",
    section: "Button",
    title: "Pending",
    note: `Resolves after ${pendingMs}ms.`,
    action: "resolve",
  },
  {
    id: "button-reject",
    section: "Button",
    title: "Rejected",
    note: "Its error shows in the log.",
    action: "reject",
  },
  {
    id: "button-disabled",
    section: "Button",
    title: "disabled",
    options: { disabled: true },
    action: "log",
  },
  {
    id: "button-focusable-disabled",
    section: "Button",
    title: "focusableWhenDisabled",
    options: { disabled: true, focusableWhenDisabled: true },
    action: "log",
  },
  {
    id: "button-submit",
    section: "Button",
    title: 'type="submit"',
    note: "Pending while it saves.",
    form: "submit",
    action: "resolve",
  },
  {
    id: "button-reset",
    section: "Button",
    title: 'type="reset"',
    form: "reset",
  },
  {
    id: "button-link",
    section: "Button",
    title: "Rendered as a link",
    render: "link",
  },
  {
    id: "button-link-disabled",
    section: "Button",
    title: "Disabled link",
    render: "link",
    options: { disabled: true },
  },
  {
    id: "button-span",
    section: "Button",
    title: "Rendered as a span",
    render: "span",
    action: "log",
  },

  { id: "separator", section: "Separator", title: "Horizontal" },
  {
    id: "separator-vertical",
    section: "Separator",
    title: "Vertical",
    options: { orientation: "vertical" },
  },
  {
    id: "separator-decorative",
    section: "Separator",
    title: "decorative",
    options: { decorative: true },
  },
  {
    id: "separator-hr",
    section: "Separator",
    title: "Rendered as hr",
    render: "hr",
  },
]

// A press handler's Promise for the pending variants.
function pendingAction(variant: Variant) {
  return new Promise<void>((resolve, reject) =>
    setTimeout(
      () =>
        variant.action === "reject"
          ? reject(new Error("Couldn't save"))
          : resolve(),
      pendingMs
    )
  )
}

export { items, pendingAction, pendingMs, type Variant, variants }
