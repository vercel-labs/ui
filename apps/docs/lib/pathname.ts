import { usePathname } from "next/navigation"

/**
 * The path the reader asked for, like `/docs/core`. Core's and Agents' pages
 * are built under `/for/<framework>` and served from there by a rewrite, so the
 * server renders that path and the browser shows the asked one. Without the
 * prefix the two match, and hydration does too.
 */
function useDocsPathname() {
  return usePathname().replace(/^\/for\/[^/]+(?=\/)/, "")
}

export { useDocsPathname }
