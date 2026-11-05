import { expect, test } from "../fixtures"

// Only *-ssr projects render on the server first.
test.beforeEach(({ framework }) => {
  test.skip(!framework.endsWith("-ssr"), "Only for server-rendered fixtures.")
})

const hydrationErrors = (page: import("@playwright/test").Page) =>
  page.evaluate(() => (window as unknown as { __hydrationErrors: string[] }).__hydrationErrors)

// What the HTML the server sent checks, before hydration.
const serverControl = (page: import("@playwright/test").Page) =>
  page.evaluate(() => {
    const template = document.createElement("template")
    template.innerHTML = (window as unknown as { __serverHtml: string }).__serverHtml
    const root = template.content.querySelector('[role="radiogroup"]')
    return {
      orientation: root?.getAttribute("aria-orientation"),
      checked: [...template.content.querySelectorAll('[role="radio"][aria-checked="true"]')].map((el) =>
        el.textContent?.trim(),
      ),
    }
  })

test("a segmented control hydrates without mismatches", async ({ page, open }) => {
  await open("segmented-control")
  const grid = page.getByRole("radio", { name: "Grid", exact: true })
  await grid.click()
  await expect(grid).toBeChecked()
  expect(await hydrationErrors(page)).toEqual([])
})

test("the server renders the default item checked", async ({ page, open }) => {
  await open("segmented-control", { orientation: "vertical" })
  expect(await serverControl(page)).toEqual({ orientation: "vertical", checked: ["List"] })
})
