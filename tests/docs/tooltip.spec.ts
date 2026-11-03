import { expect, test, type Locator, type Page } from "@playwright/test"
import { readdirSync } from "node:fs"
import path from "node:path"

// Every Tooltip example on the docs page, used the way it says it works, in
// every framework, with hover and Tab.

const frameworks = ["react", "vue", "svelte", "web-components", "solid"]
const root = path.join(import.meta.dirname, "../../examples/components/tooltip")
const folders = ["react", "vue", "svelte", "web", "solid"]

// The order examples appear on the Tooltip page.
const order = [
  "basic",
  "side",
  "icon-button",
  "shortcut",
  "disabled-button",
  "toggleable",
  "copy",
  "delay",
  "truncated",
  "rtl",
  "offsets",
  "arrow",
  "anchor",
  "controlled",
  "payload",
  "container",
  "animation",
  "custom-rendering",
]

type Context = { page: Page; preview: Locator; tooltip: Locator }

const away = (page: Page) => page.mouse.move(1, 1, { steps: 2 })

// A value button in one of the examples' option groups, like "300" under "closeDelay".
const option = (preview: Locator, group: string, value: string) =>
  preview.getByRole("group", { name: group, exact: true }).getByRole("button", { name: value, exact: true })

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
    const trigger = preview.getByRole("button", { name: "Hover" })
    await expect(trigger).toHaveAccessibleDescription("Add to library")
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
    for (const side of ["left", "top", "bottom", "right"]) {
      await preview.getByRole("button", { name: side[0].toUpperCase() + side.slice(1) }).hover()
      await expect(tooltip).toHaveAttribute("data-side", side)
    }
    await away(page)
    await expect(tooltip).toHaveCount(0)
  },

  async "icon-button"({ preview, tooltip }) {
    for (const name of ["Bold", "Italic", "Underline", "Show formatting marks"])
      await expect(preview.getByRole("button", { name, exact: true })).toBeVisible()
    await expect(preview.getByRole("button", { name: "Share" })).toHaveAccessibleDescription(
      "Anyone with the link can view",
    )
    // Moving along the toolbar opens the next tooltip at once, and only one is open.
    await preview.getByRole("button", { name: "Bold" }).hover()
    await expect(tooltip).toHaveText("Bold")
    await preview.getByRole("button", { name: "Italic" }).hover()
    await expect(tooltip).toHaveText("Italic")
    await expect(tooltip).toHaveAttribute("data-instant", "")
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
    await expect(preview.locator("output")).toHaveText("Saved")
    await page.keyboard.press("ControlOrMeta+Shift+e")
    await expect(preview.locator("output")).toHaveText("Shared")
    await save.click()
    await expect(preview.locator("output")).toHaveText("Saved")
  },

  async "disabled-button"({ page, preview, tooltip }) {
    const publish = preview.getByRole("button", { name: "Publish" })
    const output = preview.locator("output")
    await expect(publish).toHaveAttribute("aria-disabled", "true")
    await publish.hover()
    await expect(tooltip).toHaveText("Add a title to publish")
    // Playwright waits for an aria-disabled button to be enabled, so the press is forced.
    await publish.click({ force: true })
    await expect(output).toHaveText("Draft")
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
    await expect(output).toHaveText("Published “Launch”")
  },

  async toggleable({ page, preview, tooltip }) {
    const info = preview.getByRole("button", { name: "About storage" })
    const text = "Files in the trash count toward your storage until you empty it."
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

  async delay({ page, preview, tooltip }) {
    const bold = preview.getByRole("button", { name: "Bold" })
    // 600 milliseconds by default, once the last example's tooltip has been closed a moment.
    await page.waitForTimeout(500)
    await bold.hover()
    await page.waitForTimeout(250)
    await expect(tooltip).toHaveCount(0)
    await expect(tooltip).toHaveText("Bold")
    await away(page)
    await expect(tooltip).toHaveCount(0)
    // closeDelay keeps it a moment after the pointer leaves.
    await option(preview, "closeDelay", "300").click()
    await expect(option(preview, "closeDelay", "300")).toHaveAttribute("aria-pressed", "true")
    await page.waitForTimeout(500)
    await bold.hover()
    await expect(tooltip).toHaveText("Bold")
    await away(page)
    await expect(tooltip).toHaveText("Bold")
    await expect(tooltip).toHaveCount(0)
    // Turned off, the buttons still work, but their tooltips don't open.
    await preview.getByRole("checkbox", { name: "Show tooltips" }).uncheck()
    await page.waitForTimeout(500)
    await preview.getByRole("button", { name: "Italic" }).hover()
    await page.waitForTimeout(900)
    await expect(tooltip).toHaveCount(0)
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
    await short.locator("span").hover()
    await page.waitForTimeout(900)
    await expect(tooltip).toHaveCount(0)
    await away(page)
    await tabTo(page, preview, short)
    await page.waitForTimeout(200)
    await expect(tooltip).toHaveCount(0)
  },

  async rtl({ page, preview, tooltip }) {
    // align="start" lines the tooltip up with the trigger's right edge.
    const top = preview.getByRole("button", { name: "أعلى" })
    await top.hover()
    await expect(tooltip).toHaveAttribute("data-side", "top")
    const trigger = await box(top)
    const content = await box(tooltip)
    expect(Math.abs(content.x + content.width - (trigger.x + trigger.width))).toBeLessThan(2)
    await preview.getByRole("button", { name: "يمين" }).hover()
    await expect(tooltip).toHaveAttribute("data-side", "right")
    await away(page)
  },

  async offsets({ page, preview, tooltip }) {
    const trigger = preview.getByRole("button", { name: "Offsets" })
    await trigger.hover()
    await expect(tooltip).toHaveText("start, 4px away, shifted 0px")
    let content = await box(tooltip)
    const button = await box(trigger)
    expect(Math.abs(button.y - (content.y + content.height) - 4)).toBeLessThan(1)
    expect(Math.abs(content.x - button.x)).toBeLessThan(1)
    await option(preview, "sideOffset", "24").click()
    await option(preview, "alignOffset", "16").click()
    await away(page)
    await expect(tooltip).toHaveCount(0)
    await trigger.hover()
    await expect(tooltip).toHaveText("start, 24px away, shifted 16px")
    content = await box(tooltip)
    expect(Math.abs(button.y - (content.y + content.height) - 24)).toBeLessThan(1)
    expect(Math.abs(content.x - button.x - 16)).toBeLessThan(1)
  },

  async arrow({ preview, tooltip }) {
    const trigger = preview.getByRole("button", { name: "Keyboard shortcuts" })
    const arrow = tooltip.locator("[data-slot=tooltip-arrow]")
    await preview.getByRole("checkbox", { name: "Keep open" }).check()
    await expect(tooltip).toHaveText("Keyboard shortcuts")
    await expect(arrow).toHaveAttribute("data-side", "top")
    // Pressing the controls doesn't close it, and the arrow follows the new side.
    await option(preview, "side", "bottom").click()
    await option(preview, "align", "start").click()
    await expect(tooltip).toHaveAttribute("data-side", "bottom")
    await expect(arrow).toHaveAttribute("data-side", "bottom")
    // It points at the middle of the trigger, below it.
    const button = await box(trigger)
    const point = await box(arrow)
    expect(Math.abs(point.x + point.width / 2 - (button.x + button.width / 2))).toBeLessThan(2)
    expect(point.y).toBeGreaterThan(button.y + button.height)
    await preview.getByRole("checkbox", { name: "Keep open" }).uncheck()
    await expect(tooltip).toHaveCount(0)
  },

  async anchor({ preview, tooltip }) {
    await preview.getByRole("button", { name: "About webhooks" }).hover()
    await expect(tooltip).toHaveText("We send a POST request to this URL for every new order.")
    // Lined up with the whole field, not the small button.
    const field = await box(preview.getByRole("textbox", { name: "Webhook URL" }).locator(".."))
    const content = await box(tooltip)
    expect(Math.abs(content.x - field.x)).toBeLessThan(2)
    expect(Math.abs(content.width - field.width)).toBeLessThan(2)
  },

  async controlled({ page, preview, tooltip }) {
    const output = preview.locator("output")
    await expect(output).toHaveText("Closed")
    await preview.getByRole("button", { name: "Export" }).hover()
    await expect(tooltip).toHaveText("Download a CSV of this table")
    await expect(output).toHaveText("Open, last change: trigger-hover")
    await away(page)
    await expect(tooltip).toHaveCount(0)
    await expect(output).toHaveText(/^Closed, last change: /)
    // The controller opens it from anywhere.
    await preview.getByRole("button", { name: "Show from elsewhere" }).click()
    await expect(tooltip).toHaveText("Download a CSV of this table")
    await expect(output).toHaveText("Open, last change: imperative")
    await page.keyboard.press("Escape")
    await expect(tooltip).toHaveCount(0)
    await expect(output).toHaveText("Closed, last change: escape-key")
  },

  async payload({ page, preview, tooltip }) {
    await preview.getByRole("button", { name: "Mon, Oct 5" }).hover()
    await expect(tooltip).toHaveText("No contributions")
    // Moving along the days moves the one tooltip, with the new day's payload.
    await preview.getByRole("button", { name: "Fri, Oct 9" }).hover()
    await expect(tooltip).toHaveText("12 contributions")
    await expect(tooltip).toHaveCount(1)
    await expect(preview.getByRole("button", { name: "Fri, Oct 9" })).toHaveAccessibleDescription(
      "12 contributions",
    )
    await preview.getByRole("button", { name: "Thu, Oct 8" }).hover()
    await expect(tooltip).toHaveText("1 contribution")
    await away(page)
    await expect(tooltip).toHaveCount(0)
  },

  async container({ preview }) {
    await preview.getByRole("button", { name: "Show in the box" }).hover()
    await expect(
      preview
        .locator(".border-dashed")
        .getByRole("tooltip", { name: "This tooltip is in the box below, in the DOM." }),
    ).toBeVisible()
  },

  async animation({ page, preview, tooltip }) {
    const output = preview.locator("output")
    await preview.getByRole("button", { name: "Inbox" }).hover()
    await expect(output).toHaveText("Inbox open")
    await expect(tooltip).toHaveText("Open inbox")
    await preview.getByRole("button", { name: "Drafts" }).hover()
    await expect(output).toHaveText("Drafts open")
    await expect(tooltip).toHaveAttribute("data-instant", "")
    await away(page)
    await expect(output).toHaveText("Drafts closed")
  },

  async "custom-rendering"({ page, preview, tooltip }) {
    // One button is the tooltip's trigger and the popover's.
    const bell = preview.getByRole("button", { name: "Notifications" })
    await bell.hover()
    await expect(tooltip).toHaveText("Notifications")
    await bell.click()
    await expect(page.getByRole("dialog", { name: "Notifications" })).toContainText("You're all caught up.")
    await expect(tooltip).toHaveCount(0)
    await page.keyboard.press("Escape")
    await expect(page.getByRole("dialog")).toHaveCount(0)
    await expect(bell).toBeFocused()
    // The other trigger is a link, described by its tooltip.
    const link = preview.getByRole("link", { name: "Changelog" })
    await expect(link).toHaveAccessibleDescription("What's new in 2.0")
    await link.hover()
    await expect(tooltip).toHaveText("What's new in 2.0")
  },
}

