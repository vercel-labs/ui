import { presentationOption } from "./presentation"

// The combobox every implementation renders. Labels, values and order are the
// contract the specs rely on, so change them here and nowhere else.
//
// Before
// <form "Profile">
//   Label "Country", the input (a combobox named "Country"), a trigger button
//   "Show countries", Clear
//   The list: Argentina, Australia, Austria, Belgium, Brazil, Canada, Chile,
//   Denmark (disabled), France, Germany. With ?grouped: "Americas" and "Europe".
//   With ?multiple: chips before the input, each with a "Remove <label>" button.
//   With ?create: a create option, "Create “<text>”".
//   An empty message "No countries found", a status region.
//   Submit, Reset
// </form>
// After
// Status "Last action": "value:<value>", "query:<text>:<reason>", "create:<text>"
// Status "Submitted"
//
// With ?highlight, labels mark what the text matched. With ?recent, "Recent"
// (France, Chile) shows while the input is empty. With ?select-all and
// ?multiple, an option "Select all" comes first, and "Select all <group>" in
// each group with ?grouped. With ?overflow, chips stay on one 320px line and
// the rest collapse into "+N more". With ?pages, results load from a fake
// server four at a time, the next page when the end is reached, with a status
// "Loading more…". ?nostatus leaves the status part out, so counts are
// announced. ?summary=2 shows a "Summary" status with two labels and a count.
const comboboxFixture = {
  label: "Country",
  name: "country",
  formLabel: "Profile",
  trigger: "Show countries",
  clear: "Clear",
  empty: "No countries found",
  selectAll: "Select all",
  summary: "Summary",
  recent: [
    {
      type: "group" as const,
      label: "Recent",
      items: [
        { value: "fr", label: "France" },
        { value: "cl", label: "Chile" },
      ],
    },
  ],
  items: [
    { value: "ar", label: "Argentina" },
    { value: "au", label: "Australia" },
    { value: "at", label: "Austria" },
    { value: "be", label: "Belgium" },
    { value: "br", label: "Brazil" },
    { value: "ca", label: "Canada" },
    { value: "cl", label: "Chile" },
    { value: "dk", label: "Denmark", disabled: true },
    { value: "fr", label: "France" },
    { value: "de", label: "Germany", keywords: ["deutschland"] },
  ],
  groups: [
    {
      label: "Americas",
      items: [
        { value: "ar", label: "Argentina" },
        { value: "br", label: "Brazil" },
        { value: "ca", label: "Canada" },
      ],
    },
    {
      label: "Europe",
      items: [
        { value: "at", label: "Austria" },
        { value: "fr", label: "France" },
        { value: "de", label: "Germany" },
      ],
    },
  ],
}

// Options a spec can set through the URL:
// ?value=fr selects France at first (comma-separated with ?multiple),
// ?multiple, ?max=2, ?grouped, ?create (an option that creates, pending for
// 300ms with ?slow), ?required, ?readonly, ?disabled, ?auto (autoHighlight),
// ?async (results load from a fake server, ?filter=false implied),
// ?container=id, ?long (10,000 items), ?fieldset (in a disabled fieldset),
// ?late (no items until the first `changeItems`, and a content with no
// children that renders them itself; React only).
function comboboxOptions() {
  const params = new URLSearchParams(location.search)
  const multiple = params.has("multiple")
  const value = params.get("value")
  const container = params.get("container")
  const max = params.get("max")
  const summary = params.get("summary")
  return {
    multiple,
    highlight: params.has("highlight"),
    recent: params.has("recent"),
    selectAll: params.has("select-all"),
    overflow: params.has("overflow"),
    pages: params.has("pages"),
    nostatus: params.has("nostatus"),
    ...(summary && { summary: Number(summary) }),
    ...(value !== null && {
      defaultValue: multiple ? value.split(",").filter(Boolean) : value,
    }),
    ...(max && { maxSelected: Number(max) }),
    grouped: params.has("grouped"),
    create: params.has("create"),
    slow: params.has("slow"),
    required: params.has("required"),
    readOnly: params.has("readonly"),
    disabled: params.has("disabled"),
    autoHighlight: params.has("auto"),
    async: params.has("async"),
    long: params.has("long"),
    fieldset: params.has("fieldset"),
    late: params.has("late"),
    // ?cancel=br cancels the value changes that select Brazil.
    cancel: params.get("cancel"),
    // ?labels-from-items leaves out `itemToLabel`, so only the items know the labels.
    labelsFromItems: params.has("labels-from-items"),
    ...(container && { container: document.getElementById(container) }),
    // ?modal=false, for a sheet that leaves the page usable.
    ...(params.get("modal") === "false" && { modal: false as const }),
    ...presentationOption(),
  }
}

function cancelsValue(value: unknown, cancel: string | null) {
  return cancel !== null && [value].flat().includes(cancel)
}

// A fake server: countries whose label contains the text, after 150ms.
function searchCountries(query: string, { signal }: { signal: AbortSignal }) {
  return new Promise<{ value: string; label: string }[]>((resolve, reject) => {
    const timer = setTimeout(() => {
      const needle = query.trim().toLowerCase()
      resolve(
        comboboxFixture.items.filter((item) =>
          item.label.toLowerCase().includes(needle)
        )
      )
    }, 150)
    signal.addEventListener("abort", () => {
      clearTimeout(timer)
      reject(new DOMException("Aborted", "AbortError"))
    })
  })
}

// A fake server that answers four countries at a time, after 150ms, so a
// list can load the next page when its end is reached.
function searchCountryPages(
  query: string,
  { signal, page }: { signal: AbortSignal; page: number }
) {
  return searchCountries(query, { signal }).then((found) => ({
    items: found.slice(page * 4, page * 4 + 4),
    hasMore: found.length > page * 4 + 4,
  }))
}

// A create handler: resolves after 300ms with ?slow, at once without.
function createDelay(slow: boolean) {
  return slow
    ? new Promise<void>((resolve) => setTimeout(resolve, 300))
    : undefined
}

// The items a spec swaps in while the list is open, with `changeItems`.
// "reversed" lists the items backwards. "replaced" keeps France and Brazil as
// new objects, drops the rest, adds Spain and Italy, and shuffles them.
const changedItems = {
  reversed: [...comboboxFixture.items].reverse(),
  replaced: [
    { value: "es", label: "Spain" },
    { value: "fr", label: "France" },
    { value: "it", label: "Italy" },
    { value: "br", label: "Brazil" },
  ],
}

export {
  cancelsValue,
  changedItems,
  comboboxFixture,
  comboboxOptions,
  createDelay,
  searchCountries,
  searchCountryPages,
}
