type SearchPage = {
  url: string
  title: string
  headings: { id: string; content: string }[]
  contents: { heading?: string; content: string }[]
}

const weights = { page: 30, heading: 20, text: 10 }

function createSearchIndex(pages: SearchPage[]) {
  return pages.map((page) =>
    [
      { type: "page" as const, content: page.title, url: page.url },
      ...page.headings.map((heading) => ({
        type: "heading" as const,
        content: heading.content,
        url: `${page.url}#${heading.id}`,
      })),
      ...page.contents.map((item) => ({
        type: "text" as const,
        content: item.content,
        url: item.heading ? `${page.url}#${item.heading}` : page.url,
      })),
    ].map((entry) => ({ ...entry, lower: entry.content.toLowerCase() })),
  )
}

type SearchEntry = ReturnType<typeof createSearchIndex>[number][number]

const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

/**
 * Every term has to appear in an entry. Pages rank by their best entry: a
 * title over a heading over text, and a match at the start of a word first.
 */
function searchIndex(index: SearchEntry[][], query: string, limit = 40) {
  const terms = [...new Set(query.toLowerCase().split(/\s+/).filter(Boolean))]
  if (terms.length === 0) return []
  const phrase = terms.join(" ")
  const wordStart = new RegExp(`(^|[^a-z0-9])${escape(terms[0])}`)
  const highlight = new RegExp(`(${terms.map(escape).join("|")})`, "gi")

  const score = (entry: SearchEntry) => {
    const bonus =
      entry.lower === phrase ? 8 : entry.lower.startsWith(terms[0]) ? 5 : wordStart.test(entry.lower) ? 2 : 0
    return weights[entry.type] + bonus
  }

  const ranked = index
    .map((entries) => {
      const hits = entries.filter((entry) => terms.every((term) => entry.lower.includes(term)))
      return { entries, hits, best: Math.max(0, ...hits.map(score)) }
    })
    .filter((page) => page.hits.length > 0)
    .sort((a, b) => b.best - a.best)

  const results: { id: string; type: SearchEntry["type"]; content: string; url: string }[] = []
  for (const { entries, hits } of ranked) {
    const shown = [entries[0], ...hits.filter((hit) => hit.type !== "page").slice(0, 7)]
    for (const [position, entry] of shown.entries()) {
      if (results.length >= limit) return results
      results.push({
        id: `${entries[0].url}:${position}`,
        type: entry.type,
        content: entry.content.replace(highlight, "<mark>$1</mark>"),
        url: entry.url,
      })
    }
  }
  return results
}

export { createSearchIndex, type SearchPage, searchIndex }
