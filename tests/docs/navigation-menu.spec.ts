import { expect, type Locator, type Page } from "@playwright/test"
import { test } from "./docs-test"
import { readdirSync } from "node:fs"
import path from "node:path"

const frameworks = ["react", "vue", "svelte", "solid", "web-components"]
// Every framework folder must have the same examples.
const root = path.join(
  import.meta.dirname,
  "../../examples/components/navigation-menu"
)
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
  vertical: { name: "Components" },
  "click-only": { name: "Guides", press: true },
  nested: { name: "Components" },
  animation: { name: "Components" },
  "custom-rendering": { name: "Guides" },
}
const order = Object.keys(triggers)
const fixtures = ["rtl"]

// The menu's open panels.
function panels(page: Page) {
  return page.locator('[data-slot="navigation-menu-content"]:visible')
}

function example(page: Page, name: string) {
  return page.locator(`[data-example="navigation-menu/${name}"]`)
}

function lastLog(preview: Locator) {
  return preview
    .locator("xpath=ancestor::figure[1]")
    .locator('section[aria-label="Console"] li:not([aria-hidden])')
    .last()
}

function triggerIn(page: Page, name: string) {
  return example(page, name).getByRole("button", {
    name: triggers[name].name,
    exact: true,
  })
}

// Hover, or a press for click-only menus.
async function open(trigger: Locator, press?: boolean) {
  await trigger.scrollIntoViewIfNeeded()
  if (press) {
    await trigger.click()
  } else {
    await trigger.hover()
  }
}

async function close(page: Page, keys?: boolean) {
  if (keys) {
    await page.keyboard.press("Escape")
  } else {
    await page.mouse.move(0, 0)
  }
}

for (const framework of frameworks) {
  test(`every navigation menu example works in ${framework}`, async ({
    page,
  }) => {
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    page.on(
      "console",
      (message) => message.type() === "error" && errors.push(message.text())
    )
    await page.goto(`/docs/${framework}/components/navigation-menu`)
    await page.waitForLoadState("networkidle")
    await expect(page.locator("[data-example]")).toHaveCount(order.length)
    for (const folder of folders) {
      expect(examplesIn(folder).sort(), folder).toEqual(
        [...order, ...fixtures].sort()
      )
    }

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
  test(`a router link closes the menu and marks the current page in ${framework}`, async ({
    page,
  }) => {
    await page.goto(`/docs/${framework}/components/navigation-menu`)
    await page.waitForLoadState("networkidle")
    const preview = example(page, "link-component")
    await open(triggerIn(page, "link-component"), true)
    const link = panels(page).getByRole("link", { name: /^Installation/ })
    await link.click()
    await expect(lastLog(preview)).toHaveText("Navigated to #installation")
    await expect(panels(page)).toHaveCount(0)
    await open(triggerIn(page, "link-component"), true)
    await expect(link).toHaveAttribute("aria-current", "page")
  })
}

// A menu inside another menu's content opens its own panel beside its trigger.
for (const framework of frameworks) {
  test(`a nested menu opens its own panel in ${framework}`, async ({
    page,
  }) => {
    await page.goto(`/docs/${framework}/components/navigation-menu`)
    await page.waitForLoadState("networkidle")
    await open(triggerIn(page, "nested"))
    await page.getByRole("button", { name: "Forms", exact: true }).hover()
    await expect(
      panels(page).getByRole("link", { name: "Select" })
    ).toBeVisible()
  })
}

// Switching items logs the new one, and closing logs once the animation ends.
for (const framework of frameworks) {
  test(`the animated menu reports when it finishes in ${framework}`, async ({
    page,
  }) => {
    await page.goto(`/docs/${framework}/components/navigation-menu`)
    await page.waitForLoadState("networkidle")
    const preview = example(page, "animation")
    await open(triggerIn(page, "animation"))
    await expect(lastLog(preview)).toHaveText("Finished opening")
    await close(page)
    await expect(lastLog(preview)).toHaveText("Finished closing")
  })
}
