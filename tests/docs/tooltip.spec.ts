import { expect, test, type Locator, type Page } from "@playwright/test"
import { readdirSync } from "node:fs"
import path from "node:path"

// Every Tooltip example on the docs page, used the way its caption says, with hover and Tab.

const frameworks = ["react", "vue", "svelte", "web-components", "solid"]
const root = path.join(import.meta.dirname, "../../examples/components/tooltip")
const folders = ["react", "vue", "svelte", "web", "solid"]
const examplesIn = (folder: string) =>
  readdirSync(path.join(root, folder), { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name.replace(/\.\w+$/, ""))

// The order examples appear on the Tooltip page.
const order = [
  "basic",
  "side",
  "anchor",
  "shortcut",
  "disabled-button",
  "toggleable",
  "copy",
  "truncated",
  "controlled",
  "shared",
  "animation",
  "custom-rendering",
]
const fixtures = ["rtl"]

type Context = { page: Page; preview: Locator; tooltip: Locator }

const away = (page: Page) => page.mouse.move(1, 1, { steps: 2 })

function lastLog(preview: Locator) {
  return preview
    .locator("xpath=ancestor::figure[1]")
    .locator('section[aria-label="Console"] li:not([aria-hidden])')
    .last()
}

// Tabs from just before the example until focus reaches the control.
async function tabTo(page: Page, preview: Locator, control: Locator) {
  await preview.click({ position: { x: 2, y: 2 } })
  for (let step = 0; step < 30; step++) {
    await page.keyboard.press("Tab")
    if (await control.evaluate((el) => el === document.activeElement)) return
  }
  throw new Error("Tab never reached the control.")
}

// Waits for any opening animation to finish first, since a tooltip scales in.
const box = async (locator: Locator) => {
  await locator.evaluate((el) =>
    Promise.all(el.getAnimations({ subtree: true }).map((animation) => animation.finished)),
  )
  return (await locator.boundingBox())!
}

const checks: Record<string, (context: Context) => Promise<void>> = {
  async basic({ page, preview, tooltip }) {
    const trigger = preview.getByRole("button", { name: "Add to library" })
    // Open on load, and inside the preview.
    await expect(tooltip).toHaveText("Add to library")
    const content = await box(tooltip)
    const frame = (await preview.boundingBox())!
    expect(content.y).toBeGreaterThanOrEqual(frame.y)
    expect(content.x).toBeGreaterThanOrEqual(frame.x)
    expect(content.x + content.width).toBeLessThanOrEqual(frame.x + frame.width)
    await page.keyboard.press("Escape")
    await expect(tooltip).toHaveCount(0)
    await trigger.hover()
    await expect(tooltip).toHaveText("Add to library")
    await away(page)
    await expect(tooltip).toHaveCount(0)
    // Keyboard focus opens it at once, and Escape closes it without moving focus.
    await tabTo(page, preview, trigger)
    await expect(tooltip).toHaveText("Add to library")
    await page.keyboard.press("Escape")
    await expect(tooltip).toHaveCount(0)
    await expect(trigger).toBeFocused()
  },

  async side({ page, preview, tooltip }) {
    for (const side of ["top", "left", "right", "bottom"]) {
      await preview.getByRole("button", { name: side[0].toUpperCase() + side.slice(1) }).hover()
      await expect(tooltip).toHaveAttribute("data-side", side)
    }
    await away(page)
    await expect(tooltip).toHaveCount(0)
  },

  async anchor({ preview, tooltip }) {
    const help = preview.getByRole("button", { name: "About webhooks" })
    await expect(help).toHaveAccessibleDescription("We send a POST request here for every new order.")
    await help.hover()
    await expect(tooltip).toHaveText("We send a POST request here for every new order.")
    // Below the whole field, lined up with its start rather than the small button.
    const field = await box(preview.getByRole("textbox", { name: "Webhook URL" }).locator(".."))
    const content = await box(tooltip)
    expect(Math.abs(content.x - field.x)).toBeLessThan(2)
    expect(content.y).toBeGreaterThan(field.y + field.height)
  },

  async shortcut({ page, preview, tooltip }) {
    // The keys are announced through aria-keyshortcuts, so they stay out of the name.
    const save = preview.getByRole("button", { name: "Save", exact: true })
    const share = preview.getByRole("button", { name: "Share" })
    await expect(save).toHaveAttribute("aria-keyshortcuts", /^(Meta|Control)\+S$/)
    await expect(share).toHaveAttribute("aria-keyshortcuts", /^(Meta|Control)\+Shift\+E$/)
    await save.hover()
    await expect(tooltip).toContainText("Save")
    await expect(tooltip.locator("[data-slot=tooltip-shortcut]")).toHaveText(/^\W*(⌘S|Ctrl\+S)\W*$/)
    // The registered shortcuts run the same actions as the buttons.
    await page.keyboard.press("ControlOrMeta+s")
    await expect(lastLog(preview)).toHaveText("Saved")
    await page.keyboard.press("ControlOrMeta+Shift+e")
    await expect(lastLog(preview)).toHaveText("Shared")
    await save.click()
    await expect(lastLog(preview)).toHaveText("Saved")
  },

  async "disabled-button"({ page, preview, tooltip }) {
    const publish = preview.getByRole("button", { name: "Publish" })
    await expect(publish).toHaveAttribute("aria-disabled", "true")
    await publish.hover()
    await expect(tooltip).toHaveText("Add a title to publish")
    await expect(tooltip).toHaveAttribute("data-side", "right")
    // Playwright waits for an aria-disabled button to be enabled, so the press is forced.
    await publish.click({ force: true })
    await expect(lastLog(preview)).toHaveCount(0)
    // Still in the Tab order, so keyboard users get the explanation too.
    await away(page)
    await tabTo(page, preview, publish)
    await expect(tooltip).toHaveText("Add a title to publish")
    // With a title it works, and there's nothing left to explain.
    await preview.getByRole("textbox", { name: "Post title" }).fill("Launch")
    await expect(publish).not.toHaveAttribute("aria-disabled", "true")
    await publish.hover()
    await page.waitForTimeout(900)
    await expect(tooltip).toHaveCount(0)
    await publish.click()
    await expect(lastLog(preview)).toHaveText("Published “Launch”")
  },

  async toggleable({ page, preview, tooltip }) {
    const info = preview.getByRole("button", { name: "About storage" })
    const text = "Files in the trash still use storage."
    await info.click()
    await expect(tooltip).toHaveText(text)
    await away(page)
    await expect(tooltip).toHaveText(text)
    // A second press closes it, and so does a press outside.
    await info.click()
    await expect(tooltip).toHaveCount(0)
    await info.click()
    await expect(tooltip).toHaveText(text)
    await preview.click({ position: { x: 2, y: 2 } })
    await expect(tooltip).toHaveCount(0)
    // Enter toggles it from the keyboard, and Escape closes it.
    await tabTo(page, preview, info)
    await page.keyboard.press("Escape")
    await expect(tooltip).toHaveCount(0)
    await page.keyboard.press("Enter")
    await expect(tooltip).toHaveText(text)
    await page.keyboard.press("Escape")
    await expect(tooltip).toHaveCount(0)
    await expect(info).toBeFocused()
  },

  async copy({ page, preview, tooltip }) {
    const copy = preview.getByRole("button", { name: "Copy" })
    await copy.hover()
    await expect(tooltip).toHaveText("Copy")
    // The tooltip stays open when pressed, and says so.
    await copy.click()
    await expect(tooltip).toHaveText("Copied")
    await expect(preview.getByRole("button", { name: "Copied" })).toBeVisible()
    await away(page)
    await expect(tooltip).toHaveCount(0)
    await preview.getByRole("button", { name: "Copy" }).hover()
    await expect(tooltip).toHaveText("Copy")
  },

  async truncated({ page, preview, tooltip }) {
    const long = preview.getByRole("button", { name: /^Quarterly report/ })
    await long.hover()
    await expect(tooltip).toHaveText("Quarterly report, final revised version for the board.pdf")
    // A name that fits gets no tooltip, by pointer or by keyboard.
    const short = preview.getByRole("button", { name: "Notes.txt" })
    await short.hover()
    await expect(tooltip).toHaveCount(0)
    await page.waitForTimeout(900)
    await expect(tooltip).toHaveCount(0)
    await away(page)
    await tabTo(page, preview, short)
    await page.waitForTimeout(200)
    await expect(tooltip).toHaveCount(0)
  },

  async controlled({ page, preview, tooltip }) {
    const open = preview.getByRole("checkbox", { name: "Open" })
    await open.click()
    await expect(tooltip).toHaveText("Download as CSV")
    await open.click()
    await expect(tooltip).toHaveCount(0)
    await preview.getByRole("button", { name: "Export" }).hover()
    await expect(tooltip).toHaveText("Download as CSV")
    await expect(lastLog(preview)).toHaveText("Opened (trigger-hover)")
    await expect(open).toBeChecked()
    await page.keyboard.press("Escape")
    await expect(tooltip).toHaveCount(0)
    await expect(lastLog(preview)).toHaveText("Closed (escape-key)")
  },

  async shared({ preview, tooltip }) {
    // One tooltip moves along the toolbar and shows each button's label.
    for (const label of ["Bold", "Italic", "Underline"]) {
      const trigger = preview.getByRole("button", { name: label, exact: true })
      await trigger.hover()
      await expect(tooltip).toHaveText(label)
      await expect(tooltip).toHaveCount(1)
      await expect(trigger).toHaveAccessibleDescription(label)
    }
    // Only the active trigger is described.
    await expect(preview.getByRole("button", { name: "Bold", exact: true })).toHaveAccessibleDescription("")
  },

  async animation({ page, preview, tooltip }) {
    await page.waitForTimeout(800)
    const trigger = preview.getByRole("button", { name: "Archive" })
    await trigger.hover()
    await expect(lastLog(preview)).toHaveText("Open")
    await expect(tooltip).toHaveText("Archive")
    // It grows out of the trigger: its origin is the trigger's edge, and it starts smaller.
    const style = await tooltip.evaluate((el) => ({
      origin: getComputedStyle(el).getPropertyValue("--transform-origin"),
      transition: getComputedStyle(el).transitionProperty,
    }))
    expect(style.origin).toMatch(/px \d+px$/)
    expect(style.transition).toContain("scale")
    await away(page)
    await expect(lastLog(preview)).toHaveText("Closed")
  },

  async "custom-rendering"({ preview, tooltip }) {
    const link = preview.getByRole("link", { name: "Changelog" })
    await expect(link).toHaveAttribute("href", "https://example.com/changelog")
    await expect(link).toHaveAccessibleDescription("See what's new in 2.0")
    await link.hover()
    await expect(tooltip).toHaveText("See what's new in 2.0")
  },
}

test("every framework has the same tooltip examples", () => {
  for (const folder of folders)
    expect(examplesIn(folder).sort(), folder).toEqual([...order, ...fixtures].sort())
})

for (const framework of frameworks) {
  test(`every tooltip example works in ${framework}`, async ({ page }) => {
    test.setTimeout(300_000)
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    page.on("console", (message) => message.type() === "error" && errors.push(message.text()))
    // The shared dev server can take a while to compile the page.
    await page.goto(`/docs/${framework}/components/tooltip`, { timeout: 120_000 })
    await page.waitForLoadState("networkidle")
    await expect(page.locator("[data-example]")).toHaveCount(order.length)
    // A closing tooltip stays in the page while it animates out, so only the open one counts.
    const tooltip = page.locator("[role=tooltip][data-open]")

    for (const name of order) {
      await test.step(name, async () => {
        const preview = page.locator(`[data-example="tooltip/${name}"]`)
        await preview.scrollIntoViewIfNeeded()
        await expect(preview.getByRole("button").or(preview.getByRole("link")).first()).toBeVisible()
        await checks[name]({ page, preview, tooltip })
        // Leave nothing open for the next example.
        await away(page)
        await page.keyboard.press("Escape")
        await expect(page.getByRole("tooltip").and(page.locator("[data-open]"))).toHaveCount(0)
      })
    }

    expect(errors).toEqual([])
  })
}
