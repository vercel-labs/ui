import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"
import { fileInputFixture as f } from "../fixtures/file-input"
import {
  browse,
  drop,
  item,
  lastAction,
  list,
  pdf,
  png,
  submitted,
  txt,
  zone,
} from "./file-input.helpers"

// The attachments list: an item per file, removal by pointer and keyboard,
// and a controlled value.

const announcer = (page: Page) =>
  page.locator('[aria-live="polite"]:not(output)')
const remove = (page: Page, name: string) =>
  page.getByRole("button", { name: `Remove ${name}`, exact: true })
const names = (page: Page) => list(page).getByRole("listitem").allTextContents()

test.beforeEach(async ({ open }) => {
  await open("file-input")
})

test("each file shows as an item in the list, in order", async ({ page }) => {
  await drop(zone(page), [png, txt, pdf])
  await expect(list(page).getByRole("listitem")).toHaveCount(2)
  expect(
    (await names(page)).map((text) => text.replace("×", "").trim())
  ).toEqual(["a.png", "b.pdf"])
})

test("a remove button is named after its file, and removes it", async ({
  page,
}) => {
  await drop(zone(page), [png, pdf])
  await remove(page, "a.png").click()
  await expect(item(page, "a.png")).toHaveCount(0)
  await expect(lastAction(page)).toHaveText("attachments:remove-press:-a.png|")
  await page.getByRole("button", { name: "Send" }).click()
  await expect(submitted(page)).toHaveText("attachments=b.pdf&note=")
})

test("the list is one tab stop, and arrow keys, Home and End move between items", async ({
  page,
  tab,
}) => {
  await drop(zone(page), [png, pdf, { ...png, name: "c.png" }])
  await browse(page).focus()
  await tab()
  await expect(item(page, "a.png")).toBeFocused()
  await page.keyboard.press("ArrowRight")
  await expect(item(page, "b.pdf")).toBeFocused()
  await page.keyboard.press("ArrowDown")
  await expect(item(page, "c.png")).toBeFocused()
  await page.keyboard.press("Home")
  await expect(item(page, "a.png")).toBeFocused()
  await page.keyboard.press("End")
  await expect(item(page, "c.png")).toBeFocused()
  await page.keyboard.press("ArrowLeft")
  await expect(item(page, "b.pdf")).toBeFocused()
  // Tab leaves the list, and comes back to the item focused last.
  await tab()
  await expect(item(page, "b.pdf")).not.toBeFocused()
  await page.keyboard.press("Shift+Tab")
  await expect(item(page, "b.pdf")).toBeFocused()
})

test("Backspace on a focused item removes it and focuses the next one", async ({
  page,
}) => {
  await drop(zone(page), [png, pdf])
  await item(page, "a.png").focus()
  await page.keyboard.press("Backspace")
  await expect(item(page, "a.png")).toHaveCount(0)
  await expect(lastAction(page)).toHaveText("attachments:remove-press:-a.png|")
  await expect(item(page, "b.pdf")).toBeFocused()
  // Delete works too, and the last one sends focus back to the trigger.
  await page.keyboard.press("Delete")
  await expect(list(page).getByRole("listitem")).toHaveCount(0)
  await expect(browse(page)).toBeFocused()
})

test(
  "a removal is announced politely",
  { tag: "@enhancement" },
  async ({ page }) => {
    await drop(zone(page), [png])
    await expect(announcer(page)).toHaveText("1 file accepted.")
    await remove(page, "a.png").click()
    await expect(announcer(page)).toHaveText("a.png removed.")
  }
)

test("a canceled change leaves the list as it was", async ({ page, open }) => {
  await open("file-input", { cancel: "" })
  await drop(zone(page), [png])
  await expect(lastAction(page)).toHaveText("attachments:drop:a.png|")
  await expect(list(page).getByRole("listitem")).toHaveCount(0)
})

test("a form reset empties the list", async ({ page }) => {
  await drop(zone(page), [png])
  await expect(item(page, "a.png")).toHaveCount(1)
  await page.getByRole("button", { name: "Reset" }).click()
  await expect(list(page).getByRole("listitem")).toHaveCount(0)
})

test("a controlled file input shows the value it's given", async ({
  page,
  open,
  framework,
}) => {
  test.skip(
    framework.startsWith("web"),
    "Web components set the value property instead."
  )
  await open("file-input", { controlled: "" })
  await drop(zone(page), [png, pdf])
  await expect(list(page).getByRole("listitem")).toHaveCount(2)
  await remove(page, "b.pdf").click()
  await expect(item(page, "b.pdf")).toHaveCount(0)
  await page.getByRole("button", { name: "Send" }).click()
  await expect(submitted(page)).toHaveText("attachments=a.png&note=")
})

test("a removal a controlled owner ignores keeps the item and its focus", async ({
  page,
  open,
  framework,
}) => {
  test.skip(
    framework.startsWith("web"),
    "Web components set the value property instead."
  )
  await open("file-input", { controlled: "", "ignore-removals": "" })
  await drop(zone(page), [png, pdf])
  await item(page, "a.png").focus()
  await page.keyboard.press("Delete")
  await expect(item(page, "a.png")).toHaveCount(1)
  await expect(item(page, "a.png")).toBeFocused()
})

test("the value property sets the files quietly on web components, and the api reports", async ({
  page,
  framework,
}) => {
  test.skip(
    !framework.startsWith("web"),
    "Only web components have the value property."
  )
  const input = page.locator("ui-file-input").first()
  const before = await lastAction(page).textContent()
  await input.evaluate((el: HTMLElement & { value: File[] }) => {
    el.value = [new File(["x"], "set.png", { type: "image/png" })]
  })
  await expect(item(page, "set.png")).toHaveCount(1)
  await expect(lastAction(page)).toHaveText(before ?? "")
  await input.evaluate(
    (el: HTMLElement & { api: { setValue: (files: File[]) => void } }) =>
      el.api.setValue([new File(["y"], "api.png", { type: "image/png" })])
  )
  await expect(lastAction(page)).toHaveText(
    "attachments:imperative:api.png,-set.png|"
  )
})

test("the remove buttons are out of the tab order", async ({ page }) => {
  await drop(zone(page), [png])
  await expect(remove(page, "a.png")).toHaveAttribute("tabindex", "-1")
  await expect(list(page)).toHaveAccessibleName(f.list.label)
})
