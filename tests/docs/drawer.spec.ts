import { expect, test, type Locator, type Page } from "@playwright/test"
import { readdirSync } from "node:fs"
import path from "node:path"

const frameworks = ["react", "solid", "vue", "svelte", "web-components"]
const folders = ["react", "solid", "vue", "svelte", "web"]
const root = path.join(import.meta.dirname, "../../examples/components/drawer")
const examplesIn = (folder: string) =>
  readdirSync(path.join(root, folder), { withFileTypes: true })
    .filter((file) => file.isFile())
    .map((file) => file.name.replace(/\.\w+$/, ""))

type Context = { drawer: Locator; preview: Locator; page: Page }

type Example = {
  // The name of the trigger that opens it.
  trigger: RegExp
  // What to check once it's open.
  check?: (context: Context) => Promise<void>
  // How to close it, when Escape doesn't.
  close?: (context: Context) => Promise<void>
}

// The last line an example logged to its console.
function lastLog(preview: Locator) {
  return preview
    .locator("xpath=ancestor::figure[1]")
    .locator('section[aria-label="Console"] li:not([aria-hidden])')
    .last()
}

// Checks the drawer shows its title.
const hasTitle = (drawer: Locator, title: string) =>
  expect(drawer.getByRole("heading", { name: title, exact: true })).toBeVisible()

// The examples in the order they appear on the Drawer page.
const examples: Record<string, Example> = {
  basic: {
    trigger: /^Open Drawer$/,
    check: async ({ drawer }) => {
      await drawer.getByRole("button", { name: "Increase" }).click()
      await expect(drawer.getByText("360", { exact: true })).toBeVisible()
    },
  },
  scrollable: { trigger: /^Scrollable Content$/ },
  sides: {
    trigger: /^Top$/,
    check: async ({ drawer }) => {
      await hasTitle(drawer, "Notifications")
      await expect(drawer).toHaveAttribute("data-side", "top")
    },
  },
  "snap-points": {
    trigger: /^Find a Place$/,
    check: async ({ drawer }) => {
      // It opens at defaultSnapPoint, and a press on the handle moves to the next one.
      await expect(drawer).toHaveAttribute("data-snap-point", "0.5")
      await drawer.getByLabel("Resize").click()
      await expect(drawer).toHaveAttribute("data-snap-point", "1")
    },
  },
  "non-modal": {
    trigger: /^Get Directions$/,
    check: async ({ drawer }) => {
      await hasTitle(drawer, "To Blue Bottle Coffee")
      // At its smallest snap point the page stays usable.
      await expect(drawer).toHaveAttribute("data-interactive", "")
      await expect(drawer).not.toHaveAttribute("aria-modal", "true")
    },
    close: async ({ drawer }) => drawer.getByRole("button", { name: "Done" }).click(),
  },
  nested: {
    trigger: /^Account$/,
    // Escape closes only the topmost drawer.
    check: async ({ drawer, page }) => {
      const drawers = page.getByRole("dialog")
      await drawer.getByRole("button", { name: "Change Password" }).click()
      await expect(drawers).toHaveCount(2)
      await hasTitle(drawers.last(), "Change password")
      await page.keyboard.press("Escape")
      await expect(drawers).toHaveCount(1)
      await hasTitle(drawers.first(), "Account")
    },
  },
  outlet: {
    trigger: /^Compose$/,
    check: async ({ preview }) => {
      await expect(preview.locator('[data-slot="drawer-outlet"]')).toHaveAttribute("data-open", "")
    },
  },
  "action-sheet": {
    trigger: /^Photo Options$/,
    // A keyboard or code open starts on the first action, never the destructive one.
    check: async ({ drawer }) => {
      await expect(drawer.getByRole("button", { name: "Share" })).toBeFocused()
    },
    // The action chosen is what open() resolves with.
    close: async ({ drawer, preview }) => {
      await drawer.getByRole("button", { name: "Delete" }).click()
      await expect(lastLog(preview)).toHaveText("Chose delete")
    },
  },
}
const order = Object.keys(examples)

for (const framework of frameworks) {
  test(`every drawer example works in ${framework}`, async ({ page }) => {
    test.setTimeout(180_000)
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    page.on("console", (message) => message.type() === "error" && errors.push(message.text()))
    await page.goto(`/docs/${framework}/components/drawer`)
    // A modal makes the rest of the page inert. Opening one before the docs
    // shell hydrates would change markup React is still hydrating.
    await page.waitForLoadState("networkidle")
    const previews = page.locator("[data-example]")
    await expect(previews).toHaveCount(order.length)
    for (const folder of folders) expect(examplesIn(folder).sort(), folder).toEqual([...order, "rtl"].sort())

    for (const [index, name] of order.entries()) {
      await test.step(name, async () => {
        const preview = previews.nth(index)
        const example = examples[name]
        const trigger = preview.getByRole("button", { name: example.trigger }).first()
        await trigger.scrollIntoViewIfNeeded()
        await trigger.click()
        // Nested drawers stack, so the topmost is the last one.
        const drawer = page.getByRole("dialog").last()
        await expect(drawer, `${name} opens`).toBeVisible()
        // Focus moves in once the drawer has set up its keys, so Escape isn't pressed too early.
        await expect.poll(() => drawer.evaluate((el) => el.contains(document.activeElement))).toBe(true)
        const context = { drawer, preview, page }
        await example.check?.(context)
        if (example.close) await example.close(context)
        else await page.keyboard.press("Escape")
        await expect(page.getByRole("dialog"), `${name} closes`).toHaveCount(0)
      })
    }

    expect(errors).toEqual([])
  })
}


// The drawer is named by its title.
for (const framework of frameworks) {
  test(`the drawer is named by its title in ${framework}`, async ({ page }) => {
    await page.goto(`/docs/${framework}/components/drawer`)
    await page.waitForLoadState("networkidle")
    await page
      .locator("[data-example]")
      .first()
      .getByRole("button", { name: /^Open Drawer$/ })
      .click()
    await expect(page.getByRole("dialog", { name: "Move Goal" })).toBeVisible()
  })
}
