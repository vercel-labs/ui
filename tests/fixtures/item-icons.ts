// Content every item-icons fixture renders: one of each component with
// items, whose icon parts hold text that must never reach a name, a label,
// typeahead or a search: an SVG `<title>` and an emoji. Arrows are mirrored,
// so they point the other way in right-to-left text.

// The SVG icons, by the text of their `<title>`. Each framework renders the
// same markup from `iconMarkup`.
const icons = {
  gear: {
    title: "Gear",
    path: "M8 2v2M8 12v2M2 8h2M12 8h2M8 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6",
  },
  arrow: { title: "Arrow", path: "M3 8h10M9 4l4 4-4 4" },
  trash: { title: "Trash", path: "M3 4h10M5 4v9h6V4M7 2h2" },
  berry: { title: "Berry", path: "M8 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8M8 5V2" },
  flag: { title: "Flag", path: "M4 14V2M4 3h8l-2 3 2 3H4" },
  eye: { title: "Eye", path: "M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5" },
  bold: { title: "B", path: "M4 2h5a3 3 0 0 1 0 6H4zM4 8h6a3 3 0 0 1 0 6H4z" },
  italic: { title: "I", path: "M10 2H6M10 14H6M9 2 7 14" },
  book: { title: "Book", path: "M2 3h5v11H2zM9 3h5v11H9z" },
  ghost: { title: "Ghost", path: "M4 14V7a4 4 0 0 1 8 0v7l-2-1-2 1-2-1z" },
} as const

type IconName = keyof typeof icons

// An icon's SVG, with its title, for innerHTML.
function iconMarkup(name: IconName) {
  const { title, path } = icons[name]
  return `<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor"><title>${title}</title><path d="${path}"/></svg>`
}

// An icon is an SVG's name, an emoji, or nothing. `mirror` flips it in right-to-left text.
type Entry = {
  value: string
  label: string
  icon?: IconName
  emoji?: string
  mirror?: boolean
}

const iconsFixture = {
  menu: {
    trigger: "Actions",
    items: [
      { value: "settings", label: "Settings", icon: "gear" },
      { value: "pin", label: "Pin", emoji: "📌" },
      { value: "forward", label: "Forward", icon: "arrow", mirror: true },
      { value: "plain", label: "Plain" },
    ] as Entry[],
    // An item with only an icon, named by `aria-label`.
    iconOnly: { value: "delete", label: "Delete", icon: "trash" } as Entry,
  },
  select: {
    label: "Fruit",
    placeholder: "Pick a fruit",
    items: [
      { value: "apple", label: "Apple", emoji: "🍎" },
      { value: "cherry", label: "Cherry", icon: "berry" },
      { value: "date", label: "Date" },
    ] as Entry[],
  },
  combobox: {
    label: "Country",
    items: [
      { value: "fr", label: "France", emoji: "🇫🇷" },
      { value: "cl", label: "Chile", icon: "flag" },
      { value: "jp", label: "Japan" },
    ] as Entry[],
  },
  autocomplete: {
    label: "Search",
    items: [
      { value: "preferences", label: "Preferences", icon: "gear" },
      { value: "account", label: "Account", emoji: "👤" },
    ] as Entry[],
  },
  command: {
    label: "Commands",
    items: [
      { value: "settings", label: "Settings", icon: "gear" },
      { value: "profile", label: "Profile", emoji: "👤" },
      { value: "plain", label: "Plain" },
    ] as Entry[],
  },
  tabs: {
    label: "Sections",
    tabs: [
      { value: "overview", label: "Overview", icon: "eye" },
      { value: "files", label: "Files", emoji: "📁" },
    ] as Entry[],
    // A tab with only an icon, named by `aria-label`.
    iconOnly: { value: "settings", label: "Settings", icon: "gear" } as Entry,
  },
  toggles: {
    label: "Formatting",
    bold: { value: "bold", label: "Bold", icon: "bold" } as Entry,
    // A toggle with only an icon, named by `aria-label`.
    iconOnly: { value: "italic", label: "Italic", icon: "italic" } as Entry,
  },
  navigation: {
    label: "Site",
    links: [
      { value: "docs", label: "Docs", icon: "book" },
      { value: "next", label: "Next", icon: "arrow", mirror: true },
    ] as Entry[],
  },
  // The item ?unnamed adds to the menu: only an icon, with no name.
  unnamed: { value: "ghost", icon: "ghost" as IconName },
}

// ?unnamed adds a menu item with only an icon and no name, which warns in
// development. ?selected starts the select and the combobox with a value.
function iconsOptions() {
  const params = new URLSearchParams(location.search)
  return {
    unnamed: params.has("unnamed"),
    select: params.has("selected")
      ? iconsFixture.select.items[0].value
      : undefined,
    combobox: params.has("selected")
      ? iconsFixture.combobox.items[0].value
      : undefined,
  }
}

export { iconMarkup, type IconName, icons, iconsFixture, iconsOptions }
