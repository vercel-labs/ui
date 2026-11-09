import { pageMarkdown } from "./page-markdown"
import { type DocPage, docPages } from "./pages"
import { sharedSections } from "./sections"

// A shared section as one Markdown file, for agents: every page in the
// sidebar's order, with generated tables written out. None names a framework;
// each framework's own pages are separate files.

// A folder's pages with each listed subfolder's pages in its place, like
// the demos Built with @ui-sdk/core shows by framework.
function withFolders(folder: string): DocPage[] {
  const depth = folder.split("/").length
  return docPages(folder).flatMap((page) =>
    page.slugs.length > depth && page.file.endsWith("/index.mdx")
      ? withFolders(page.slugs.join("/"))
      : [page]
  )
}

/**
 * Every page of `section` as one Markdown file. Links go to the site's pages
 * unless `link` maps them elsewhere.
 */
async function sectionMarkdown(
  section: keyof typeof sharedSections,
  link: (slugs: string[], hash?: string) => string | null = (slugs, hash) =>
    `/docs/${slugs.join("/")}${hash ? `#${hash}` : ""}`,
  intro = `<!-- ui-sdk ${sharedSections[section]} docs, as one file. Pages: /docs/${section}. -->`
) {
  const all = [section].flatMap(withFolders)
  const pages = await Promise.all(
    all.map((page) =>
      pageMarkdown(page.file, undefined, ({ slugs, hash }) => link(slugs, hash))
    )
  )
  return [intro, ...pages].join("\n\n")
}

export { sectionMarkdown }
