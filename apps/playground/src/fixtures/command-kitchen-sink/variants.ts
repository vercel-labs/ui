import type { CommandData, CommandDataItem } from "@ui-sdk/core/command"

// Every scenario in the kitchen sink. Each framework renders the same list.
type Variant = {
  id: string
  section: string
  title: string
  note?: string
  // Which commands the list holds.
  list?: List
  // Composition renders CommandItem parts, with a CommandPage per nested page. Data passes `items`.
  mode?: "composition" | "data"
  options?: {
    defaultValue?: string
    defaultQuery?: string
    defaultPages?: string[]
    filter?: "fuzzy" | "contains" | "startsWith" | false | "function"
    autoHighlight?: boolean
    loop?: boolean
    status?: "loading" | "error"
    debug?: boolean
  }
  // Gives Profile, Billing and Settings shortcuts with these modifiers, like "alt+shift" for alt+shift+p.
  shortcuts?: string
  // What `onAction` returns: nothing, a Promise that resolves after 1.2s, or one that rejects.
  action?: "async" | "reject"
  // What every item's `onSelect` returns. Web components have no item callbacks that wait, so they use `action`.
  select?: "async" | "reject"
  // Results from a fake server, with `filter={false}`, `status`, CommandStatus and CommandEmpty. Error always fails.
  async?: "ok" | "error"
  rtl?: boolean
  controlled?: "value" | "query" | "pages"
  controller?: boolean
  // A Command inside a Dialog, opened by a DialogTrigger with shortcut="mod+k".
  dialog?: boolean
}

type List =
  "default" | "flat" | "strings" | "disabled" | "many" | "long" | "empty"

// The commands most variants show. "Change theme…" opens a page, which opens another.
function commands(shortcuts?: string) {
  const key = (letter: string) =>
    shortcuts ? `${shortcuts}+${letter}` : undefined
  const items: CommandData = [
    {
      type: "group",
      label: "Suggestions",
      items: [
        { value: "calendar", label: "Calendar" },
        {
          value: "emoji",
          label: "Search Emoji",
          keywords: ["smiley", "emoticon"],
        },
        { value: "calculator", label: "Calculator", disabled: true },
      ],
    },
    { type: "separator" },
    {
      type: "group",
      label: "Settings",
      items: [
        { value: "profile", label: "Profile", shortcut: key("p") },
        { value: "billing", label: "Billing", shortcut: key("b") },
        {
          value: "theme",
          label: "Change theme…",
          items: [
            { value: "light", label: "Light" },
            { value: "dark", label: "Dark" },
            { value: "system", label: "System" },
            {
              value: "accent",
              label: "Accent color…",
              items: [
                { value: "red", label: "Red" },
                { value: "green", label: "Green" },
                { value: "blue", label: "Blue" },
              ],
            },
          ],
        },
        {
          value: "settings",
          label: "Settings",
          shortcut: key("s"),
          keywords: ["preferences"],
        },
      ],
    },
  ]
  return items
}

const flat: CommandData = [
  { value: "new-file", label: "New File" },
  { value: "open-file", label: "Open File…" },
  { value: "save", label: "Save" },
  { value: "save-as", label: "Save As…" },
  { value: "close", label: "Close Window" },
  { value: "reload", label: "Reload Window" },
]

const strings: CommandData = [
  "Copy",
  "Cut",
  "Paste",
  "Select All",
  "Undo",
  "Redo",
]

const disabled: CommandData = [
  { value: "rename", label: "Rename" },
  { value: "duplicate", label: "Duplicate", disabled: true },
  { value: "move", label: "Move to…", disabled: true },
  { value: "archive", label: "Archive" },
  { value: "delete", label: "Delete", disabled: true },
]

const many: CommandData = Array.from({ length: 1000 }, (_, index) => ({
  value: `command-${index + 1}`,
  label: `Command ${index + 1}`,
}))

const long: CommandData = Array.from({ length: 60 }, (_, index) => ({
  value: `row-${index + 1}`,
  label: `Row ${index + 1}`,
}))

function listOf(variant: Variant) {
  switch (variant.list) {
    case "flat":
      return flat
    case "strings":
      return strings
    case "disabled":
      return disabled
    case "many":
      return many
    case "long":
      return long
    case "empty":
      return []
    default:
      return commands(variant.shortcuts)
  }
}

