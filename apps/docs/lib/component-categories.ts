// The components sidebar and grid, grouped by what a component is for. Every
// framework ships the same set, so one list covers them all. A component
// missing here still shows, under Other.
const componentCategories = [
  {
    label: "Form Inputs",
    slugs: [
      "button",
      "checkbox",
      "field",
      "file-input",
      "input",
      "number-input",
      "otp-input",
      "password-input",
      "radio",
      "slider",
      "switch",
      "textarea",
      "toggle",
      "token-input",
    ],
  },
  {
    label: "Pickers & Lists",
    slugs: ["autocomplete", "calendar", "combobox", "command", "date-picker", "listbox", "select", "tree"],
  },
  {
    label: "Overlays",
    slugs: ["alert-dialog", "dialog", "drawer", "hover-card", "popover", "toast", "tooltip"],
  },
  {
    label: "Menus & Navigation",
    slugs: ["menu", "menubar", "navigation-menu", "pagination", "tabs", "toolbar", "trigger-menu"],
  },
  {
    label: "Display & Layout",
    slugs: [
      "accordion",
      "avatar",
      "carousel",
      "collapsible",
      "meter",
      "progress",
      "resizable",
      "scroll-area",
      "separator",
    ],
  },
]

/** Groups items by category, in category order, with uncategorized ones under Other. */
function groupByCategory<T extends object>(items: T[], slug: (item: T) => string) {
  const bySlug = new Map(items.map((item) => [slug(item), item]))
  const groups = componentCategories.map(({ label, slugs }) => ({
    label,
    items: slugs.flatMap((name) => {
      const item = bySlug.get(name)
      if (item) bySlug.delete(name)
      return item ? [item] : []
    }),
  }))
  if (bySlug.size) groups.push({ label: "Other", items: [...bySlug.values()] })
  return groups.filter((group) => group.items.length)
}

export { componentCategories, groupByCategory }
