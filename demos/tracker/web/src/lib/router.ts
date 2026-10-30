import { parseQuery } from "tracker-data"

const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function changed() {
  for (const listener of listeners) listener()
}

function navigate(url: string) {
  history.pushState(null, "", url)
  changed()
}

function query() {
  return parseQuery(Object.fromEntries(new URLSearchParams(location.search)))
}

function route() {
  return location.pathname === "/settings" ? "settings" : "issues"
}

document.addEventListener("click", (event) => {
  const link = (event.target as Element).closest("a[href]")
  if (!(link instanceof HTMLAnchorElement) || link.target || link.origin !== location.origin) return
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  )
    return
  event.preventDefault()
  if (link.href !== location.href) navigate(link.href)
})

addEventListener("popstate", changed)

export { navigate, query, route, subscribe }