// Every nested page in a list, flattened, for composed CommandPage parts.
function pagesOf(list: CommandData) {
  const pages: { value: string; items: CommandData }[] = []
  const walk = (entries: CommandData) => {
    for (const entry of entries) {
      if (
        typeof entry === "string" ||
        ("type" in entry && entry.type === "separator")
      ) {
        continue
      }
      if ("type" in entry && entry.type === "group") {
        walk(entry.items)
      } else if ((entry as CommandDataItem).items) {
        const { value, items } = entry as Required<
          Pick<CommandDataItem, "value" | "items">
        >
        pages.push({ value, items })
        walk(items)
      }
    }
  }
  walk(list)
  return pages
}

// Ranks commands: the start of the label first, then the start of a word, then anywhere, keywords too. 0 hides.
function score(item: { label: string; keywords?: string[] }, query: string) {
  const needle = query.trim().toLowerCase()
  if (!needle) {
    return 1
  }
  const label = item.label.toLowerCase()
  if (label.startsWith(needle)) {
    return 3
  }
  if (label.split(/\s+/).some((word) => word.startsWith(needle))) {
    return 2
  }
  if (
    label.includes(needle) ||
    item.keywords?.some((keyword) => keyword.includes(needle))
  ) {
    return 1
  }
  return 0
}

// The filter option, with "function" standing for `score`.
function filterOf(variant: Variant) {
  const filter = variant.options?.filter
  return filter === "function" ? score : filter
}

const wait = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, ms)
    signal?.addEventListener("abort", () => {
      clearTimeout(timer)
      reject(signal.reason)
    })
  })

// What a command does when it runs. It logs, and an async kind waits 1.2s first, so `data-pending` shows. Reject fails.
function runner(
  kind: "async" | "reject" | undefined,
  log: (message: string) => void,
  name: string
) {
  return (value: string) => {
    log(`${name} ${value}`)
    if (!kind) {
      return
    }
    return wait(1200).then(() => {
      if (kind === "reject") {
        log(`${name} ${value} failed`)
        throw new Error(`Couldn't run ${value}.`)
      }
      log(`${name} ${value} done`)
    })
  }
}

// A fake server: commands whose label contains the text, after 600ms. "error" always fails.
function search(kind: "ok" | "error") {
  return async (query: string, { signal }: { signal: AbortSignal }) => {
    await wait(600, signal)
    if (kind === "error") {
      throw new Error("The server is down.")
    }
    const needle = query.trim().toLowerCase()
    const pool = [...flat, ...disabled] as CommandDataItem[]
    return pool.filter((entry) => entry.label.toLowerCase().includes(needle))
  }
}

