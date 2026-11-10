import AxeBuilder from "@axe-core/playwright"
import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"
import { row } from "./waterfall.helpers"

async function audit(page: Page) {
  // Page structure rules are about the fixture page, not the component.
  const results = await new AxeBuilder({ page })
    .disableRules(["region", "landmark-one-main", "page-has-heading-one"])
    .analyze()
  return results.violations.map(
    (violation) => `${violation.id}: ${violation.help}`
  )
}

test("no axe violations with every span collapsed", async ({ page, open }) => {
  await open("waterfall")
  await expect(row(page, "GET /")).toBeVisible()
  expect(await audit(page)).toEqual([])
})

test("no axe violations with nested spans expanded, a span selected and a cell focused", async ({
  page,
  open,
}) => {
  await open("waterfall", { expanded: "document,script", default: "user" })
  await row(page, "GET /api/user").focus()
  await page.keyboard.press("ArrowRight")
  expect(await audit(page)).toEqual([])
})

test("the accessibility tree", async ({ page, open }) => {
  await open("waterfall", { expanded: "document", default: "styles" })
  await expect(page.getByRole("treegrid")).toMatchAriaSnapshot(`
    - treegrid "Requests":
      - row "Name Status Timeline":
        - columnheader "Name"
        - columnheader "Status"
        - columnheader "Timeline": DOMContentLoaded
      - row "GET / 200 Starts at 0 ms, lasts 1 sec" [expanded] [level=1]:
        - rowheader "GET /"
        - gridcell "200"
        - gridcell "Starts at 0 ms, lasts 1 sec"
      - row "GET /app.css 200 Starts at 120 ms, lasts 340 ms" [level=2] [selected]:
        - rowheader "GET /app.css"
        - gridcell "200"
        - gridcell "Starts at 120 ms, lasts 340 ms"
      - row "GET /app.js 200 Starts at 120 ms, lasts 480 ms" [expanded=false] [level=2]:
        - rowheader "GET /app.js"
        - gridcell "200"
        - gridcell "Starts at 120 ms, lasts 480 ms"
      - row "GET /font.woff2 200 Starts at 1 sec, lasts 1 sec" [level=1]:
        - rowheader "GET /font.woff2"
        - gridcell "200"
        - gridcell "Starts at 1 sec, lasts 1 sec"
  `)
})
