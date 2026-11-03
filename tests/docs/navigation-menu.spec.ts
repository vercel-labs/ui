import { expect, test, type Locator, type Page } from "@playwright/test"
import { readdirSync } from "node:fs"
import path from "node:path"

const frameworks = ["react", "vue", "svelte", "solid", "web-components"]
// Every framework folder must have the same examples.
const root = path.join(import.meta.dirname, "../../examples/components/navigation-menu")
const folders = ["react", "vue", "svelte", "solid", "web"]
const examplesIn = (folder: string) =>
  readdirSync(path.join(root, folder), { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name.replace(/\.\w+$/, ""))

// The order examples appear on the Navigation Menu page, the trigger to open in
// each, and whether it opens on a press only.
const triggers: Record<string, { name: string; press?: boolean }> = {
  basic: { name: "Components" },
  "link-component": { name: "Guides" },
  rtl: { name: "الأدلة" },
  vertical: { name: "Components" },
  "click-only": { name: "Guides", press: true },
  delay: { name: "Guides" },
  indicator: { name: "Components" },
  "viewport-placement": { name: "Guides" },
  "without-viewport": { name: "Components" },
  nested: { name: "Components" },
  controlled: { name: "Guides" },
  controller: { name: "Components" },
  "keep-mounted": { name: "Guides" },
  "close-on-select": { name: "Components" },
  animation: { name: "Components" },
  container: { name: "Guides" },
  "custom-rendering": { name: "Guides" },
}
const order = Object.keys(triggers)

// The menu's open panels.
function panels(page: Page) {
  return page.locator('[data-slot="navigation-menu-content"]:visible')
}

function triggerIn(page: Page, name: string) {
  return page.locator("[data-example]").nth(order.indexOf(name)).getByRole("button", {
    name: triggers[name].name,
    exact: true,
  })
}

// Hover, or a press for click-only menus.
async function open(trigger: Locator, press?: boolean) {
  await trigger.scrollIntoViewIfNeeded()
  if (press) await trigger.click()
  else await trigger.hover()
}

async function close(page: Page, keys?: boolean) {
  if (keys) await page.keyboard.press("Escape")
  else await page.mouse.move(0, 0)
}

for (const framework of frameworks) {
  test(`every navigation menu example works in ${framework}`, async ({ page }) => {
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    page.on("console", (message) => message.type() === "error" && errors.push(message.text()))
    await page.goto(`/docs/${framework}/components/navigation-menu`)
    await page.waitForLoadState("networkidle")
    await expect(page.locator("[data-example]")).toHaveCount(order.length)
    for (const folder of folders) expect(examplesIn(folder).sort(), folder).toEqual([...order].sort())

    for (const name of order) {
      const { press } = triggers[name]
      const trigger = triggerIn(page, name)
      await open(trigger, press)
      await expect(panels(page).first(), `${name} panel`).toBeVisible()
      await close(page, press)
      await expect(panels(page), `${name} closes`).toHaveCount(0)
    }

    expect(errors).toEqual([])
  })
}

// Routers call preventDefault() on a link's click, and the menu still closes.
for (const framework of frameworks) {
  test(`a router link closes the menu and marks the current page in ${framework}`, async ({ page }) => {
    await page.goto(`/docs/${framework}/components/navigation-menu`)
    await page.waitForLoadState("networkidle")
    const preview = page.locator("[data-example]").nth(order.indexOf("link-component"))
    await open(triggerIn(page, "link-component"))
    const link = panels(page).getByRole("link", { name: /^Installation/ })
    await link.click()
    await expect(preview.getByText("Route: #installation")).toBeVisible()
    await expect(panels(page)).toHaveCount(0)
    await open(triggerIn(page, "link-component"))
    await expect(link).toHaveAttribute("aria-current", "page")
  })
}

// A menu inside another menu's content opens its own panel beside its trigger.
for (const framework of frameworks) {
  test(`a nested menu opens its own panel in ${framework}`, async ({ page }) => {
    await page.goto(`/docs/${framework}/components/navigation-menu`)
    await page.waitForLoadState("networkidle")
    await open(triggerIn(page, "nested"))
    await page.getByRole("button", { name: "Forms", exact: true }).hover()
    await expect(panels(page).getByRole("link", { name: "Select" })).toBeVisible()
  })
}

// closeOnSelect={false} keeps the panel open, and a link's own closeOnSelect closes it.
for (const framework of frameworks) {
  test(`links follow closeOnSelect in ${framework}`, async ({ page }) => {
    await page.goto(`/docs/${framework}/components/navigation-menu`)
    await page.waitForLoadState("networkidle")
    const preview = page.locator("[data-example]").nth(order.indexOf("close-on-select"))
    await open(triggerIn(page, "close-on-select"))
    await panels(page).getByRole("link", { name: "Tabs", exact: true }).click()
    await expect(preview.getByText("Opened: Tabs")).toBeVisible()
    await expect(panels(page)).toHaveCount(1)
    await panels(page).getByRole("link", { name: "Browse all" }).click()
    await expect(preview.getByText("Opened: All components")).toBeVisible()
    await expect(panels(page)).toHaveCount(0)
  })
}

// The RTL example reads right to left on every tab.
for (const framework of frameworks) {
  test(`the RTL navigation menu reads right to left in ${framework}`, async ({ page }) => {
    await page.goto(`/docs/${framework}/components/navigation-menu`)
    const nav = page.locator("[data-example]").nth(order.indexOf("rtl")).getByRole("navigation").first()
    await expect.poll(() => nav.evaluate((el) => getComputedStyle(el).direction)).toBe("rtl")
  })
}