const variants: Variant[] = [
  {
    id: "composition",
    section: "Items",
    title: "Composition",
    note: "CommandGroup, CommandGroupLabel, CommandSeparator and CommandItem parts. Calculator is disabled.",
  },
  {
    id: "flat",
    section: "Items",
    title: "No groups",
    list: "flat",
  },
  {
    id: "data",
    section: "Items",
    title: "Data items",
    note: "Groups, separators, nested pages and shortcuts (ctrl+alt+p, b, s), all from `items`.",
    mode: "data",
    shortcuts: "ctrl+alt",
  },
  {
    id: "data-strings",
    section: "Items",
    title: "Data strings",
    note: "Plain strings are commands too.",
    mode: "data",
    list: "strings",
  },
  {
    id: "disabled",
    section: "Items",
    title: "Disabled items",
    note: "Arrow keys skip them, and they can't run.",
    list: "disabled",
  },
  {
    id: "long",
    section: "Items",
    title: "Long scrolling list",
    note: "60 composed commands. The highlight scrolls into view.",
    list: "long",
  },
  {
    id: "many",
    section: "Items",
    title: "1,000 data items",
    note: "Ranks without rendering every command twice.",
    mode: "data",
    list: "many",
  },

  {
    id: "filter-fuzzy",
    section: "Filtering",
    title: 'filter "fuzzy"',
    note: "Default. “stg” finds Settings, best matches first.",
    options: { filter: "fuzzy" },
  },
  {
    id: "filter-contains",
    section: "Filtering",
    title: 'filter "contains"',
    note: "“al” finds Calendar and Calculator.",
    options: { filter: "contains" },
  },
  {
    id: "filter-starts",
    section: "Filtering",
    title: 'filter "startsWith"',
    note: "“c” finds Calendar, Calculator and Change theme….",
    options: { filter: "startsWith" },
  },
  {
    id: "filter-false",
    section: "Filtering",
    title: "filter false",
    note: "Every command stays, for results a server filtered.",
    options: { filter: false },
  },
  {
    id: "filter-function",
    section: "Filtering",
    title: "filter function (scores)",
    note: "Label start 3, word start 2, anywhere 1. Data commands sort by score.",
    mode: "data",
    options: { filter: "function" },
  },
  {
    id: "keywords",
    section: "Filtering",
    title: "Item keywords",
    note: "“smiley” finds Search Emoji, “preferences” finds Settings.",
  },

  {
    id: "auto-highlight-false",
    section: "Behavior",
    title: "autoHighlight false",
    note: "Nothing is highlighted until an arrow key or the pointer.",
    options: { autoHighlight: false },
  },
  {
    id: "loop-false",
    section: "Behavior",
    title: "loop false",
    note: "Arrow keys stop at the ends.",
    options: { loop: false },
  },
  {
    id: "default-value",
    section: "Behavior",
    title: "defaultValue",
    note: "Billing is highlighted at first.",
    options: { defaultValue: "billing" },
  },
  {
    id: "default-query",
    section: "Behavior",
    title: "defaultQuery",
    options: { defaultQuery: "set" },
  },
  {
    id: "rtl",
    section: "Behavior",
    title: "Right to left",
    rtl: true,
    shortcuts: "alt+shift",
  },
  {
    id: "debug",
    section: "Behavior",
    title: "debug",
    note: "Logs state changes to the console.",
    options: { debug: true },
  },

  {
    id: "status-loading",
    section: "Status",
    title: 'status "loading"',
    note: "CommandStatus says so, the list gets aria-busy and CommandEmpty waits.",
    list: "empty",
    options: { status: "loading", filter: false },
  },
  {
    id: "status-error",
    section: "Status",
    title: 'status "error"',
    list: "empty",
    options: { status: "error", filter: false },
  },
  {
    id: "empty",
    section: "Status",
    title: "CommandEmpty",
    note: "Starts with text that matches nothing.",
    options: { defaultQuery: "zzz" },
  },
  {
    id: "async",
    section: "Status",
    title: "Async results",
    note: "A fake server answers in 600ms. filter false, status, CommandStatus and CommandEmpty.",
    mode: "data",
    async: "ok",
  },
  {
    id: "async-error",
    section: "Status",
    title: "Async results that fail",
    mode: "data",
    async: "error",
  },

  {
    id: "shortcuts",
    section: "Shortcuts",
    title: "Item shortcuts",
    note: "alt+shift+p, b or s runs the command from anywhere. CommandShortcut shows the keys.",
    shortcuts: "alt+shift",
  },
  {
    id: "dialog",
    section: "Shortcuts",
    title: "In a Dialog",
    note: "⌘K or Ctrl+K opens it. Escape clears the text, goes back a page, then closes.",
    dialog: true,
  },

  {
    id: "pages",
    section: "Pages",
    title: "CommandPage",
    note: "Change theme… opens a page, Accent color… another. Backspace in the empty field or Escape goes back.",
  },
  {
    id: "pages-default",
    section: "Pages",
    title: "defaultPages",
    note: "Starts on the theme page.",
    options: { defaultPages: ["theme"] },
  },
  {
    id: "pages-data",
    section: "Pages",
    title: "Nested data pages",
    note: "Data commands with `items` open a page of them.",
    mode: "data",
    options: { defaultPages: ["theme"] },
  },
  {
    id: "controlled-pages",
    section: "Pages",
    title: "Controlled pages",
    controlled: "pages",
  },

  {
    id: "action-async",
    section: "Actions",
    title: "onAction returns a Promise",
    note: "The command is pending for 1.2s: data-pending and aria-busy.",
    action: "async",
  },
  {
    id: "action-reject",
    section: "Actions",
    title: "onAction rejects",
    note: "After 1.2s the item shows its error, until it runs again.",
    action: "reject",
  },
  {
    id: "select-async",
    section: "Actions",
    title: "Item onSelect returns a Promise",
    note: "onSelect runs before onAction, and its Promise marks the command pending.",
    select: "async",
  },
  {
    id: "select-reject",
    section: "Actions",
    title: "Item onSelect rejects",
    select: "reject",
  },

  {
    id: "controlled-value",
    section: "Controlled",
    title: "Controlled value",
    controlled: "value",
  },
  {
    id: "controlled-query",
    section: "Controlled",
    title: "Controlled query",
    controlled: "query",
  },
  {
    id: "controller",
    section: "Controlled",
    title: "Controller",
    note: "push, pop, setValue, setQuery, run and focus from outside.",
    controller: true,
  },
]

export {
  commands,
  filterOf,
  type List,
  listOf,
  pagesOf,
  runner,
  score,
  search,
  type Variant,
  variants,
}