test("every framework has the same tooltip examples", () => {
  for (const folder of folders) {
    const names = readdirSync(path.join(root, folder), { withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name.replace(/\.\w+$/, ""))
    expect(names.sort(), folder).toEqual([...order].sort())
  }
})

for (const framework of frameworks) {
  test(`every tooltip example works in ${framework}`, async ({ page }) => {
    test.setTimeout(300_000)
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    page.on("console", (message) => message.type() === "error" && errors.push(message.text()))
    // The shared dev server can take a while to compile the page.
    await page.goto(`/docs/${framework}/components/tooltip`, { timeout: 120_000 })
    const previews = page.locator("[data-example]")
    await expect(previews).toHaveCount(order.length)
    // A closing tooltip stays in the page while it animates out, so only the open one counts.
    const tooltip = page.locator("[role=tooltip][data-open]")

    for (const [index, name] of order.entries()) {
      await test.step(name, async () => {
        const preview = previews.nth(index)
        await preview.scrollIntoViewIfNeeded()
        await expect(preview.getByRole("button").first()).toBeVisible()
        await checks[name]({ page, preview, tooltip })
        // Leave nothing open for the next example.
        await away(page)
        await page.keyboard.press("Escape")
        await expect(page.getByRole("tooltip")).toHaveCount(0)
      })
    }

    expect(errors).toEqual([])
  })
}
