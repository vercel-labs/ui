import { expect, test } from "../fixtures"
import { eventNamed } from "./chronology.helpers"

// Only *-ssr projects render on the server first.
test.beforeEach(({ framework }) => {
  test.skip(!framework.endsWith("-ssr"), "Only for server-rendered fixtures.")
})

const hydrationErrors = (page: import("@playwright/test").Page) =>
  page.evaluate(
    () =>
      (window as unknown as { __hydrationErrors: string[] }).__hydrationErrors
  )

test("the chronology hydrates without mismatches and works", async ({
  page,
  open,
}) => {
  await open("chronology")
  await page.waitForLoadState("networkidle")
  await eventNamed(page, "Order placed").focus()
  await page.keyboard.press("ArrowDown")
  await expect(eventNamed(page, "Packed")).toBeFocused()
  expect(await hydrationErrors(page)).toEqual([])
})

test("the server renders a list with exactly one tab stop and the current step", async ({
  page,
  open,
}) => {
  await open("chronology")
  const server = await page.evaluate(() => {
    const markup = (window as unknown as { __serverMarkup: string })
      .__serverMarkup
    const doc = new DOMParser().parseFromString(markup, "text/html")
    return {
      list: doc.querySelectorAll('[role="list"]').length,
      items: doc.querySelectorAll('[role="listitem"]').length,
      stops: doc.querySelectorAll('[role="listitem"][tabindex="0"]').length,
      current: doc
        .querySelector('[aria-current="step"]')
        ?.querySelector('[data-slot="chronology-title"]')
        ?.textContent?.trim(),
    }
  })
  expect(server).toEqual({ list: 1, items: 4, stops: 1, current: "Shipped" })
})
