// The command list every implementation renders. Labels, values and order
// are the contract the specs rely on, so change them here and nowhere else.
//
// Before
// A search field named "Search commands"
// An empty message "No results found." and a status region, outside the list
// The list:
//   "Suggestions": Calendar, Search Emoji (keyword "smiley"), Calculator (disabled)
//   a separator
//   "Settings": Profile (mod+p), Billing (mod+b), Change theme… (opens the
//   "theme" page), Settings (mod+s)
// On the "theme" page: Light, Dark, System
// After
// Status "Last action": "action:<value>"
const commandFixture = {
  input: "Search commands",
  empty: "No results found.",
  groups: [
    {
      label: "Suggestions",
      items: [
        { value: "calendar", label: "Calendar" },
        { value: "emoji", label: "Search Emoji", keywords: ["smiley"] },
        { value: "calculator", label: "Calculator", disabled: true },
      ],
    },
    {
      label: "Settings",
      items: [
        { value: "profile", label: "Profile", shortcut: "mod+p" },
        { value: "billing", label: "Billing", shortcut: "mod+b" },
        { value: "theme", label: "Change theme…", page: "theme" },
        { value: "settings", label: "Settings", shortcut: "mod+s" },
      ],
    },
  ],
  theme: [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
    { value: "system", label: "System" },
  ],
}

type FixtureItem = {
  value: string
  label: string
  keywords?: string[]
  disabled?: boolean
  shortcut?: string
  page?: string
}

// The same commands as data, with the theme page as the items of "Change theme…".
function commandData() {
  return commandFixture.groups
    .map((group, index) => [
      ...(index ? [{ type: "separator" as const }] : []),
      {
        type: "group" as const,
        label: group.label,
        items: group.items.map(({ page, ...item }: FixtureItem) =>
          page ? { ...item, items: commandFixture.theme } : item
        ),
      },
    ])
    .flat()
}

// Options a spec can set through the URL: ?value=billing highlights it at
// first, ?pages=theme starts on that page, ?slow makes actions pending for
// 300ms (?fail rejects them), ?noauto turns autoHighlight off, ?filter=contains,
// ?loading sets the status, ?long renders 10,000 commands from data,
// ?highlight marks what the search matched in each label, and ?unvalued
// renders the first page's commands without a value (React and Vue).
function commandOptions() {
  const params = new URLSearchParams(location.search)
  const value = params.get("value")
  const pages = params.get("pages")
  const filter = params.get("filter")
  return {
    highlight: params.has("highlight"),
    ...(value !== null && { defaultValue: value }),
    ...(pages && { defaultPages: pages.split(",") }),
    ...(params.has("noauto") && { autoHighlight: false }),
    ...(filter && { filter: filter as "contains" | "startsWith" | "fuzzy" }),
    ...(params.has("loading") && { status: "loading" as const }),
    slow: params.has("slow"),
    fail: params.has("fail"),
    long: params.has("long"),
    unvalued: params.has("unvalued"),
  }
}

// An action: at once, or pending for 300ms with ?slow, and rejected with ?fail.
function runAction(slow: boolean, fail: boolean) {
  if (!slow && !fail) {
    return undefined
  }
  return new Promise<void>((resolve, reject) =>
    setTimeout(() => (fail ? reject(new Error("Offline")) : resolve()), 300)
  )
}

export { commandData, commandFixture, commandOptions, runAction }
