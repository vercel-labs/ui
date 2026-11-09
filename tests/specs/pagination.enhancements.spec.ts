import { expect, test } from "../fixtures"
import { paginationFixture as f } from "../fixtures/pagination"
import { current, entries, nav, part } from "./pagination.helpers"

// Behavior past markup styled as a pagination, tagged `@enhancement`.

test("pressing Next onto the last page keeps focus on Next @enhancement", async ({
  page,
  open,
}) => {
  await open("pagination", { page: "9" })
  await part(page, f.next).focus()
  await page.keyboard.press("Enter")
  await expect.poll(() => current(page)).toEqual(["10"])
  await expect(part(page, f.next)).toHaveAttribute("aria-disabled", "true")
  await expect(part(page, f.next)).toBeFocused()
})

test("pressing Previous onto the first page keeps focus on Previous @enhancement", async ({
  page,
  open,
}) => {
  await open("pagination", { page: "2" })
  await part(page, f.previous).focus()
  await page.keyboard.press("Enter")
  await expect.poll(() => current(page)).toEqual(["1"])
  await expect(part(page, f.previous)).toBeFocused()
})

test("paging through every page with the keyboard never loses focus @enhancement", async ({
  page,
  open,
}) => {
  await open("pagination")
  await part(page, f.next).focus()
  for (let target = 2; target <= f.pageCount; target++) {
    await page.keyboard.press("Enter")
    await expect.poll(() => current(page)).toEqual([String(target)])
    await expect(part(page, f.next)).toBeFocused()
  }
})

test("pressing a page keeps focus on it while the range moves around it @enhancement", async ({
  page,
  open,
}) => {
  await open("pagination", { page: "5" })
  for (const target of [6, 7, 6, 5]) {
    await part(page, target).focus()
    await page.keyboard.press("Enter")
    await expect.poll(() => current(page)).toEqual([String(target)])
    await expect(part(page, target)).toBeFocused()
  }
})

test("focus comes back to the same part when the list renders again from scratch @enhancement", async ({
  page,
  open,
  framework,
}) => {
  test.skip(
    framework.startsWith("web"),
    "Web component lists keep their elements."
  )
  await open("pagination", { rekey: "", page: "5" })
  await part(page, 6).focus()
  await page.keyboard.press("Enter")
  await expect.poll(() => current(page)).toEqual(["6"])
  await expect(part(page, 6)).toBeFocused()
  await part(page, f.next).focus()
  await page.keyboard.press("Enter")
  await expect.poll(() => current(page)).toEqual(["7"])
  await expect(part(page, f.next)).toBeFocused()
})

test("the list has the same number of entries on every page, so nothing shifts under the pointer @enhancement", async ({
  page,
  open,
}) => {
  await open("pagination", { count: "20" })
  const counts = new Set<number>()
  for (let target = 1; target <= 20; target++) {
    counts.add((await entries(page)).length)
    await part(page, f.next).click({ force: true })
  }
  expect([...counts]).toEqual([11])
})

test("a gap of one page shows that page instead of an ellipsis @enhancement", async ({
  page,
  open,
}) => {
  await open("pagination", { page: "4" })
  expect((await entries(page)).slice(2, -2)).toEqual([
    "1",
    "2",
    "3",
    "4",
    "5",
    "…",
    "10",
  ])
})

test("a link pressed with a modifier opens elsewhere and leaves the page as it is @enhancement", async ({
  page,
  open,
  browserName,
}) => {
  test.skip(
    browserName === "webkit",
    "WebKit automation doesn't open a tab for a modified click."
  )
  await open("pagination", { links: "" })
  const popup = page.context().waitForEvent("page")
  await part(page, 3, "link").click({ modifiers: ["ControlOrMeta"] })
  await (await popup).close()
  expect(await current(page)).toEqual(["1"])
  await expect(page.getByRole("status", { name: "Last action" })).toHaveText("")
})

test("the list keeps its list role when styled without bullets @enhancement", async ({
  page,
  open,
}) => {
  await open("pagination")
  await expect(nav(page).getByRole("list")).toHaveAttribute("role", "list")
  await expect(nav(page).getByRole("list")).toHaveCSS("list-style-type", "none")
})

test("steps at the ends stay in the tab order and say they're disabled @enhancement", async ({
  page,
  open,
  tab,
}) => {
  await open("pagination")
  await page.getByRole("button", { name: "Before" }).focus()
  await tab()
  await expect(part(page, f.first)).toBeFocused()
  await expect(part(page, f.first)).toHaveAttribute("aria-disabled", "true")
})

test("a Next link goes to the next page, not past it, even after the page renders again @enhancement", async ({
  page,
  open,
}) => {
  await open("pagination", { links: "" })
  await part(page, f.next, "link").click()
  await expect(page).toHaveURL(/#page-2$/)
  await part(page, f.next, "link").click()
  await expect(page).toHaveURL(/#page-3$/)
})

test("a Next link onto the last page still goes there, though it ends there @enhancement", async ({
  page,
  open,
}) => {
  await open("pagination", { links: "", page: "9" })
  await part(page, f.next, "link").click()
  await expect(page).toHaveURL(/#page-10$/)
  await expect(part(page, f.next, "link")).toHaveAttribute(
    "aria-disabled",
    "true"
  )
})
