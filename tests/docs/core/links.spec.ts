import { readdirSync } from "node:fs"
import path from "node:path"
import { expect } from "@playwright/test"
import { test } from "../docs-test"

// Every Behaviors page, by its path under /docs, from the content folder.
const content = path.resolve(import.meta.dirname, "../../../apps/docs/content/docs")
const pages = readdirSync(path.join(content, "behaviors"), { recursive: true, encoding: "utf8" })
  .filter((file) => file.endsWith(".mdx"))
  .map((file) => `/docs/behaviors/${file.replace(/(\/?index)?\.mdx$/, "")}`.replace(/\/$/, ""))

test("every link to a heading on a Behaviors page lands on one", async ({ page }) => {
  // Every page compiles on its first visit in dev, so this takes a while.
  test.setTimeout(900_000)
  const headings = new Map<string, Set<string>>()
  const idsOf = async (url: string) => {
    if (!headings.has(url)) {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 120_000 })
      headings.set(
        url,
        new Set(await page.locator("article [id]").evaluateAll((els) => els.map((el) => el.id))),
      )
    }
    return headings.get(url)!
  }
  const broken: string[] = []
  for (const from of pages) {
    await page.goto(from, { waitUntil: "domcontentloaded", timeout: 120_000 })
    const hrefs = await page
      .locator("article a[href*='#']:not([data-example] a)")
      .evaluateAll((links) => links.map((link) => new URL((link as HTMLAnchorElement).href)))
      .then((urls) =>
        urls.map((url) => ({ path: url.pathname, hash: decodeURIComponent(url.hash.slice(1)) })),
      )
    for (const { path: to, hash } of hrefs) {
      if (!to.startsWith("/docs/behaviors")) continue
      if (!(await idsOf(to)).has(hash)) broken.push(`${from} → ${to}#${hash}`)
    }
  }
  expect(broken).toEqual([])
})
