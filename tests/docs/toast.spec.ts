import { expect, type Locator, type Page } from "@playwright/test"
import { test } from "./docs-test"
import { readdirSync } from "node:fs"
import path from "node:path"

const frameworks = ["react", "solid", "vue", "svelte", "web-components"]
// Every framework folder must have the same examples.
const root = path.join(import.meta.dirname, "../../examples/components/toast")
const folders = ["react", "solid", "vue", "svelte", "web"]
const examplesIn = (folder: string) =>
  readdirSync(path.join(root, folder), { withFileTypes: true })
    .filter((file) => file.isFile())
    .map((file) => file.name.replace(/\.\w+$/, ""))

// The latest line in an example's console.
function lastLog(preview: Locator) {
  return preview
    .locator("xpath=ancestor::figure[1]")
    .locator('section[aria-label="Console"] li:not([aria-hidden])')
    .last()
}

function press(name: string) {
  return async (preview: Locator) => {
    const button = preview.getByRole("button", { name, exact: true })
    await button.scrollIntoViewIfNeeded()
    await button.click()
  }
}

type Example = { show: (preview: Locator, page: Page) => Promise<void>; toast: RegExp }

// The examples in the order they appear on the page: how to show a toast in
// each, and the name of the toast that shows.
const examples: Record<string, Example> = {
  demo: { show: press("Create Event"), toast: /^Event created$/ },
  types: { show: press("Success"), toast: /^Changes saved$/ },
  position: { show: press("Create Event"), toast: /^Event created$/ },
  action: { show: press("Archive Message"), toast: /^Message archived$/ },
  link: { show: press("Send Invoice"), toast: /^Invoice sent$/ },
  promise: { show: press("Save Changes"), toast: /^Saving changes…$/ },
  stacking: { show: press("Add Toast"), toast: /^Event created$/ },
  duration: { show: press("Until Dismissed"), toast: /^Your session expires in 5 minutes$/ },
  update: { show: press("Upload Report"), toast: /^Uploading report\.pdf/ },
  "async-action": { show: press("Delete File"), toast: /^File deleted$/ },
  shortcut: { show: press("Send Message"), toast: /^Message sent$/ },
  "overlay-host": {
    show: async (preview, page) => {
      await preview.getByRole("button", { name: "Delete Acme" }).click()
      const question = page.getByRole("alertdialog", { name: "Delete Acme?" })
      await expect(question).toBeVisible()
      await question.getByRole("button", { name: "Delete" }).click()
      await expect(question).toHaveCount(0)
    },
    toast: /^Acme deleted$/,
  },
  custom: { show: press("New Message"), toast: /^Hollis Grant$/ },
}
const order = Object.keys(examples)
const fixtures = [...order, "description", "rtl"]

const open = async (page: Page, framework: string, name: string) => {
  await page.goto(`/docs/${framework}/components/toast`)
  await page.waitForLoadState("networkidle")
  const preview = page.locator(`[data-example="toast/${name}"]`)
  await preview.scrollIntoViewIfNeeded()
  return preview
}

const toastIn = (preview: Locator, name: RegExp | string) =>
  preview.locator('[data-slot="toast-root"]').filter({ has: preview.page().getByText(name) })

for (const framework of frameworks) {
  test(`every toast example works in ${framework}`, async ({ page }) => {
    test.setTimeout(120_000)
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    page.on("console", (message) => message.type() === "error" && errors.push(message.text()))
    await page.goto(`/docs/${framework}/components/toast`)
    // The confirm example opens a modal, which must wait for the docs shell to hydrate.
    await page.waitForLoadState("networkidle")
    await expect(page.locator("[data-example]")).toHaveCount(order.length)
    for (const folder of folders) expect(examplesIn(folder).sort(), folder).toEqual([...fixtures].sort())

    for (const name of order) {
      await test.step(name, async () => {
        const preview = page.locator(`[data-example="toast/${name}"]`)
        await examples[name].show(preview, page)
        const shown = preview.getByRole("listitem", { name: examples[name].toast }).first()
        await expect(shown, `${name} shows a toast`).toBeVisible()
      })
    }

    expect(errors).toEqual([])
  })
}

// The stack keeps its motion: a 400ms transition while collapsed, and no text selection while swiping.
for (const framework of frameworks) {
  test(`toasts animate and never select text in ${framework}`, async ({ page }) => {
    const preview = await open(page, framework, "demo")
    await preview.getByRole("button", { name: "Create Event" }).click()
    const toast = preview.getByRole("listitem", { name: "Event created" })
    await expect(toast).toBeVisible()
    await expect(toast).toHaveCSS("transition-duration", "0.4s")
    await expect(toast).toHaveCSS("user-select", "none")
  })
}

