import { coversTab, expect, panelNamed, tabNamed, test } from "../fixtures"

// Only *-ssr projects render on the server first.
test.beforeEach(({ framework }) => {
  test.skip(!framework.endsWith("-ssr"), "Only for server-rendered fixtures.")
})

const hydrationErrors = (page: import("@playwright/test").Page) =>
  page.evaluate(() => (window as unknown as { __hydrationErrors: string[] }).__hydrationErrors)

// What the HTML the server sent selects and shows, before hydration.
const serverSelection = (page: import("@playwright/test").Page) =>
  page.evaluate(() => {
    const template = document.createElement("template")
    template.innerHTML = (window as unknown as { __serverHtml: string }).__serverHtml
    const panels = [...template.content.querySelectorAll('[role="tabpanel"]')]
    return {
      selected: template.content.querySelector('[role="tab"][aria-selected="true"]')?.textContent ?? null,
      panels: panels
        .filter((panel) => !panel.hasAttribute("hidden"))
        .map((panel) => panel.textContent?.trim()),
    }
  })

test("tabs hydrate without mismatches", async ({ page, open }) => {
  await open("tabs")
  await expect(panelNamed(page, "Account")).toBeVisible()
  await tabNamed(page, "Password").click()
  await expect(panelNamed(page, "Password")).toBeVisible()
  expect(await hydrationErrors(page)).toEqual([])
})

test("without a default value, the server renders the first enabled tab selected", async ({ page, open }) => {
  await open("tabs", { default: "none" })
  expect(await serverSelection(page)).toEqual({
    selected: "Account",
    panels: ["Manage your account details."],
  })
  await expect(tabNamed(page, "Account")).toHaveAttribute("aria-selected", "true")
  await expect(panelNamed(page, "Account")).toBeVisible()
  expect(await hydrationErrors(page)).toEqual([])
})

test("the indicator is in place after hydration", async ({ page, open }) => {
  await open("tabs")
  await expect.poll(() => coversTab(page, "Account")).toBe(true)
  expect(await hydrationErrors(page)).toEqual([])
})

test("tabs with kept panels hydrate without mismatches", async ({ page, open }) => {
  await open("tabs", { "keep-mounted": "" })
  await expect(panelNamed(page, "Account")).toBeVisible()
  await tabNamed(page, "Notifications").click()
  await expect(panelNamed(page, "Notifications")).toBeVisible()
  expect(await hydrationErrors(page)).toEqual([])
})
