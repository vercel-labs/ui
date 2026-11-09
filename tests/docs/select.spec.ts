import { expect, type Locator, type Page } from "@playwright/test"
import { test } from "./docs-test"
import { readdirSync } from "node:fs"
import path from "node:path"

const frameworks = ["react", "vue", "web-components", "svelte", "solid"]
// Every framework folder must have the same examples.
const root = path.join(import.meta.dirname, "../../examples/components/select")
const folders = ["react", "vue", "web", "svelte", "solid"]
const examplesIn = (folder: string) =>
  readdirSync(path.join(root, folder), { withFileTypes: true })
    .filter((file) => file.isFile())
    .map((file) => file.name.replace(/\.\w+$/, ""))

// The examples in the order they appear on the Select page.
const order = [
  "demo",
  "data",
  "groups",
  "icons",
  "typeahead",
  "disabled",
  "clearable",
  "multiple",
  "select-all",
  "search-groups",
  "async-search",
  "object-values",
  "virtualized",
  "align-item",
  "scrollable",
  "invalid",
  "form",
  "presentation",
]

// Every example on disk: the page's, plus the ones kept off it.
const fixtureNames = [
  ...order,
  "animation",
  "container",
  "controlled",
  "controller",
  "custom-rendering",
  "loop",
  "modal",
  "options",
  "placeholder",
  "positioning",
  "rtl",
  "searchable",
]

// The last line an example logged to its console.
function lastLog(preview: Locator) {
  return preview
    .locator("xpath=ancestor::figure[1]")
    .locator('section[aria-label="Console"] li:not([aria-hidden])')
    .last()
}

const example = (page: Page, name: string) =>
  page.locator(`[data-example="select/${name}"]`)

async function open(page: Page, name: string) {
  const preview = example(page, name)
  await preview.scrollIntoViewIfNeeded()
  await preview.getByRole("combobox").first().click()
  await expect(page.getByRole("listbox")).toBeVisible()
  return preview
}

