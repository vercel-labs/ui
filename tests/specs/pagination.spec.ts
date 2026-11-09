import { expect, test } from "../fixtures"
import {
  paginationAction,
  paginationFixture as f,
} from "../fixtures/pagination"
import { current, entries, nav, part, range } from "./pagination.helpers"

// Page links in a navigation landmark. There is no APG pattern for
// pagination; it's a list of links or buttons in a named landmark, with the
// current page marked by aria-current: https://www.w3.org/TR/wai-aria-1.2/#aria-current

const status = (page: import("@playwright/test").Page) =>
  page.getByRole("status", { name: "Last action" })

test("the pagination is a named navigation landmark with a list of pages", async ({
  page,
  open,
}) => {
  await open("pagination")
  await expect(nav(page)).toBeVisible()
  await expect(nav(page).getByRole("list")).toBeVisible()
  expect(await range(page)).toBe("1 2 3 4 5 … 10")
})

test("the first page is current to start with, or the default page", async ({
  page,
  open,
}) => {
  await open("pagination")
  expect(await current(page)).toEqual(["1"])
  await open("pagination", { page: "5" })
  expect(await current(page)).toEqual(["5"])
  expect(await range(page)).toBe("1 … 4 5 6 … 10")
})

test("pressing a page goes there", async ({ page, open }) => {
  await open("pagination")
  await part(page, 5).click()
  expect(await current(page)).toEqual(["5"])
  await expect(status(page)).toHaveText(paginationAction(5, "item-press"))
  expect(await range(page)).toBe("1 … 4 5 6 … 10")
})

for (const key of ["Enter", " "]) {
  test(`${key === " " ? "Space" : key} on a focused page goes there`, async ({
    page,
    open,
  }) => {
    await open("pagination")
    await part(page, 3).focus()
    await page.keyboard.press(key)
    await expect.poll(() => current(page)).toEqual(["3"])
  })
}

test("Next and Previous step one page", async ({ page, open }) => {
  await open("pagination", { page: "5" })
  await part(page, f.next).click()
  expect(await current(page)).toEqual(["6"])
  await expect(status(page)).toHaveText(paginationAction(6, "next-press"))
  await part(page, f.previous).click()
  await part(page, f.previous).click()
  expect(await current(page)).toEqual(["4"])
  await expect(status(page)).toHaveText(paginationAction(4, "previous-press"))
})

test("First and Last go to the ends", async ({ page, open }) => {
  await open("pagination", { page: "5" })
  await part(page, f.last).click()
  expect(await current(page)).toEqual(["10"])
  await expect(status(page)).toHaveText(paginationAction(10, "last-press"))
  await part(page, f.first).click()
  expect(await current(page)).toEqual(["1"])
  await expect(status(page)).toHaveText(paginationAction(1, "first-press"))
})

test("First and Previous say they're disabled on the first page, and do nothing", async ({
  page,
  open,
}) => {
  await open("pagination")
  for (const name of [f.first, f.previous]) {
    await expect(part(page, name)).toHaveAttribute("aria-disabled", "true")
    await part(page, name).click({ force: true })
  }
  expect(await current(page)).toEqual(["1"])
  await expect(status(page)).toHaveText("")
  await expect(part(page, f.next)).not.toHaveAttribute("aria-disabled")
})

test("Next and Last say they're disabled on the last page, and do nothing", async ({
  page,
  open,
}) => {
  await open("pagination", { page: "10" })
  for (const name of [f.next, f.last]) {
    await expect(part(page, name)).toHaveAttribute("aria-disabled", "true")
    await part(page, name).click({ force: true })
  }
  expect(await current(page)).toEqual(["10"])
  expect(await range(page)).toBe("1 … 6 7 8 9 10")
})

test("a single page has nothing to step to", async ({ page, open }) => {
  await open("pagination", { count: "1" })
  expect(await range(page)).toBe("1")
  for (const name of [f.first, f.previous, f.next, f.last]) {
    await expect(part(page, name)).toHaveAttribute("aria-disabled", "true")
  }
})

test("siblings and boundaries widen the range", async ({ page, open }) => {
  await open("pagination", {
    count: "20",
    page: "10",
    siblings: "2",
    boundaries: "2",
  })
  expect(await range(page)).toBe("1 2 … 8 9 10 11 12 … 19 20")
})

test("ellipses are hidden from screen readers", async ({ page, open }) => {
  await open("pagination")
  const items = await entries(page)
  expect(items).toContain("…")
  await expect(
    nav(page).locator('[aria-hidden="true"]', { hasText: "…" })
  ).toHaveCount(1)
})

test("with getHref, pages and steps are links to their pages", async ({
  page,
  open,
}) => {
  await open("pagination", { links: "", page: "5" })
  await expect(part(page, 3, "link")).toHaveCount(0)
  await expect(part(page, 4, "link")).toHaveAttribute("href", "#page-4")
  await expect(part(page, 5, "link")).toHaveAttribute("aria-current", "page")
  await expect(part(page, f.next, "link")).toHaveAttribute("href", "#page-6")
  await expect(part(page, f.first, "link")).toHaveAttribute("href", "#page-1")
})

test("a link at an end has no href and says it's disabled", async ({
  page,
  open,
}) => {
  await open("pagination", { links: "" })
  await expect(part(page, f.previous, "link")).toHaveAttribute(
    "aria-disabled",
    "true"
  )
  await expect(part(page, f.previous, "link")).not.toHaveAttribute("href")
})

test("pressing a link goes to its page and follows it", async ({
  page,
  open,
}) => {
  await open("pagination", { links: "" })
  await part(page, 3, "link").click()
  await expect(page).toHaveURL(/#page-3$/)
  expect(await current(page)).toEqual(["3"])
  await expect(status(page)).toHaveText(paginationAction(3, "item-press"))
})

test("a change can be canceled", async ({ page, open }) => {
  await open("pagination", { cancel: "3" })
  await part(page, 3).click()
  expect(await current(page)).toEqual(["1"])
  await part(page, 2).click()
  expect(await current(page)).toEqual(["2"])
})

test("a canceled change stops a link from navigating", async ({
  page,
  open,
}) => {
  await open("pagination", { links: "", cancel: "3" })
  await part(page, 3, "link").click()
  await expect(page).not.toHaveURL(/#page-3$/)
  expect(await current(page)).toEqual(["1"])
})

test("the controller pages it from outside", async ({ page, open }) => {
  await open("pagination")
  await page.getByRole("button", { name: f.controller.label }).click()
  expect(await current(page)).toEqual([String(f.controller.page)])
  await expect(status(page)).toHaveText(
    paginationAction(f.controller.page, "imperative")
  )
})

test("a controlled pagination follows its owner", async ({
  page,
  open,
  framework,
}) => {
  test.skip(framework.startsWith("web"), "Web components own their state.")
  await open("pagination", { controlled: "" })
  await part(page, 4).click()
  expect(await current(page)).toEqual(["4"])
  await part(page, f.next).click()
  expect(await current(page)).toEqual(["5"])
})
