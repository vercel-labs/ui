import { expect, type Locator, type Page } from "@playwright/test"
import { test } from "./docs-test"
import { readdirSync } from "node:fs"
import path from "node:path"

const frameworks = ["react", "vue", "web-components", "svelte", "solid"]
// Every framework folder must have the same examples.
const root = path.join(import.meta.dirname, "../../examples/components/toolbar")
const folders = ["react", "vue", "web", "svelte", "solid"]
const examplesIn = (folder: string) =>
  readdirSync(path.join(root, folder), { withFileTypes: true })
    .filter((file) => file.isFile())
    .map((file) => file.name.replace(/\.\w+$/, ""))

// The examples in the order they appear on the Toolbar page.
const order = [
  "demo",
  "toggle-group",
  "group",
  "menu",
  "select",
  "input",
  "link",
  "vertical",
  "disabled",
  "loop",
  "controller",
]

// Right-to-left examples stay in the folders but are off the page for now.
const fixtures = [...order, "rtl"]

// The last line an example logged to its console.
function lastLog(preview: Locator) {
  return preview
    .locator("xpath=ancestor::figure[1]")
    .locator('section[aria-label="Console"] li:not([aria-hidden])')
    .last()
}

const example = (page: Page, name: string) =>
  page.locator(`[data-example="toolbar/${name}"]`)

// The toolbar is named and has one tab stop, and an arrow key moves focus from
// that stop to the item named `next`.
async function roves(
  preview: Locator,
  name: string,
  next: string,
  key = "ArrowRight"
) {
  const toolbar = preview.getByRole("toolbar", { name })
  await expect(toolbar).toBeVisible()
  const stop = toolbar.locator('[tabindex="0"]')
  await expect(stop).toHaveCount(1)
  await stop.focus()
  await preview.page().keyboard.press(key)
  await expect(
    toolbar
      .getByLabel(next, { exact: true })
      .or(toolbar.getByText(next, { exact: true }))
  ).toBeFocused()
}