for (const framework of frameworks) {
  test(`every select example works in ${framework}`, async ({ page }) => {
    test.setTimeout(120_000)
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    page.on(
      "console",
      (message) => message.type() === "error" && errors.push(message.text())
    )
    await page.goto(`/docs/${framework}/components/select`)
    const previews = page.locator("[data-example]")
    await expect(previews).toHaveCount(order.length)
    expect(
      await previews.evaluateAll((els) =>
        els.map((el) => el.getAttribute("data-example"))
      )
    ).toEqual(order.map((name) => `select/${name}`))

    for (const name of order) {
      // The last trigger that can open: Disabled shows a disabled and a read-only one first.
      // A closed web select keeps its search field, hidden, in the page.
      const trigger = example(page, name)
        .locator(
          '[role="combobox"]:not([disabled]):not([aria-disabled="true"]):not([aria-readonly="true"])'
        )
        .filter({ visible: true })
        .last()
      await trigger.scrollIntoViewIfNeeded()
      await trigger.click()
      const list = page.getByRole("listbox").first()
      await expect(list, `${name} list`).toBeVisible()
      await expect(
        list.getByRole("option").first(),
        `${name} items`
      ).toBeVisible()
      await page.keyboard.press("Escape")
      await expect(page.getByRole("listbox"), `${name} closes`).toHaveCount(0)
    }

    expect(errors).toEqual([])
    for (const folder of folders) {
      expect(examplesIn(folder).sort(), folder).toEqual(
        [...fixtureNames].sort()
      )
    }
  })

  test(`choosing an item shows its label in ${framework}`, async ({ page }) => {
    await page.goto(`/docs/${framework}/components/select`)
    const preview = await open(page, "demo")
    await page
      .getByRole("listbox")
      .getByRole("option", { name: "Editor" })
      .click()
    await expect(page.getByRole("listbox")).toHaveCount(0)
    await expect(preview.getByRole("combobox")).toContainText("Editor")
  })

  test(`groups are named by their labels in ${framework}`, async ({ page }) => {
    await page.goto(`/docs/${framework}/components/select`)
    await open(page, "groups")
    await expect(
      page.getByRole("listbox").getByRole("group", { name: "Sans serif" })
    ).toBeVisible()
  })

  test(`disabled items are skipped in ${framework}`, async ({ page }) => {
    await page.goto(`/docs/${framework}/components/select`)
    const preview = example(page, "disabled")
    await expect(preview.getByRole("combobox").nth(0)).toBeDisabled()
    await expect(preview.getByRole("combobox").nth(1)).toHaveAttribute(
      "aria-readonly",
      "true"
    )
    await preview.getByRole("combobox").nth(2).click()
    await page.keyboard.press("Home")
    await expect(page.getByRole("option", { name: "Canada" })).toHaveAttribute(
      "data-highlighted",
      ""
    )
    await page.keyboard.press("ArrowDown")
    await expect(page.getByRole("option", { name: "France" })).toHaveAttribute(
      "data-highlighted",
      ""
    )
  })

  test(`clearing logs null in ${framework}`, async ({ page }) => {
    await page.goto(`/docs/${framework}/components/select`)
    const preview = example(page, "clearable")
    await preview.getByRole("button", { name: "Clear assignee" }).click()
    await expect(preview.getByRole("combobox")).toContainText("Unassigned")
    await expect(preview.getByRole("combobox")).toBeFocused()
    await expect(lastLog(preview)).toHaveText("value: null (clear-press)")
  })

  test(`multiple values log their array in ${framework}`, async ({ page }) => {
    await page.goto(`/docs/${framework}/components/select`)
    const preview = await open(page, "multiple")
    await page.getByRole("option", { name: "French" }).click()
    await expect(page.getByRole("listbox")).toBeVisible()
    await expect(preview.getByRole("combobox")).toContainText(
      "English and 2 more"
    )
    await expect(lastLog(preview)).toHaveText('value: ["en","ja","fr"]')
  })

  test(`select all keeps the trigger and list in place in ${framework}`, async ({
    page,
  }) => {
    await page.goto(`/docs/${framework}/components/select`)
    const preview = await open(page, "select-all")
    const trigger = preview.getByRole("combobox")
    const list = page.getByRole("listbox")
    const before = [await trigger.boundingBox(), await list.boundingBox()]
    await list.getByRole("option", { name: "Select all" }).click()
    await expect(trigger).toContainText("3 more")
    expect([await trigger.boundingBox(), await list.boundingBox()]).toEqual(
      before
    )
    await list.getByRole("option", { name: "Select all" }).click()
    await expect(trigger).toContainText("Select regions")
    expect([await trigger.boundingBox(), await list.boundingBox()]).toEqual(
      before
    )
  })

  test(`object values log the submitted id in ${framework}`, async ({
    page,
  }) => {
    await page.goto(`/docs/${framework}/components/select`)
    const preview = await open(page, "object-values")
    await expect(
      page.getByRole("option", { name: /Inès Moreau/ })
    ).toHaveAttribute("aria-selected", "true")
    await page.getByRole("option", { name: /Kofi Mensah/ }).click()
    await expect(lastLog(preview)).toHaveText("Submits assignee=3")
  })

  test(`the selected item lands on the trigger in ${framework}`, async ({
    page,
  }) => {
    await page.goto(`/docs/${framework}/components/select`)
    const preview = await open(page, "align-item")
    const text = (selector: string) =>
      page.locator(selector).evaluate((el) => {
        const range = document.createRange()
        range.selectNodeContents(el.firstChild ?? el)
        const box = range.getBoundingClientRect()
        return [Math.round(box.x), Math.round(box.y)]
      })
    expect(
      await text(
        '[data-slot="select-content"][data-open] [data-slot="select-item"][data-selected]'
      )
    ).toEqual(
      await text(
        '[data-example="select/align-item"] [data-slot="select-value"]'
      )
    )
    await page.keyboard.press("Escape")
    await preview.getByRole("checkbox").click()
    await preview.getByRole("combobox").click()
    const trigger = await preview.getByRole("combobox").boundingBox()
    const list = await page.getByRole("listbox").boundingBox()
    expect(list!.y).toBeGreaterThan(trigger!.y + trigger!.height)
  })

  test(`an invalid submission shows the error in ${framework}`, async ({
    page,
  }) => {
    await page.goto(`/docs/${framework}/components/select`)
    const preview = example(page, "invalid")
    await preview.getByRole("button", { name: "Continue" }).click()
    await expect(preview.getByText("Choose a shipping method.")).toBeVisible()
    await expect(preview.getByRole("combobox")).toHaveAttribute(
      "aria-invalid",
      "true"
    )
    await preview.getByRole("combobox").click()
    await page.getByRole("option", { name: "Express" }).click()
    await preview.getByRole("button", { name: "Continue" }).click()
    await expect(lastLog(preview)).toHaveText("Submitted shipping=express")
  })

  test(`the form submits every field in ${framework}`, async ({ page }) => {
    await page.goto(`/docs/${framework}/components/select`)
    const preview = example(page, "form")
    await preview.getByRole("combobox").first().click()
    await page.getByRole("option", { name: "Japan" }).click()
    await preview.getByRole("button", { name: "Save" }).click()
    await expect(lastLog(preview)).toHaveText(
      "Submitted country=jp&topics=Design&frequency=Weekly"
    )
  })

  test(`the presentation opens a bottom sheet in ${framework}`, async ({
    page,
  }) => {
    await page.goto(`/docs/${framework}/components/select`)
    const preview = await open(page, "presentation")
    const sheet = page.getByRole("listbox")
    await expect(sheet).toHaveAttribute("data-presentation", "sheet")
    await expect
      .poll(async () => {
        const box = await sheet.boundingBox()
        return Math.round(box!.y + box!.height)
      })
      .toBe(page.viewportSize()!.height)
    await page.getByRole("option", { name: "Done" }).click()
    await expect(page.getByRole("listbox")).toHaveCount(0)
    await expect(preview.getByRole("combobox")).toContainText("Done")
  })
}
