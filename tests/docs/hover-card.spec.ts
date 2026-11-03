import { expect, test } from "@playwright/test"
import { readdirSync } from "node:fs"
import path from "node:path"
import { onPage } from "./docs-helpers"

const frameworks = ["react", "vue", "svelte", "web-components", "solid"]
// Every framework folder must have the same examples.
const root = path.join(import.meta.dirname, "../../examples/components/hover-card")
const folders = ["react", "vue", "svelte", "web", "solid"]
const examplesIn = (folder: string) =>
  readdirSync(path.join(root, folder), { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name.replace(/\.\w+$/, ""))

// The order examples appear on the Hover Card page, and the link to rest on in each.
const triggers: Record<string, RegExp> = {
  basic: /^@ada$/,
  side: /^left$/i,
  delay: /^Instant$/,
  rtl: /^آدا لوفليس$/,
  offsets: /^Offsets$/,
  arrow: /^@alan$/,
  anchor: /^Ada Lovelace$/,
  controlled: /^@grace$/,
  payload: /^Ada Lovelace$/,
  container: /^Show in the box$/,
  animation: /^@grace$/,
  "custom-rendering": /Ada Lovelace$/,
}
const fixtures = Object.keys(triggers)
const order = fixtures.filter(onPage)

for (const framework of frameworks) {
  test(`every hover card example works in ${framework}`, async ({ page }) => {
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    page.on("console", (message) => message.type() === "error" && errors.push(message.text()))
    await page.goto(`/docs/${framework}/components/hover-card`)
    await page.waitForLoadState("networkidle")
    const previews = page.locator("[data-example]")
    await expect(previews).toHaveCount(order.length)
    for (const folder of folders) expect(examplesIn(folder).sort(), folder).toEqual([...fixtures].sort())
    const cards = page.locator('[data-slot="hover-card-content"]:visible')

    for (const [index, name] of order.entries()) {
      const trigger = previews.nth(index).getByRole("link", { name: triggers[name] }).first()
      await trigger.scrollIntoViewIfNeeded()
      await trigger.hover()
      await expect(cards.first(), `${name} card`).toBeVisible()
      await page.mouse.move(0, 0)
      await expect(cards, `${name} closes`).toHaveCount(0)
    }

    expect(errors).toEqual([])
  })
}

// Tab from a link with an open card moves into the card, to its own link.
for (const framework of ["react", "vue", "svelte", "web-components"]) {
  test(`Tab moves from the link into the open card in ${framework}`, async ({ page }) => {
    await page.goto(`/docs/${framework}/components/hover-card`)
    await page.waitForLoadState("networkidle")
    const preview = page.locator("[data-example]").nth(order.indexOf("payload"))
    const link = preview.getByRole("link", { name: "Grace Hopper" })
    await link.scrollIntoViewIfNeeded()
    await link.hover()
    await link.focus()
    const card = page.locator('[data-slot="hover-card-content"]:visible')
    await expect(card).toContainText("Built the first compiler")
    await page.keyboard.press("Tab")
    await expect(card.getByRole("link", { name: "View profile" })).toBeFocused()
  })
}
