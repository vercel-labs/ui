// Filtering for the listbox engine behind Select, Combobox, Autocomplete,
// Command and TriggerMenu, ranked by score with case and accents folded.
// Listbox, which nobody types into, uses the engine alone.
import {
  createListboxEngine,
  isGroup,
  isSeparator,
  toListItem,
  type ListData,
  type ListFilter,
  type ListGroup,
  type ListItem,
} from "./listbox-engine"
import { foldText, leadingSpaces } from "../text/match"

function textMatchesNeedle(
  text: string,
  needle: string,
  mode: "contains" | "startsWith"
) {
  const haystack = foldText(text)
  return mode === "startsWith"
    ? haystack.startsWith(needle, leadingSpaces(haystack))
    : haystack.includes(needle)
}

// Whether text matches a query the way a filter asks. Case and accents are
// ignored the way the user's language ignores them.
function textMatches(
  text: string,
  query: string,
  mode: "contains" | "startsWith"
) {
  const needle = foldText(query.trim())
  return !needle || textMatchesNeedle(text, needle, mode)
}

function itemMatchesNeedle<T>(
  item: ListItem<T>,
  needle: string,
  mode: "contains" | "startsWith"
) {
  if (textMatchesNeedle(item.label, needle, mode)) {
    return true
  }
  const keywords = item.keywords
  if (keywords) {
    for (let index = 0; index < keywords.length; index++) {
      if (textMatchesNeedle(keywords[index], needle, mode)) {
        return true
      }
    }
  }
  return false
}

// How well an item matches a query: 0 hides it, and higher ranks it first.
function itemScore<T>(
  item: ListItem<T>,
  query: string,
  filter: ListFilter<T> | undefined
) {
  if (filter === false || filter === undefined || !query.trim()) {
    return 1
  }
  if (typeof filter === "function") {
    const result = filter(item, query)
    return typeof result === "number" ? Math.max(0, result) : result ? 1 : 0
  }
  const needle = foldText(query.trim())
  return !needle || itemMatchesNeedle(item, needle, filter) ? 1 : 0
}

function itemMatches<T>(
  item: ListItem<T>,
  query: string,
  filter: ListFilter<T> | undefined
) {
  return itemScore(item, query, filter) > 0
}

// The data a list shows for a query: matching items, groups that still have
// some, and separators between what's left. Ranking puts the best first, and
// drops separators once it moves an entry out of the sections they divide.
function filterData<T>(
  data: ListData<T>,
  query: string,
  filter: ListFilter<T> | undefined,
  { rank = false }: { rank?: boolean } = {}
) {
  if (filter === false || filter === undefined) {
    return data
  }
  const trimmed = query.trim()
  if (!trimmed) {
    return data
  }
  if (rank) {
    return rankData(data, query, trimmed, filter)
  }
  const needle = typeof filter === "function" ? "" : foldText(trimmed)
  if (typeof filter !== "function" && !needle) {
    return data
  }
  const matchesEntry = (entry: ListItem<T> | (T & string)) => {
    if (typeof filter === "function") {
      const result = filter(toListItem(entry), query)
      return typeof result === "number" ? result > 0 : !!result
    }
    return typeof entry === "string"
      ? textMatchesNeedle(entry, needle, filter)
      : itemMatchesNeedle(entry, needle, filter)
  }
  const result: ListData<T> = []
  // A separator waits for the next kept entry, so none leads, trails or doubles.
  let separator: ListData<T>[number] | undefined
  const keep = (entry: ListData<T>[number]) => {
    if (separator && result.length) {
      result.push(separator)
    }
    separator = undefined
    result.push(entry)
  }
  for (let index = 0; index < data.length; index++) {
    const entry = data[index]
    if (isSeparator(entry)) {
      separator = entry
      continue
    }
    if (isGroup(entry)) {
      const items: ListGroup<T>["items"] = []
      for (let childIndex = 0; childIndex < entry.items.length; childIndex++) {
        const child = entry.items[childIndex]
        if (matchesEntry(child)) {
          items.push(child)
        }
      }
      if (items.length) {
        keep({ ...entry, items })
      }
      continue
    }
    if (matchesEntry(entry)) {
      keep(entry)
    }
  }
  return result
}

