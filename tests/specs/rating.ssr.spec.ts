import { expect, test } from "../fixtures"

// Only *-ssr projects render on the server first.
test.beforeEach(({ framework }) => {
  test.skip(!framework.endsWith("-ssr"), "Only for server-rendered fixtures.")
})

const hydrationErrors = (page: import("@playwright/test").Page) =>
  page.evaluate(
    () =>
      (window as unknown as { __hydrationErrors: string[] }).__hydrationErrors
  )

// What the HTML the server sent shows, before hydration.
const serverRatings = (page: import("@playwright/test").Page) =>
  page.evaluate(() => {
    const template = document.createElement("template")
    template.innerHTML = (
      window as unknown as { __serverHtml: string }
    ).__serverHtml
    return [...template.content.querySelectorAll('[data-slot="rating"]')].map(
      (root) => ({
        checked:
          root
            .querySelector('[role="radio"][aria-checked="true"]')
            ?.getAttribute("aria-label") ?? null,
        fills: [
          ...root.querySelectorAll<HTMLElement>('[data-slot="rating-item"]'),
        ].map((el) => Number(el.style.getPropertyValue("--rating-fill"))),
      })
    )
  })

test("a rating hydrates without mismatches", async ({ page, open }) => {
  await open("rating")
  const four = page.getByRole("radio", { name: "4 stars", exact: true }).first()
  await four.click()
  await expect(four).toBeChecked()
  expect(await hydrationErrors(page)).toEqual([])
})

test("the server renders each score and how full each star is", async ({
  page,
  open,
}) => {
  await open("rating")
  expect(await serverRatings(page)).toEqual([
    { checked: "3 stars", fills: [1, 1, 1, 0, 0] },
    { checked: null, fills: [0, 0, 0, 0, 0] },
    { checked: null, fills: [1, 1, 1, 1, 0.2] },
  ])
})
