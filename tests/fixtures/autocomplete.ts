import { presentationOption } from "./presentation"

// The autocomplete every implementation renders. Labels, values and order
// are the contract the specs rely on, so change them here and nowhere else.
//
// Before
// <form "Search">
//   Label "Fruit", the field (a combobox named "Fruit", name "fruit"), a
//   trigger button "Show fruits", a Clear button "Clear"
//   The suggestions: Apple, Apricot, Avocado, Banana, Blackberry, Blueberry,
//   Cherry (disabled), Grape, Lemon, Mango. With ?grouped: "Tree fruits" and "Berries".
//   An empty message "No fruits found", a status region.
//   Submit, Reset
// </form>
// After
// Status "Last action": "value:<text>:<reason>", "submit:<text>"
// Status "Submitted"
//
// With ?highlight, suggestions mark what the text matched. With ?recent,
// "Recent searches" (Lemon, Mango) shows while the field is empty. ?nostatus
// leaves the status part out, so counts are announced.
const autocompleteFixture = {
  recent: [
    {
      type: "group" as const,
      label: "Recent searches",
      items: [
        { value: "lemon", label: "Lemon" },
        { value: "mango", label: "Mango" },
      ],
    },
  ],
  label: "Fruit",
  name: "fruit",
  formLabel: "Search",
  trigger: "Show fruits",
  clear: "Clear",
  empty: "No fruits found",
  items: [
    { value: "apple", label: "Apple" },
    { value: "apricot", label: "Apricot" },
    { value: "avocado", label: "Avocado" },
    { value: "banana", label: "Banana" },
    { value: "blackberry", label: "Blackberry" },
    { value: "blueberry", label: "Blueberry", keywords: ["bilberry"] },
    { value: "cherry", label: "Cherry", disabled: true },
    { value: "grape", label: "Grape" },
    { value: "lemon", label: "Lemon" },
    { value: "mango", label: "Mango" },
  ],
  groups: [
    {
      label: "Tree fruits",
      items: [
        { value: "apple", label: "Apple" },
        { value: "apricot", label: "Apricot" },
        { value: "lemon", label: "Lemon" },
      ],
    },
    {
      label: "Berries",
      items: [
        { value: "blackberry", label: "Blackberry" },
        { value: "blueberry", label: "Blueberry" },
        { value: "grape", label: "Grape" },
      ],
    },
  ],
}

// Options a spec can set through the URL: ?value=text, ?inline
// (inlineComplete), ?auto (autoHighlight), ?focus (openOnFocus), ?submit
// (submitOnSelect), ?async (results from a fake server, filter=false),
// ?grouped, ?required, ?readonly, ?disabled, ?fieldset, ?container=id, ?late
// (no items until the first `changeItems`, and a content with no children
// that renders them itself; React only).
function autocompleteOptions() {
  const params = new URLSearchParams(location.search)
  const value = params.get("value")
  const container = params.get("container")
  return {
    ...(value !== null && { defaultValue: value }),
    highlight: params.has("highlight"),
    recent: params.has("recent"),
    nostatus: params.has("nostatus"),
    inlineComplete: params.has("inline"),
    autoHighlight: params.has("auto"),
    openOnFocus: params.has("focus"),
    submitOnSelect: params.has("submit"),
    required: params.has("required"),
    readOnly: params.has("readonly"),
    disabled: params.has("disabled"),
    async: params.has("async"),
    grouped: params.has("grouped"),
    fieldset: params.has("fieldset"),
    late: params.has("late"),
    ...(container && { container: document.getElementById(container) }),
    ...presentationOption(),
  }
}

// A fake server: fruits whose label contains the text, after 400ms. It records
// every search and whether it was aborted, so a spec can see stale ones never land.
function searchFruits(query: string, { signal }: { signal: AbortSignal }) {
  // Recorded on the page only: a server render cancels its loads on destroy too.
  const page = globalThis as {
    fruitSearches?: { query: string; aborted: boolean }[]
  }
  const search = { query, aborted: false }
  if (typeof window !== "undefined") {
    ;(page.fruitSearches ??= []).push(search)
  }
  return new Promise<string[]>((resolve, reject) => {
    const timer = setTimeout(() => {
      const needle = query.trim().toLowerCase()
      resolve(
        autocompleteFixture.items
          .filter(
            (item) =>
              !item.disabled && item.label.toLowerCase().includes(needle)
          )
          .map((item) => item.label)
      )
    }, 400)
    signal.addEventListener("abort", () => {
      clearTimeout(timer)
      search.aborted = true
      reject(new DOMException("Aborted", "AbortError"))
    })
  })
}

// The items a spec swaps in while the list is open, with `changeItems`.
// "reversed" lists the items backwards. "replaced" keeps Banana and Grape as
// new objects, drops the rest, adds Kiwi and Peach, and shuffles them.
const changedItems = {
  reversed: [...autocompleteFixture.items].reverse(),
  replaced: [
    { value: "peach", label: "Peach" },
    { value: "banana", label: "Banana" },
    { value: "kiwi", label: "Kiwi" },
    { value: "grape", label: "Grape" },
  ],
}

export { autocompleteFixture, autocompleteOptions, changedItems, searchFruits }
