import { expect, type Locator, type Page } from "@playwright/test"
import { test } from "./docs-test"
import { readdirSync } from "node:fs"
import path from "node:path"

const frameworks = ["react", "vue", "svelte", "web-components", "solid"]
const folders = ["react", "vue", "svelte", "web", "solid"]
const root = path.join(
  import.meta.dirname,
  "../../examples/components/hover-card"
)
const examplesIn = (folder: string) =>
  readdirSync(path.join(root, folder), { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name.replace(/\.\w+$/, ""))

type Context = { card: Locator; preview: Locator; page: Page }

type Example = {
  // The link to rest on.
  trigger: RegExp
  // What to check once the card is open.
  check?: (context: Context) => Promise<void>
}

// The examples in the order they appear on the Hover Card page.
const examples: Record<string, Example> = {
  basic: {
    trigger: /^@hollis$/,
    check: async ({ card }) => {
      await expect(card).toContainText("Design engineer on the payments team")
    },
  },
  side: {
    trigger: /^@ines$/,
    check: async ({ card }) => {
      await expect(card).toContainText("Inès Moreau")
      const arrow = card.locator('[data-slot="hover-card-arrow"]')
      await expect(arrow).toHaveAttribute(
        "data-side",
        (await card.getAttribute("data-side"))!
      )
    },
  },
}
const order = Object.keys(examples)

for (const framework of frameworks) {
  test(`every hover card example works in ${framework}`, async ({ page }) => {
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    page.on(
      "console",
      (message) => message.type() === "error" && errors.push(message.text())
    )
    await page.goto(`/docs/${framework}/components/hover-card`)
    await page.waitForLoadState("networkidle")
    const previews = page.locator("[data-example]")
    await expect(previews).toHaveCount(order.length)
    for (const folder of folders) {
      expect(examplesIn(folder).sort(), folder).toEqual(
        [...order, "rtl"].sort()
      )
    }
    const cards = page.locator('[data-slot="hover-card-content"]:visible')

    for (const [index, name] of order.entries()) {
      await test.step(name, async () => {
        const preview = previews.nth(index)
        const trigger = preview
          .getByRole("link", { name: examples[name].trigger })
          .first()
        await trigger.scrollIntoViewIfNeeded()
        await trigger.hover()
        const card = cards.first()
        await expect(card, `${name} opens`).toBeVisible()
        await expect(trigger).toHaveAttribute("data-open", "")
        await examples[name].check?.({ card, preview, page })
        await page.mouse.move(0, 0)
        await expect(cards, `${name} closes`).toHaveCount(0)
      })
    }

    expect(errors).toEqual([])
  })
}

// The card follows the side chosen for it, and the arrow follows the card.
for (const framework of frameworks) {
  test(`the card opens on the chosen side in ${framework}`, async ({
    page,
  }) => {
    await page.goto(`/docs/${framework}/components/hover-card`)
    await page.waitForLoadState("networkidle")
    const preview = page.locator("[data-example]").nth(order.indexOf("side"))
    await preview.getByRole("combobox", { name: "Side" }).click()
    await page.getByRole("option", { name: "Top", exact: true }).click()
    const trigger = preview.getByRole("link", { name: "@ines" })
    await trigger.hover()
    const card = page.locator('[data-slot="hover-card-content"]:visible')
    await expect(card).toHaveAttribute("data-side", "top")
    await expect(
      card.locator('[data-slot="hover-card-arrow"]')
    ).toHaveAttribute("data-side", "top")
    const [link, box] = await Promise.all([
      trigger.boundingBox(),
      card.boundingBox(),
    ])
    expect(box!.y + box!.height).toBeLessThanOrEqual(link!.y)
  })
}

// Escape closes the card and leaves focus on the link.
for (const framework of frameworks) {
  test(`Escape closes the card in ${framework}`, async ({ page }) => {
    await page.goto(`/docs/${framework}/components/hover-card`)
    await page.waitForLoadState("networkidle")
    const trigger = page
      .locator("[data-example]")
      .first()
      .getByRole("link", { name: "@hollis" })
    await trigger.scrollIntoViewIfNeeded()
    await trigger.hover()
    const card = page.locator('[data-slot="hover-card-content"]:visible')
    await expect(card).toBeVisible()
    await trigger.focus()
    await page.keyboard.press("Escape")
    await expect(card).toHaveCount(0)
    await expect(trigger).toBeFocused()
  })
}
