// The browser build's `web.js`: one script that defines each component the
// first time its tags appear on the page, from the files beside it. A page
// downloads only the components it uses.

/**
 * The entry that defines `tag`: the longest entry named like it, as
 * `tabs` for <ui-tabs-tab> or `overlays` for <ui-overlay-host>.
 */
function entryOf(tag: string, entries: readonly string[]) {
  let match: string | undefined
  for (const entry of entries) {
    const named = [entry, entry.replace(/s$/, "")].some(
      (stem) => tag === `ui-${stem}` || tag.startsWith(`ui-${stem}-`),
    )
    if (named && entry.length > (match?.length ?? 0)) match = entry
  }
  return match
}

/**
 * Imports the entry of every undefined `ui-` element in `root` from `base`,
 * like `web/tabs.js`, then of every one added later.
 */
function autoload(base: URL, entries: readonly string[], root: Document = document) {
  const requested = new Set<string>()

  const load = (node: Node) => {
    if (!(node instanceof Element)) return
    for (const element of [node, ...node.querySelectorAll(":not(:defined)")]) {
      const tag = element.localName
      if (!tag.startsWith("ui-") || customElements.get(tag)) continue
      const entry = entryOf(tag, entries)
      if (!entry || requested.has(entry)) continue
      requested.add(entry)
      void import(/* @vite-ignore */ new URL(`${entry}.js`, base).href)
    }
  }

  load(root.documentElement)
  const observer = new MutationObserver((records) => {
    for (const record of records) for (const node of record.addedNodes) load(node)
  })
  observer.observe(root.documentElement, { childList: true, subtree: true })
  return () => observer.disconnect()
}

export { autoload, entryOf }
