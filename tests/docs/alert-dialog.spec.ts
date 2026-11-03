import { expect, test, type Page } from "@playwright/test"
import { readdirSync } from "node:fs"
import path from "node:path"

const frameworks = ["react", "solid", "vue", "svelte", "web-components"]
const root = path.join(import.meta.dirname, "../../examples/components/alert-dialog")
const folders = ["react", "solid", "vue", "svelte", "web"]
const examplesIn = (folder: string) =>
  readdirSync(path.join(root, folder), { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name.replace(/\.\w+$/, ""))

const retainedFixtures = ["rtl"]

// The order examples appear on the page, with each one's trigger and answers.
const examples = {
  basic: { trigger: "Delete Project", title: "Delete this project?", cancel: "Cancel", agree: "Delete" },
  controlled: {
    trigger: "Review Changes",
    title: "Discard unsaved changes?",
    cancel: "Keep Editing",
    agree: "Discard",
  },
  shortcut: undefined,
  animation: undefined,
  nested: undefined,
  "async-action": undefined,
  "confirm-anywhere": undefined,
  confirm: undefined,
  queue: undefined,
}
const exact = (text: string) => new RegExp(`^${text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`)

async function load(page: Page, framework: string) {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  page.on("console", (message) => message.type() === "error" && errors.push(message.text()))
  await page.goto(`/docs/${framework}/components/alert-dialog`)
  // A modal makes the rest of the page inert. Opening one before the docs
  // shell hydrates would change markup React is still hydrating.
  await page.waitForLoadState("networkidle")
  const previews = page.locator("[data-example]")
  const shown = examples
  await expect(previews).toHaveCount(Object.keys(shown).length)
  expect(
    await previews.evaluateAll((items) => items.map((item) => item.getAttribute("data-example"))),
  ).toEqual(Object.keys(shown).map((name) => `alert-dialog/${name}`))
  return { errors, example: (name: string) => page.locator(`[data-example="alert-dialog/${name}"]`) }
}

for (const framework of frameworks) {
  test(`every alert dialog asks and answers in ${framework}`, async ({ page }) => {
    test.setTimeout(120_000)
    for (const folder of folders) {
      const files = [...Object.keys(examples), ...retainedFixtures]
      expect(examplesIn(folder).sort(), folder).toEqual(files.sort())
    }
    const { errors, example } = await load(page, framework)
    const alert = page.getByRole("alertdialog")

    for (const [name, parts] of Object.entries(examples)) {
      if (!parts) continue
      const trigger = example(name).getByRole("button", { name: exact(parts.trigger) })
      await trigger.scrollIntoViewIfNeeded()

      // The keyboard opens it on the least destructive answer, and Tab stays inside.
      await trigger.focus()
      await page.keyboard.press("Enter")
      await expect(alert, `${name} opens`).toBeVisible()
      const cancel = alert.getByRole("button", { name: exact(parts.cancel) })
      const agree = alert.getByRole("button", { name: exact(parts.agree) })
      await expect(cancel, `${name} starts on ${parts.cancel}`).toBeFocused()
      await page.keyboard.press("Tab")
      await expect(agree).toBeFocused()
      await page.keyboard.press("Tab")
      await expect(cancel).toBeFocused()
      await expect(alert).toHaveAccessibleName(parts.title)
      await expect(alert).toHaveAttribute("aria-describedby", /.+/)

      await page.mouse.click(4, 4)
      await expect(alert, "a press outside keeps it open").toBeVisible()
      await page.keyboard.press("Escape")
      await expect(alert, `${name} closes`).toHaveCount(0)
      await expect(trigger, "escape closes it back to the trigger").toBeFocused()

      await trigger.click()
      await agree.click()
      await expect(alert).toHaveCount(0)
    }

    expect(errors).toEqual([])
  })

  test(`confirm resolves with the answer in ${framework}`, async ({ page }) => {
    const { errors, example } = await load(page, framework)
    const list = example("confirm")
    const alert = page.getByRole("alertdialog")
    const deletes = list.getByRole("button", { name: "Delete" })
    await expect(deletes).toHaveCount(3)

    await deletes.nth(1).click()
    await expect(alert).toContainText("Delete Globex?")
    await page.keyboard.press("Escape")
    await expect(alert).toHaveCount(0)
    await expect(list.getByText(/^Globex/), "escape answers no").toHaveCount(1)

    await deletes.nth(0).click()
    await expect(alert).toContainText("Delete Acme?")
    await alert.getByRole("button", { name: "Delete" }).click()
    await expect(alert).toHaveCount(0)
    await expect(list.getByText(/^Acme/)).toHaveCount(0)
    await expect(deletes).toHaveCount(2)
    // Focus moves on to the next row's button, not to the page, once the pressed one is gone.
    await expect(deletes.nth(0)).toBeFocused()

    expect(errors).toEqual([])
  })

  test(`an async action keeps the dialog open until it settles in ${framework}`, async ({ page }) => {
    test.setTimeout(60_000)
    const { errors, example } = await load(page, framework)
    const preview = example("async-action")
    const trigger = preview.getByRole("button", { name: "Delete Project" })
    const alert = page.getByRole("alertdialog")
    const action = alert.getByRole("button").last()

    await trigger.click()
    await action.click()
    await expect(action, "the first try is pending meanwhile").toHaveText("Deleting…")
    await expect(action).toHaveAttribute("aria-busy", "true")
    await page.keyboard.press("Escape")
    await alert.getByRole("button", { name: "Cancel" }).click()
    await expect(alert, "nothing else closes it while pending").toBeVisible()
    await expect(action).toHaveText("Try Again")
    await expect(action).not.toHaveAttribute("aria-busy", "true")
    await expect(alert).toBeVisible()
    await expect(alert.getByRole("alert"), "the first try fails, then the error shows").toHaveText(
      "Couldn't delete the project.",
    )

    await alert.getByRole("button", { name: "Cancel" }).click()
    await expect(alert).toHaveCount(0)
    await trigger.click()
    await expect(action, "the error is gone the next time it opens").toHaveText("Delete")

    await action.click()
    await expect(alert, "the second try succeeds and closes it").toHaveCount(0)
    await expect(preview).toContainText("Deleted")
    await expect(trigger).toBeFocused()

    expect(errors).toEqual([])
  })
}

// Triggers say they open a dialog.
for (const framework of frameworks) {
  test(`the trigger says it opens a dialog in ${framework}`, async ({ page }) => {
    await page.goto(`/docs/${framework}/components/alert-dialog`)
    const trigger = page.locator('[data-example="alert-dialog/basic"]').getByRole("button", {
      name: "Delete Project",
    })
    await expect(trigger).toHaveAttribute("aria-haspopup", "dialog")
  })
}

for (const framework of frameworks) {
  test(`the controlled alert dialog follows app state in ${framework}`, async ({ page }) => {
    const { errors, example } = await load(page, framework)
    const preview = example("controlled")
    await expect(preview.getByRole("status")).toHaveText("Open: false")
    await preview.getByRole("button", { name: "Review Changes" }).click()
    await expect(preview.getByRole("status", { includeHidden: true })).toHaveText("Open: true")
    await page.getByRole("alertdialog").getByRole("button", { name: "Keep Editing" }).click()
    await expect(preview.getByRole("status")).toHaveText("Open: false")
    expect(errors).toEqual([])
  })

  test(`confirms answer queued questions one at a time in ${framework}`, async ({ page }) => {
    const { errors, example } = await load(page, framework)
    const preview = example("queue")
    const trigger = preview.getByRole("button", { name: "Review Two Projects" })
    const alert = page.getByRole("alertdialog")
    await trigger.click()
    await expect(alert).toHaveCount(1)
    await expect(alert).toHaveAccessibleName("Archive Acme?")
    await page.keyboard.press("Escape")
    await expect(alert).toHaveCount(1)
    await expect(alert).toHaveAccessibleName("Archive Globex?")
    await alert.getByRole("button", { name: "Archive", exact: true }).click()
    await expect(alert).toHaveCount(0)
    await expect(preview.getByRole("status")).toHaveText("Acme: canceled. Globex: confirmed.")
    await expect(trigger).toBeFocused()
    expect(errors).toEqual([])
  })
}