for (const framework of frameworks) {
  test(`every toolbar example works in ${framework}`, async ({ page }) => {
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    page.on(
      "console",
      (message) => message.type() === "error" && errors.push(message.text())
    )
    await page.goto(`/docs/${framework}/components/toolbar`)
    const previews = page.locator("[data-example]")
    await expect(previews).toHaveCount(order.length)
    expect(
      await previews.evaluateAll((els) =>
        els.map((el) => el.getAttribute("data-example"))
      )
    ).toEqual(order.map((name) => `toolbar/${name}`))
    for (const folder of folders) {
      expect(examplesIn(folder).sort(), folder).toEqual([...fixtures].sort())
    }

    // Arrows move focus without pressing; Space presses the focused toggle.
    const demo = example(page, "demo")
    await roves(demo, "Formatting", "Italic")
    await expect(demo.getByRole("button", { name: "Italic" })).toHaveAttribute(
      "aria-pressed",
      "false"
    )
    await page.keyboard.press("Space")
    await expect(demo.getByRole("button", { name: "Italic" })).toHaveAttribute(
      "aria-pressed",
      "true"
    )
    await expect(lastLog(demo)).toHaveText("Italic on")
    await demo.getByRole("button", { name: "Insert link" }).click()
    await expect(lastLog(demo)).toHaveText("Insert link")

    // The toolbar's arrows cross from one toggle group into the next.
    const groups = example(page, "toggle-group")
    await roves(groups, "Paragraph", "Align center")
    await page.keyboard.press("ArrowRight")
    await page.keyboard.press("ArrowRight")
    await expect(
      groups.getByRole("button", { name: "Bulleted list" })
    ).toBeFocused()
    await page.keyboard.press("Space")
    await expect(lastLog(groups)).toHaveText("Bulleted list")

    // A disabled group's items stay focusable and ignore presses.
    const group = example(page, "group")
    await roves(group, "Edit", "Copy")
    await page.keyboard.press("Enter")
    await expect(lastLog(group)).toHaveText("Copy")
    await expect(group.getByRole("button", { name: "Undo" })).toHaveAttribute(
      "aria-disabled",
      "true"
    )
    await page.keyboard.press("ArrowRight")
    await page.keyboard.press("ArrowRight")
    await expect(group.getByRole("button", { name: "Undo" })).toBeFocused()

    // Down opens the menu from its toolbar trigger; Escape returns to it.
    const menu = example(page, "menu")
    await roves(menu, "Document", "Share")
    await page.keyboard.press("ArrowDown")
    await expect(page.getByRole("menu")).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(menu.getByRole("button", { name: "Share" })).toBeFocused()
    await menu.getByRole("button", { name: "Share" }).click()
    await page.getByRole("menuitem", { name: "Copy Link" }).click()
    await expect(lastLog(menu)).toHaveText("Shared by link")

    // The zoom buttons step the select's value, and stop at the ends.
    const select = example(page, "select")
    await roves(select, "View", "Zoom")
    const zoom = select.getByRole("combobox", { name: "Zoom" })
    await expect(zoom).toContainText("100%")
    await select.getByRole("button", { name: "Zoom in" }).click()
    await expect(zoom).toContainText("150%")
    await expect(lastLog(select)).toHaveText("Zoom 150%")
    for (let i = 0; i < 3; i++) {
      await select.getByRole("button", { name: "Zoom out" }).click()
    }
    await expect(zoom).toContainText("50%")
    await expect(
      select.getByRole("button", { name: "Zoom out" })
    ).toHaveAttribute("aria-disabled", "true")

    // Up and Down step the font size; an arrow leaves a field from its end.
    const input = example(page, "input")
    const size = input.getByRole("textbox", { name: "Font size" })
    await size.focus()
    await page.keyboard.press("ArrowUp")
    await expect(size).toHaveValue("15")
    await page.keyboard.press("End")
    await page.keyboard.press("ArrowRight")
    await expect(input.getByRole("textbox", { name: "Find" })).toBeFocused()

    // A plain click on a link is handled in the example and leaves the URL alone.
    const link = example(page, "link")
    await roves(link, "Pull request", "Comment")
    const url = page.url()
    await link.getByRole("link", { name: "Files Changed" }).click()
    await expect(lastLog(link)).toHaveText("Opened Files Changed")
    expect(page.url()).toBe(url)

    // A vertical toolbar moves with Down, and its separator runs across it.
    const vertical = example(page, "vertical")
    await roves(vertical, "Canvas", "Draw", "ArrowDown")
    await expect(vertical.getByRole("separator")).toHaveAttribute(
      "aria-orientation",
      "horizontal"
    )
    await page.keyboard.press("Space")
    await expect(lastLog(vertical)).toHaveText("Draw tool")

    // Archive is reachable but inert; Delete is skipped.
    const disabled = example(page, "disabled")
    await roves(disabled, "Message", "Archive")
    await page.keyboard.press("Enter")
    await page.keyboard.press("ArrowRight")
    await expect(disabled.getByRole("button", { name: "Reply" })).toBeFocused()
    await page.keyboard.press("Enter")
    await expect(lastLog(disabled)).toHaveText("Reply")

    // Without looping, Right stops on Last.
    const loop = example(page, "loop")
    await roves(loop, "Pages", "Previous")
    await page.keyboard.press("End")
    await page.keyboard.press("ArrowRight")
    await expect(loop.getByRole("button", { name: "Last" })).toBeFocused()

    // The controller moves focus from the notes into the toolbar.
    const controller = example(page, "controller")
    await roves(controller, "Notes formatting", "Italic")
    await controller.getByRole("textbox", { name: "Notes" }).fill("Call Hollis")
    await page.keyboard.press("Alt+F10")
    await expect(
      controller.getByRole("button", { name: "Italic" })
    ).toBeFocused()
    await controller.getByRole("button", { name: "Focus Toolbar" }).click()
    await expect(
      controller.getByRole("button", { name: "Italic" })
    ).toBeFocused()
    await page.keyboard.press("Enter")
    await expect(lastLog(controller)).toHaveText("Italic")

    expect(errors).toEqual([])
  })
}