// Undo runs the toast's action and logs it.
for (const framework of frameworks) {
  test(`Undo logs in ${framework}`, async ({ page }) => {
    const preview = await open(page, framework, "demo")
    await preview.getByRole("button", { name: "Create Event" }).click()
    const toast = preview.getByRole("listitem", { name: "Event created" })
    await toast.getByRole("button", { name: "Undo" }).click()
    await expect(toast).toHaveCount(0)
    await expect(lastLog(preview)).toHaveText("Event removed")
  })
}

// Dismiss runs the cancel callback, and onDismiss logs why the toast closed.
for (const framework of frameworks) {
  test(`the console says why a toast closed in ${framework}`, async ({ page }) => {
    const preview = await open(page, framework, "action")
    await preview.getByRole("button", { name: "Archive Message" }).click()
    const toast = preview.getByRole("listitem", { name: "Message archived" })
    await toast.getByRole("button", { name: "Dismiss" }).click()
    await expect(toast).toHaveCount(0)
    await expect(lastLog(preview)).toHaveText("Closed (close-press)")
  })
}

// A rejected promise shows the error with Retry, which saves again.
for (const framework of frameworks) {
  test(`the promise toast retries in ${framework}`, async ({ page }) => {
    const preview = await open(page, framework, "promise")
    const save = preview.getByRole("button", { name: "Save Changes" })
    await save.click()
    await expect(preview.getByRole("listitem", { name: "Changes saved" })).toBeVisible()
    await save.click()
    const failed = preview.getByRole("listitem", { name: "Couldn't save changes" })
    await expect(failed).toBeVisible()
    await failed.getByRole("button", { name: "Retry" }).click()
    await expect(preview.getByRole("listitem", { name: "Saving changes…" })).toBeVisible()
  })
}

// Past maxVisible, toasts wait in the queue.
for (const framework of frameworks) {
  test(`the stack shows four toasts at most in ${framework}`, async ({ page }) => {
    const preview = await open(page, framework, "stacking")
    const add = preview.getByRole("button", { name: "Add Toast" })
    for (let count = 0; count < 5; count++) await add.click()
    await expect(preview.locator('[data-slot="toast-root"]')).toHaveCount(4)
    await preview.getByRole("checkbox", { name: "Always expanded" }).click()
    await expect(preview.locator('[data-slot="toast-region"]')).toHaveAttribute("data-expanded", "")
  })
}

// The upload toast updates in place, and Cancel Upload closes it.
for (const framework of frameworks) {
  test(`the upload toast updates and cancels in ${framework}`, async ({ page }) => {
    const preview = await open(page, framework, "update")
    await preview.getByRole("button", { name: "Upload Report" }).click()
    await expect(preview.getByRole("listitem", { name: /^Uploading report\.pdf… [1-9]\d*%$/ })).toBeVisible()
    await preview.getByRole("button", { name: "Cancel Upload" }).click()
    await expect(preview.locator('[data-slot="toast-root"]')).toHaveCount(0)
    await expect(lastLog(preview)).toHaveText("Upload canceled")
  })
}

// Undo stays pending while the restore runs, then logs.
for (const framework of frameworks) {
  test(`the async Undo shows its pending state in ${framework}`, async ({ page }) => {
    const preview = await open(page, framework, "async-action")
    await preview.getByRole("button", { name: "Delete File" }).click()
    const toast = preview.getByRole("listitem", { name: "File deleted" })
    await toast.getByRole("button", { name: "Undo" }).click()
    await expect(toast.getByRole("button", { name: "Restoring…" })).toHaveAttribute("data-pending", "")
    await expect(toast).toHaveCount(0)
    await expect(lastLog(preview)).toHaveText("Q3 report.pdf restored")
  })
}

// Alt+T moves focus to the toast, and Escape dismisses it.
for (const framework of frameworks) {
  test(`the shortcut reaches the toast in ${framework}`, async ({ page }) => {
    const preview = await open(page, framework, "shortcut")
    await preview.getByRole("button", { name: "Send Message" }).click()
    const toast = preview.getByRole("listitem", { name: "Message sent" })
    await expect(toast).toBeVisible()
    await page.keyboard.press("Alt+t")
    await expect(toast).toBeFocused()
    await page.keyboard.press("Escape")
    await expect(toast).toHaveCount(0)
  })
}

// The custom toast reads its initials from data, and Reply logs.
for (const framework of frameworks) {
  test(`the custom toast renders its data in ${framework}`, async ({ page }) => {
    const preview = await open(page, framework, "custom")
    await preview.getByRole("button", { name: "New Message" }).click()
    const toast = toastIn(preview, "Can you review the draft?")
    await expect(toast).toContainText("HG")
    await toast.getByRole("button", { name: "Reply" }).click()
    await expect(lastLog(preview)).toHaveText("Replying to Hollis Grant")
  })
}
