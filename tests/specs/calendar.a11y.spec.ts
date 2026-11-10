import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "../fixtures"
import { calendarFixture as f } from "../fixtures/calendar"
import { day } from "./calendar.helpers"

async function audit(page: import("@playwright/test").Page) {
  // Page structure rules are about the fixture page, not the components.
  const results = await new AxeBuilder({ page })
    .disableRules(["region", "landmark-one-main", "page-has-heading-one"])
    .analyze()
  return results.violations.map(
    (violation) => `${violation.id}: ${violation.help}`
  )
}

for (const [name, options] of [
  ["with nothing selected", {}],
  ["with a date selected", { value: "2026-10-20" }],
  [
    "with several dates selected",
    { mode: "multiple", value: "2026-10-02,2026-10-20" },
  ],
  ["with a range selected", { mode: "range", value: "2026-10-12,2026-10-16" }],
  ["with two months", { months: "2" }],
  ["with unavailable dates", { unavailable: "weekends" }],
  ["with min and max", { min: "2026-10-05", max: "2026-10-25" }],
  ["disabled", { disabled: "" }],
  ["read only", { readonly: "" }],
] as const) {
  test(`no axe violations ${name}`, async ({ page, open }) => {
    await open("calendar", options)
    expect(await audit(page)).toEqual([])
  })
}

test("no axe violations while a range is being picked", async ({
  page,
  open,
}) => {
  await open("calendar", { mode: "range" })
  await day(page, "2026-10-12").click()
  await day(page, "2026-10-15").hover()
  expect(await audit(page)).toEqual([])
})

test("days are named by their full date, and the steps by their labels", async ({
  page,
  open,
}) => {
  await open("calendar")
  await expect(day(page, f.today)).toBeVisible()
  await expect(page.getByRole("button", { name: f.previous })).toBeVisible()
  await expect(page.getByRole("button", { name: f.next })).toBeVisible()
})

// Every implementation must expose the same accessibility tree.
test("accessibility tree", async ({ page, open }) => {
  await open("calendar", { month: "2026-02", value: "2026-02-10" })
  await expect(page.locator('[data-slot="calendar"]')).toMatchAriaSnapshot(`
    - button "Previous month"
    - heading "February 2026" [level=2]
    - button "Next month"
    - grid "February 2026":
      - rowgroup:
        - row "Sunday Monday Tuesday Wednesday Thursday Friday Saturday":
          - columnheader "Sunday"
          - columnheader "Monday"
          - columnheader "Tuesday"
          - columnheader "Wednesday"
          - columnheader "Thursday"
          - columnheader "Friday"
          - columnheader "Saturday"
      - rowgroup:
        - row "Sunday, February 1, 2026 Monday, February 2, 2026 Tuesday, February 3, 2026 Wednesday, February 4, 2026 Thursday, February 5, 2026 Friday, February 6, 2026 Saturday, February 7, 2026":
          - gridcell "Sunday, February 1, 2026"
          - gridcell "Monday, February 2, 2026"
          - gridcell "Tuesday, February 3, 2026"
          - gridcell "Wednesday, February 4, 2026"
          - gridcell "Thursday, February 5, 2026"
          - gridcell "Friday, February 6, 2026"
          - gridcell "Saturday, February 7, 2026"
        - row /Sunday, February 8, 2026/:
          - gridcell "Sunday, February 8, 2026"
          - gridcell "Monday, February 9, 2026"
          - gridcell "Tuesday, February 10, 2026" [selected]
          - gridcell "Wednesday, February 11, 2026"
          - gridcell "Thursday, February 12, 2026"
          - gridcell "Friday, February 13, 2026"
          - gridcell "Saturday, February 14, 2026"
        - row /Sunday, February 15, 2026/
        - row /Sunday, February 22, 2026/
  `)
})
