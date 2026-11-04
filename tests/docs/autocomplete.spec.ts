import { expect, test, type Locator, type Page } from "@playwright/test"
import { readdirSync } from "node:fs"
import path from "node:path"

// Every framework folder must have the same examples.
const root = path.join(import.meta.dirname, "../../examples/components/autocomplete")
const folders = ["react", "vue", "svelte", "web", "solid"]
const examplesIn = (folder: string) =>
  readdirSync(path.join(root, folder), { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name.replace(/\.\w+$/, ""))

type Check = (preview: Locator, page: Page) => Promise<void>

// The first field in an example that can be typed in.
const fieldIn = (preview: Locator) =>
  preview.locator('[role="combobox"]:not([disabled]):not([readonly])').first()

// The newest line in the preview's console pane, where examples log events.
const lastLogIn = (preview: Locator) =>
  preview
    .locator("xpath=ancestor::figure[1]")
    .locator('section[aria-label="Console"] li:not([aria-hidden])')
    .last()

// The list the field controls, wherever it renders, and its suggestions.
async function listOf(field: Locator, page: Page) {
  return page.locator(`[id="${await field.getAttribute("aria-controls")}"]`)
}
const optionsOf = async (field: Locator, page: Page) => (await listOf(field, page)).getByRole("option")
const groupsOf = async (field: Locator, page: Page) =>
  (await listOf(field, page)).getByRole("group").filter({ visible: true })

// Escape closes the list, and the next example waits for it to finish animating out.
async function close(field: Locator, page: Page) {
  await field.press("Escape")
  await expect(field).toHaveAttribute("aria-expanded", "false")
  await expect(page.locator("[data-ending-style]")).toHaveCount(0)
}

async function type(field: Locator, text: string) {
  await field.click()
  await field.fill("")
  await field.pressSequentially(text)
}

const highlightedIn = (page: Page) => page.locator('[role="option"][data-highlighted]')

// The suggestions that are open, wherever they render.
const openContentIn = (page: Page) => page.locator('[data-slot="autocomplete-content"][data-open]')

// The web frameworks, in the order the examples appear on the Autocomplete page.
const web: Record<string, Check> = {
  async demo(preview, page) {
    const field = fieldIn(preview)
    await type(field, "man")
    const options = await optionsOf(field, page)
    await expect(options).toHaveText(["Mango"])
    await field.press("ArrowDown")
    await expect(field).toHaveAttribute("aria-activedescendant", (await options.first().getAttribute("id"))!)
    await field.press("Enter")
    await expect(field).toHaveValue("Mango")
    await expect(field).toHaveAttribute("aria-expanded", "false")
    await expect(field).toBeFocused()
    // Text that matches nothing stays, with the empty message.
    await type(field, "zz")
    await expect(openContentIn(page).getByText("No fruits found.")).toBeVisible()
    await close(field, page)
    await expect(field).toHaveValue("zz")
  },

  async inline(preview, page) {
    const field = fieldIn(preview)
    // It keeps the case typed, with the rest of the first match selected.
    await type(field, "bl")
    await expect(field).toHaveValue("blackberry")
    expect(await field.evaluate((el: HTMLInputElement) => [el.selectionStart, el.selectionEnd])).toEqual([
      2, 10,
    ])
    await field.press("Backspace")
    await expect(field).toHaveValue("bl")
    // The first match stays highlighted, and the arrow keys fill in the suggestion they highlight.
    await expect(highlightedIn(page)).toHaveText("Blackberry")
    await field.press("ArrowDown")
    await expect(field).toHaveValue("Blueberry")
    await field.press("ArrowUp")
    await expect(field).toHaveValue("Blackberry")
    // End accepts a completion, so Escape keeps it.
    await type(field, "ma")
    await field.press("End")
    await close(field, page)
    await expect(field).toHaveValue("mango")
  },

  async highlight(preview, page) {
    const field = fieldIn(preview)
    await type(field, "berry")
    const options = await optionsOf(field, page)
    await expect(options).toHaveText(["Blackberry", "Blueberry", "Strawberry"])
    await expect(options.first().locator("strong, mark")).toHaveText("berry")
    await close(field, page)
  },

  async recent(preview, page) {
    const field = fieldIn(preview)
    await field.click()
    await expect(field).toHaveAttribute("aria-expanded", "true")
    const options = await optionsOf(field, page)
    await expect(page.locator(`[id="${await field.getAttribute("aria-controls")}"]`)).toContainText(
      "Recent searches",
    )
    await expect(options).toHaveCount(4)
    await field.pressSequentially("react")
    await expect(options).toHaveText(["react hooks", "react server components"])
    await expect(options.first().locator("mark")).toHaveText("react")
    await close(field, page)
  },

  async async(preview, page) {
    const field = fieldIn(preview)
    await type(field, "b")
    const options = await optionsOf(field, page)
    await expect(options).toHaveText(["Barcelona", "Berlin", "Boston", "Brussels", "Buenos Aires"])
    await expect(page.getByText("5 cities")).toBeVisible()
    await field.pressSequentially("x")
    await expect(page.getByText("No cities start with “bx”.")).toBeVisible()
    await close(field, page)
  },

  async "open-on-focus"(preview, page) {
    const field = fieldIn(preview)
    await field.click()
    await expect(field).toHaveAttribute("aria-expanded", "true")
    await expect(await optionsOf(field, page)).toHaveCount(4)
    await close(field, page)
    // A press on the field opens them again.
    await field.click()
    await expect(field).toHaveAttribute("aria-expanded", "true")
    await close(field, page)
  },

  async search(preview) {
    const field = fieldIn(preview)
    const output = lastLogIn(preview)
    await type(field, "kotlin")
    await field.press("Enter")
    await expect(output).toHaveText("Searched “kotlin”")
    // With submitOnSelect, choosing a suggestion submits it.
    await type(field, "r")
    await field.press("ArrowDown")
    await field.press("Enter")
    await expect(field).toHaveValue("react hooks")
    await expect(output).toHaveText("Searched “react hooks”")
  },

  async groups(preview, page) {
    const field = fieldIn(preview)
    await type(field, "an")
    const options = await optionsOf(field, page)
    await expect(options).toHaveText(["Banana", "Mango"])
    // Groups with no match hide, and so do the separators.
    await expect(await groupsOf(field, page)).toHaveText([/^\s*Tropical/])
    await close(field, page)
  },

  async icons(preview, page) {
    const field = fieldIn(preview)
    await type(field, "rep")
    const options = await optionsOf(field, page)
    await expect(options).toHaveText(["Replies"])
    await expect(options.first()).toHaveAccessibleName("Replies")
    await field.press("ArrowDown")
    await field.press("Enter")
    await expect(field).toHaveValue("Replies")
  },

  async clear(preview) {
    const field = fieldIn(preview)
    await expect(field).toHaveValue("Mango")
    await preview.getByRole("button", { name: "Clear" }).click()
    await expect(field).toHaveValue("")
    await expect(field).toBeFocused()
    await expect(preview.getByRole("button", { name: "Clear" })).toHaveCount(0)
    const trigger = preview.getByRole("button", { name: "Show fruits" })
    await trigger.click()
    await expect(field).toHaveAttribute("aria-expanded", "true")
    await expect(trigger).toHaveAttribute("data-open", "")
    await trigger.click()
    await expect(field).toHaveAttribute("aria-expanded", "false")
  },

  async form(preview, page) {
    const field = fieldIn(preview)
    const output = lastLogIn(preview)
    await preview.getByRole("button", { name: "Submit" }).click()
    await expect(output).toHaveText("Submitted fruit=Apple")
    // Enter on a suggestion only fills it in.
    await type(field, "man")
    await field.press("ArrowDown")
    await field.press("Enter")
    await expect(field).toHaveValue("Mango")
    await expect(output).toHaveText("Submitted fruit=Apple")
    // Required blocks an empty submit.
    await field.fill("")
    await close(field, page)
    await preview.getByRole("button", { name: "Submit" }).click()
    await expect(output).toHaveText("Submitted fruit=Apple")
    expect(await field.evaluate((el: HTMLInputElement) => el.validity.valueMissing)).toBe(true)
    await preview.getByRole("button", { name: "Reset" }).click()
    await expect(field).toHaveValue("Apple")
  },

  async disabled(preview, page) {
    const fields = preview.getByRole("combobox")
    await expect(fields.nth(0)).toBeDisabled()
    await expect(fields.nth(0)).toHaveValue("Banana")
    // Read-only takes focus but no changes.
    await fields.nth(1).click()
    await expect(fields.nth(1)).toBeFocused()
    await page.keyboard.type("x")
    await expect(fields.nth(1)).toHaveValue("Cherry")
    // The arrow keys skip a disabled suggestion, and a press doesn't choose it.
    const field = fields.nth(2)
    await type(field, "b")
    const banana = page.getByRole("option", { name: "Banana" })
    await expect(banana).toHaveAttribute("aria-disabled", "true")
    await field.press("ArrowDown")
    await expect(highlightedIn(page)).toHaveText("Blackberry")
    await banana.click({ force: true })
    await expect(field).toHaveValue("b")
    await close(field, page)
  },

  async filter(preview) {
    const field = fieldIn(preview)
    // Keywords match too, so "bug" finds fix, and "startsWith" keeps "re" to words that start with it.
    await type(field, "bug")
    const options = await optionsOf(field, preview.page())
    await expect(options).toHaveText([/^\s*fix/])
    await type(field, "re")
    await expect(options).toHaveText([/^\s*feature/, /^\s*docs/, /^\s*refactor/])
    await field.press("ArrowDown")
    await field.press("Enter")
    await expect(field).toHaveValue("feature")
  },

  async "auto-highlight"(preview, page) {
    const field = fieldIn(preview)
    await type(field, "pe")
    await expect(highlightedIn(page)).toHaveText("Grape")
    // With loop={false}, the arrow keys stop at either end.
    await field.press("ArrowUp")
    await expect(highlightedIn(page)).toHaveText("Grape")
    for (let step = 0; step < 4; step++) await field.press("ArrowDown")
    await expect(highlightedIn(page)).toHaveText("Pear")
    await type(field, "pe")
    await field.press("Enter")
    await expect(field).toHaveValue("Grape")
  },

  async rtl(preview, page) {
    const field = fieldIn(preview)
    await type(field, "ال")
    await expect(field).toHaveValue("القاهرة")
    // The suggestions line up with the field's right edge.
    const content = page.locator('[data-slot="autocomplete-content"][data-open]')
    const fieldBox = (await field.boundingBox())!
    const contentBox = (await content.boundingBox())!
    expect(Math.abs(fieldBox.x + fieldBox.width - (contentBox.x + contentBox.width))).toBeLessThan(2)
    await close(field, page)
  },

  async data(preview, page) {
    const field = fieldIn(preview)
    await field.click()
    await field.press("ArrowDown")
    const options = await optionsOf(field, page)
    await expect(options).toHaveCount(14)
    await expect(await groupsOf(field, page)).toHaveCount(3)
    await field.pressSequentially("an")
    await expect(options).toHaveText(["Banana", "Mango"])
    await expect(await groupsOf(field, page)).toHaveCount(1)
    await field.press("ArrowDown")
    await field.press("Enter")
    await expect(field).toHaveValue("Banana")
  },

  async controlled(preview) {
    const field = fieldIn(preview)
    const output = lastLogIn(preview)
    await field.click()
    await field.press("ArrowDown")
    await expect(output).toHaveText("opened and settled")
    await field.pressSequentially("Strawberry pie")
    // The 13th character is canceled, so the text stays 12 long.
    await expect(field).toHaveValue("Strawberry p")
    await expect(output).toHaveText("text: input-change")
    await field.fill("")
    await field.pressSequentially("ch")
    await field.press("ArrowDown")
    await expect(output).toHaveText("highlighted Cherry")
    await field.press("Escape")
    await expect(output).toHaveText("closed and settled")
    await expect(field).toHaveAttribute("aria-expanded", "false")
  },

  async controller(preview, page) {
    const field = fieldIn(preview)
    await preview.getByRole("button", { name: "Open" }).click()
    await expect(field).toHaveAttribute("aria-expanded", "true")
    await preview.getByRole("button", { name: "Type “Pea”" }).click()
    await expect(field).toHaveValue("Pea")
    await preview.getByRole("button", { name: "Clear" }).click()
    await expect(field).toHaveValue("")
    await preview.getByRole("button", { name: "Focus" }).click()
    await expect(field).toBeFocused()
    if ((await field.getAttribute("aria-expanded")) === "true") await close(field, page)
  },

  async positioning(preview, page) {
    const field = fieldIn(preview)
    await field.click()
    await field.press("ArrowDown")
    await expect(field).toHaveAttribute("aria-expanded", "true")
    // It renders inside the box, above it, at its end.
    const box = preview.locator('[data-slot="card"]')
    const content = box.locator('[data-slot="autocomplete-content"]')
    await expect(content).toBeVisible()
    const boxRect = (await box.boundingBox())!
    const contentRect = (await content.boundingBox())!
    expect(contentRect.y + contentRect.height).toBeLessThanOrEqual(boxRect.y)
    expect(Math.abs(contentRect.x + contentRect.width - (boxRect.x + boxRect.width + 4))).toBeLessThan(2)
    // An outside press closes it, and it stays in the page, hidden.
    await page.mouse.click(5, 5)
    await expect(field).toHaveAttribute("aria-expanded", "false")
    await expect(content).toBeAttached()
    await expect(content).toBeHidden()
  },

  async animation(preview, page) {
    const field = fieldIn(preview)
    await type(field, "man")
    await expect(await optionsOf(field, page)).toHaveText(["Mango"])
    const content = openContentIn(page)
    await expect(content).not.toHaveAttribute("data-starting-style")
    // It fades out, then unmounts or hides.
    const watch = await content.evaluateHandle((el) => {
      const seen = { el, ending: false }
      // Reads the records, not the element: the attribute can come and go before the callback runs.
      new MutationObserver((records) => {
        for (const record of records) {
          if (record.attributeName === "data-ending-style" && record.oldValue === null) seen.ending = true
        }
      }).observe(el, { attributes: true, attributeOldValue: true })
      return seen
    })
    await close(field, page)
    expect(await watch.evaluate((seen) => seen.ending)).toBe(true)
    await expect.poll(() => watch.evaluate((seen) => !seen.el.isConnected || seen.el.hidden)).toBe(true)
  },

  async presentation(preview, page) {
    const field = fieldIn(preview)
    await field.click()
    await field.press("ArrowDown")
    const content = page.locator('[data-slot="autocomplete-content"][data-open]')
    await expect(content).toHaveAttribute("data-presentation", "sheet")
    // The field moves into the sheet's header, and keeps focus there.
    await expect(content.locator('[data-slot="autocomplete-header"] input')).toBeFocused()
    await page.keyboard.type("man")
    await expect(content.getByRole("option")).toHaveText(["Mango"])
    await page.keyboard.press("Escape")
    await expect(page.locator('[data-slot="autocomplete-content"][data-open]')).toHaveCount(0)
    await expect(preview.getByRole("combobox")).toHaveValue("man")
  },

  async "custom-rendering"(preview, page) {
    const field = fieldIn(preview)
    // The section hint doesn't count toward filtering.
    await type(field, "con")
    await expect((await optionsOf(field, page)).filter({ visible: true })).toHaveCount(0)
    // Each suggestion is a link, and Enter follows the highlighted one.
    await field.fill("")
    await type(field, "sty")
    await field.press("ArrowDown")
    await field.press("Enter")
    await expect(page).toHaveURL(/#styling$/)
  },
}

const fixtureNames = Object.keys(web)
const order = [
  "demo",
  "disabled",
  "clear",
  "open-on-focus",
  "auto-highlight",
  "inline",
  "highlight",
  "filter",
  "groups",
  "icons",
  "data",
  "controlled",
  "controller",
  "positioning",
  "animation",
  "presentation",
  "form",
  "search",
  "recent",
  "async",
  "custom-rendering",
]

for (const framework of ["react", "vue", "svelte", "web-components", "solid"]) {
  test(`every autocomplete example works in ${framework}`, async ({ page }) => {
    test.setTimeout(120_000)
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    page.on("console", (message) => message.type() === "error" && errors.push(message.text()))
    await page.goto(`/docs/${framework}/components/autocomplete`)
    await page.waitForLoadState("networkidle")
    const previews = page.locator("[data-example]")
    await expect(previews).toHaveCount(order.length)
    for (const folder of folders) expect(examplesIn(folder).sort(), folder).toEqual([...fixtureNames].sort())

    for (const name of order) {
      const preview = page.locator(`[data-example="autocomplete/${name}"]`)
      await preview.scrollIntoViewIfNeeded()
      await test.step(name, () => web[name](preview, page))
    }

    expect(errors).toEqual([])
  })
}
