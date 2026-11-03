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
  scrollable: { trigger: /^Scrollable content$/ },
  sides: {
    trigger: /^Top$/,
    check: async ({ drawer }) => {
      await hasTitle(drawer, "Drawer from the top")
      await expect(drawer).toHaveAttribute("data-side", "top")
    },
  },
  "snap-points": {
    trigger: /^Find a place$/,
    check: async ({ drawer }) => {
      // It opens at defaultSnapPoint, and a press on the handle moves to the next one.
      await expect(drawer).toHaveAttribute("data-snap-point", "0.5")
      await drawer.getByLabel("Resize").click()
      await expect(drawer).toHaveAttribute("data-snap-point", "1")
    },
  },
  handle: {
    trigger: /^Resize with the handle$/,
    check: async ({ drawer }) => {
      await expect(drawer.getByText("160")).toBeVisible()
      await drawer.getByLabel("Resize").click()
      await expect(drawer.getByText("20rem")).toBeVisible()
    },
  },
  controlled: {
    trigger: /^Open$/,
    check: async ({ drawer }) => {
      await expect(drawer.getByText(/^Open at 0\.5\./)).toBeVisible()
    },
  },
  "non-dismissible": {
    trigger: /^Write a post$/,
    // Escape is refused, and the drawer says how it was tried.
    check: async ({ drawer, page }) => {
      await page.keyboard.press("Escape")
      await expect(drawer.getByRole("alert")).toContainText("Refused: escape-key")
      await expect(drawer).toBeVisible()
    },
    close: async ({ drawer }) => drawer.getByRole("button", { name: "Post" }).click(),
  },
  "non-modal": {
    trigger: /^Get directions$/,
    check: async ({ drawer }) => {
      await hasTitle(drawer, "To Blue Bottle Coffee")
      // At its smallest snap point the page stays usable.
      await expect(drawer).toHaveAttribute("data-interactive", "")
      await expect(drawer).not.toHaveAttribute("aria-modal", "true")
    },
    close: async ({ drawer }) => drawer.getByRole("button", { name: "Done" }).click(),
  },
  modal: {
    trigger: /^Open notes$/,
    close: async ({ drawer }) => drawer.getByRole("button", { name: "Done" }).click(),
  },
  nested: {
    trigger: /^Account$/,
    // Escape closes only the topmost drawer.
    check: async ({ drawer, page }) => {
      const drawers = page.getByRole("dialog")
      await drawer.getByRole("button", { name: "Change password" }).click()
      await expect(drawers).toHaveCount(2)
      await hasTitle(drawers.last(), "Change password")
      await page.keyboard.press("Escape")
      await expect(drawers).toHaveCount(1)
      await hasTitle(drawers.first(), "Account")
    },
  },
  form: {
    trigger: /^Edit profile$/,
    // The first save fails, so the drawer stays open with the error.
    check: async ({ drawer }) => {
      await drawer.getByRole("button", { name: "Save changes" }).click()
      await expect(drawer.getByRole("button", { name: "Couldn't save. Try again" })).toBeVisible()
      await expect(drawer).toBeVisible()
    },
  },
  outlet: {
    trigger: /^Compose$/,
    check: async ({ preview }) => {
      await expect(preview.locator('[data-slot="drawer-outlet"]')).toHaveAttribute("data-open", "")
    },
  },
  controller: {
    trigger: /^Share Budget\.xlsx$/,
    check: async ({ drawer, preview }) => {
      await hasTitle(drawer, "Share Budget.xlsx")
      await expect(preview.getByRole("button", { name: "Share Launch video.mp4" })).toBeDisabled()
    },
    // The Close part's value is what the drawer reports when it closes.
    close: async ({ drawer, preview }) => {
      await drawer.getByRole("button", { name: "Copy link" }).click()
      await expect(preview.getByRole("status")).toHaveText("Shared: copy")
    },
  },
  "action-sheet": {
    trigger: /^Photo options$/,
    // A keyboard or code open starts on the first action, never the destructive one.
    check: async ({ drawer }) => {
      await expect(drawer.getByRole("button", { name: "Share" })).toBeFocused()
    },
    // The action chosen is what open() resolves with.
    close: async ({ drawer, preview }) => {
      await drawer.getByRole("button", { name: "Delete" }).click()
      await expect(preview.getByRole("status")).toHaveText("Chose delete")
    },
  },
  "scroll-snap": { trigger: /^Native scrolling$/ },
  "theme-color": { trigger: /^Dim the toolbar$/ },
  physics: {
    trigger: /^Try the physics$/,
    check: async ({ drawer }) => {
      await hasTitle(drawer, "Bouncy")
    },
  },
  persistent: {
    trigger: /^Upgrade plan$/,
    // The chat stays usable while the drawer is modal, and pressing it doesn't close it.
    check: async ({ drawer, page }) => {
      await page.getByRole("button", { name: /^Chat with us/ }).click()
      await expect(page.getByRole("button", { name: "Chat with us (1)" })).toBeVisible()
      await expect(drawer).toBeVisible()
    },
  },
  container: {
    trigger: /^Open in (the box|a window)$/,
    check: async ({ preview }) => {
      await expect(preview.getByRole("dialog")).toBeVisible()
    },
  },
  responsive: { trigger: /^Edit profile$/ },
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
    for (const folder of folders)
      expect(examplesIn(folder).sort(), folder).toEqual([...order, "rtl", "custom-rendering"].sort())

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

// The custom rendering example's trigger opens with its keys, which it advertises.
for (const framework of frameworks) {
  test(`a trigger's shortcut opens the drawer in ${framework}`, async ({ page }) => {
    await page.goto(`/docs/${framework}/components/drawer`)
    await page.waitForLoadState("networkidle")
    const trigger = page.getByRole("button", { name: /^View details/ })
    await expect(trigger).toHaveAttribute("aria-keyshortcuts", /^(Meta|Control)\+J$/)
    await page.keyboard.press("ControlOrMeta+j")
    await expect(page.getByRole("dialog", { name: "Details" })).toBeVisible()
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
