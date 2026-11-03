import { expect, test, type Page } from "@playwright/test"
import { readdirSync } from "node:fs"
import path from "node:path"

const frameworks = ["react", "solid", "vue", "svelte", "web-components"]
const folders = ["react", "solid", "vue", "svelte", "web"]
const examplesIn = (folder: string) =>
  readdirSync(path.join(import.meta.dirname, "../../examples/components/toast", folder), { withFileTypes: true })
    .filter((file) => file.isFile())
    .map((file) => file.name.replace(/\.\w+$/, ""))

type Preview = ReturnType<Page["locator"]>

// The examples in the order they appear on the page: how to show a toast in
// each, and the name of the toast that shows.
const examples: Record<string, { show: (preview: Preview, page: Page) => Promise<void>; toast: RegExp }> = {
  demo: { show: press(/^Show toast$/), toast: /^Event has been created$/ },
  types: { show: press(/^Success$/), toast: /^Event has been created$/ },
  position: { show: press(/^Top Center$/), toast: /^Event has been created$/ },
  action: { show: press(/^Archive message$/), toast: /^Message archived$/ },
  link: { show: press(/^Create invoice$/), toast: /^Invoice created$/ },
  promise: { show: press(/^Save$/), toast: /^Saving…$/ },
  custom: { show: press(/^New message$/), toast: /^Ada Lovelace$/ },
  stacking: { show: press(/^Add toast$/), toast: /^Notification \d+$/ },
  duration: { show: press(/^Until dismissed$/), toast: /^Your session expires soon$/ },
  update: { show: press(/^Upload$/), toast: /^Upload/ },
  "async-action": { show: press(/^Delete file$/), toast: /^File deleted$/ },
  shortcut: { show: press(/^Show toast$/), toast: /^Press Alt\+T/ },
  "overlay-host": {
    show: async (preview, page) => {
      await preview
        .getByRole("button", { name: /^Delete$/ })
        .first()
        .click()
      const question = page.getByRole("alertdialog").filter({ hasText: "Delete Acme?" })
      await expect(question).toBeVisible()
      await question.getByRole("button", { name: /^Delete$/ }).click()
      await expect(question).toHaveCount(0)
    },
    toast: /^Acme deleted$/,
  },
}
const order = Object.keys(examples)
const fixtures = [...order, "description", "rtl"]

function press(name: RegExp) {
  return async (preview: Preview) => {
    const button = preview.getByRole("button", { name }).first()
    await button.scrollIntoViewIfNeeded()
    await button.click()
  }
}

for (const framework of frameworks) {
  test(`every toast example works in ${framework}`, async ({ page }) => {
    test.setTimeout(120_000)
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    page.on("console", (message) => message.type() === "error" && errors.push(message.text()))
    await page.goto(`/docs/${framework}/components/toast`)
    // The confirm example opens a modal, which must wait for the docs shell to hydrate.
    await page.waitForLoadState("networkidle")
    const previews = page.locator("[data-example]")
    await expect(previews).toHaveCount(order.length)
    for (const folder of folders) expect(examplesIn(folder).sort(), folder).toEqual([...fixtures].sort())

    for (const [index, name] of order.entries()) {
      const { show, toast } = examples[name]
      await show(previews.nth(index), page)
      const shown = page.getByRole("listitem", { name: toast }).first()
      await expect(shown, `${name} shows a toast`).toBeVisible()
    }

    expect(errors).toEqual([])
  })
}