type Ranked<T> = {
  entry: ListData<T>[number]
  score: number
  separator?: ListData<T>[number]
}

// Sorts by score, best first. Equal scores keep their order, since sort is stable.
const byScore = <T>(a: Ranked<T>, b: Ranked<T>) => b.score - a.score

function rankData<T>(
  data: ListData<T>,
  query: string,
  trimmed: string,
  filter: Exclude<ListFilter<T>, false>
) {
  const needle = typeof filter === "function" ? "" : foldText(trimmed)
  const scoreEntry = (entry: ListItem<T> | (T & string)) => {
    if (typeof filter === "function") {
      const result = filter(toListItem(entry), query)
      return typeof result === "number" ? Math.max(0, result) : result ? 1 : 0
    }
    if (!needle) {
      return 1
    }
    return (
      typeof entry === "string"
        ? textMatchesNeedle(entry, needle, filter)
        : itemMatchesNeedle(entry, needle, filter)
    )
      ? 1
      : 0
  }
  const ranked: Ranked<T>[] = []
  let ordered = true
  let previousScore = Infinity
  let separator: ListData<T>[number] | undefined
  const keep = (entry: ListData<T>[number], score: number) => {
    if (score > previousScore) {
      ordered = false
    }
    previousScore = score
    ranked.push({
      entry,
      score,
      separator: ranked.length ? separator : undefined,
    })
    separator = undefined
  }
  for (let index = 0; index < data.length; index++) {
    const entry = data[index]
    if (isSeparator(entry)) {
      separator = entry
      continue
    }
    if (isGroup(entry)) {
      const items: Ranked<T>[] = []
      let groupOrdered = true
      let groupPrevious = Infinity
      for (let childIndex = 0; childIndex < entry.items.length; childIndex++) {
        const child = entry.items[childIndex]
        const score = scoreEntry(child)
        if (score > 0) {
          if (score > groupPrevious) {
            groupOrdered = false
          }
          groupPrevious = score
          items.push({ entry: child, score })
        }
      }
      if (!items.length) {
        continue
      }
      if (!groupOrdered) {
        items.sort(byScore)
      }
      const entries: ListGroup<T>["items"] = []
      for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
        entries.push(items[itemIndex].entry as ListGroup<T>["items"][number])
      }
      keep({ ...entry, items: entries }, items[0].score)
      continue
    }
    const score = scoreEntry(entry)
    if (score > 0) {
      keep(entry, score)
    }
  }
  if (!ordered) {
    ranked.sort(byScore)
    const result: ListData<T> = []
    for (let index = 0; index < ranked.length; index++) {
      result.push(ranked[index].entry)
    }
    return result
  }
  const result: ListData<T> = []
  for (let index = 0; index < ranked.length; index++) {
    const item = ranked[index]
    if (item.separator) {
      result.push(item.separator)
    }
    result.push(item.entry)
  }
  return result
}

const filtering = { data: filterData, matches: itemMatches }

/** The listbox engine, filtering by `query` the way `filter` asks. */
function createFilteredListbox(
  config: Parameters<typeof createListboxEngine>[0]
) {
  return createListboxEngine(config, filtering)
}

/**
 * Reads a list's `filter` attribute on a custom element: `"false"` keeps
 * every item, one of `modes` filters that way, and any other value, like a
 * bare `filter`, the way `fallback` does.
 */
function filterAttribute<Mode extends string>(
  modes: readonly Mode[],
  fallback: NoInfer<Mode>
) {
  return (attribute: string | null) => {
    if (attribute === null) {
      return undefined
    }
    if (attribute === "false") {
      return false
    }
    return modes.includes(attribute as Mode) ? (attribute as Mode) : fallback
  }
}

export {
  createFilteredListbox,
  filterAttribute,
  filterData,
  itemMatches,
  textMatches,
}
export {
  flattenData,
  highlightable,
  highlightedValue,
  highlightFromCode,
  itemKey,
  revealInList,
  toListItem,
  type ListData,
  type ListEmptyState,
  type ListEntry,
  type ListFilter,
  type ListGroup,
  type ListHighlightDetails,
  type ListItem,
  type Listbox,
  type ListSeparator,
  type ListStatusState,
} from "./listbox-engine"
