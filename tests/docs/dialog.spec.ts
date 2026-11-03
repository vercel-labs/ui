import { expect, test, type Page } from "@playwright/test"
import { readdirSync } from "node:fs"
import path from "node:path"

const frameworks = ["react", "solid", "vue", "svelte", "web-components"]
const folders = ["react", "solid", "vue", "svelte", "web"]
const examplesIn = (component: string, folder: string) =>
  readdirSync(path.join(import.meta.dirname, "../../examples/components", component, folder), {
    withFileTypes: true,
  })
    .filter((file) => file.isFile())
    .map((file) => file.name.replace(/\.\w+$/, ""))

// The order examples appear on each page, and how to open each one: the
// trigger's name, or a function that opens it.
type Open = RegExp | ((preview: ReturnType<Page["locator"]>, page: Page) => Promise<void>)

const pages: Record<string, { role: "dialog" | "alertdialog"; examples: Record<string, Open> }> = {
  dialog: {
    role: "dialog",
    examples: {
      basic: /^Share$/,
      scrollable: /^Scrollable Content$/,
      form: /^New Article$/,
      controlled: /^Notification Settings$/,
      shortcut: /^New Contact/,
      animation: /^(Slide|Fade) In$/,
      modal: /^Open Notes$/,
      "dirty-form": /^Write a Post$/,
      nested: /^Account$/,
      "from-menu": async (preview, page) => {
        await preview.getByRole("button", { name: "File Actions" }).click()
        await page.getByRole("menuitem", { name: /Rename/ }).click()
      },
      payload: /^Remind Globex$/,
      presentation: /^Edit Profile$/,
      "custom-rendering": /^View Details/,
    },
  },
}

for (const [component, { role, examples }] of Object.entries(pages)) {
  const order = Object.keys(examples)
  for (const framework of frameworks) {
    test(`every ${component} example works in ${framework}`, async ({ page }) => {
      test.setTimeout(120_000)
      const errors: string[] = []
      page.on("pageerror", (error) => errors.push(error.message))
      page.on("console", (message) => message.type() === "error" && errors.push(message.text()))
      await page.goto(`/docs/${framework}/components/${component}`)
      // A modal makes the rest of the page inert. Opening one before the docs
      // shell hydrates would change markup React is still hydrating.
      await page.waitForLoadState("networkidle")
      const previews = page.locator("[data-example]")
      await expect(previews).toHaveCount(order.length)
      for (const folder of folders)
        expect(examplesIn(component, folder).sort(), folder).toEqual([...order, "rtl"].sort())

      for (const [index, name] of order.entries()) {
        const preview = previews.nth(index)
        const open = examples[name]
        if (typeof open === "function") await open(preview, page)
        else {
          const trigger = preview.getByRole("button", { name: open }).first()
          await trigger.scrollIntoViewIfNeeded()
          await trigger.click()
        }
        // Nested popups may stack, so the topmost is the last one.
        await expect(page.getByRole(role).last(), `${name} opens`).toBeVisible()
        await page.keyboard.press("Escape")
        await expect(page.getByRole(role), `${name} closes`).toHaveCount(0)
      }

      expect(errors).toEqual([])
    })
  }
}

// The shortcut example's trigger opens with its keys, which it advertises.
for (const framework of frameworks) {
  test(`a trigger's shortcut opens the dialog in ${framework}`, async ({ page }) => {
    await page.goto(`/docs/${framework}/components/dialog`)
    const trigger = page.getByRole("button", { name: /^New Contact/ })
    await expect(trigger).toHaveAttribute("aria-keyshortcuts", /^(Meta|Control)\+J$/)
    await page.keyboard.press("ControlOrMeta+j")
    await expect(page.getByRole("dialog", { name: "New contact" })).toBeVisible()
  })
}

// The dialog is named by its title and described by its description.
for (const framework of frameworks) {
  test(`the dialog is named by its title in ${framework}`, async ({ page }) => {
    await page.goto(`/docs/${framework}/components/dialog`)
    // Opening a modal before the page hydrates makes its markup inert.
    await page.waitForLoadState("networkidle")
    await page
      .locator("[data-example]")
      .first()
      .getByRole("button", { name: /^Share$/ })
      .click()
    await expect(page.getByRole("dialog", { name: "Share link" })).toBeVisible()
  })
}
