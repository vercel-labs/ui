import { expect, type Locator } from "@playwright/test"
import { type Check, testExamples } from "./docs-helpers"

// The newest line in an example's console, and every line.
const consoleLines = (preview: Locator) =>
  preview.locator("xpath=ancestor::figure[1]").locator('section[aria-label="Console"] li:not([aria-hidden])')
const lastLog = (preview: Locator) => consoleLines(preview).last()

const listIn = (preview: Locator) => preview.page().getByRole("listbox").last()
const contentIn = (preview: Locator) =>
  preview.page().locator('[data-slot="trigger-menu-content"]:visible').last()
const option = (preview: Locator, name: string) => listIn(preview).getByRole("option", { name, exact: true })

// Each check runs on its own example, found by name.
const example =
  (name: string, check: Check): Check =>
  async (preview, framework) => {
    await expect(preview).toHaveAttribute("data-example", `trigger-menu/${name}`)
    // A list animating out swallows presses, like this example's field below the last one.
    await expect(preview.page().locator("[data-ending-style]")).toHaveCount(0)
    await preview.scrollIntoViewIfNeeded()
    await check(preview, framework)
  }

testExamples("trigger-menu", {
  demo: example("demo", async (preview) => {
    const page = preview.page()
    const field = preview.getByRole("textbox", { name: "Message" })
    const top = (await field.boundingBox())!.y
    await field.click()
    await page.keyboard.type("Ping @in")
    await expect(listIn(preview).getByRole("option")).toHaveCount(1)
    await page.keyboard.press("Enter")
    await expect(field).toHaveValue("Ping @Inès Moreau ")
    await page.keyboard.type("@zz")
    await expect(contentIn(preview)).toContainText("No one found")
    await page.keyboard.press("Escape")
    expect((await field.boundingBox())!.y).toBe(top)
  }),
  data: example("data", async (preview) => {
    const page = preview.page()
    const field = preview.getByRole("textbox", { name: "Message" })
    await field.click()
    await page.keyboard.type("@")
    await expect(option(preview, "Hollis Grant")).toBeVisible()
    await page.keyboard.press("Escape")
    await field.fill("")
    await page.keyboard.type("/")
    await expect(option(preview, "status")).toBeVisible()
    await page.keyboard.press("Escape")
    await field.fill("")
    await page.keyboard.type("#lau")
    await expect(option(preview, "launches")).toBeVisible()
    await page.keyboard.press("Enter")
    await expect(field).toHaveValue("#launches ")
  }),
  commands: example("commands", async (preview) => {
    const page = preview.page()
    const field = preview.getByRole("textbox", { name: "Message" })
    await field.click()
    await page.keyboard.type("/sta")
    await page.keyboard.press("Tab")
    await expect(preview.locator('[data-slot="trigger-menu-hint"]')).toHaveText("<status> [until]")
    await expect(option(preview, "busy")).toBeVisible()
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("Tab")
    await expect(option(preview, "1h")).toBeVisible()
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("Enter")
    await expect(lastLog(preview)).toHaveText("Chose /status busy 1h")
    await field.fill("")
    await page.keyboard.type("/aw")
    await page.keyboard.press("Enter")
    await expect(lastLog(preview)).toHaveText(/^Sent \/away\s*$/)
  }),
  icons: example("icons", async (preview) => {
    const page = preview.page()
    await preview.getByRole("textbox", { name: "Message" }).click()
    await page.keyboard.type("/")
    await expect(listIn(preview).getByRole("option")).toHaveCount(5)
    await expect(option(preview, "reply").locator('[data-slot="trigger-menu-item-icon"] svg')).toBeVisible()
    await page.keyboard.press("Escape")
  }),
  async: example("async", async (preview) => {
    const page = preview.page()
    const field = preview.getByRole("textbox", { name: "Message" })
    await field.click()
    await page.keyboard.type("#de")
    await expect(contentIn(preview)).toContainText("Loading channels…")
    await expect(contentIn(preview)).toContainText("2 channels")
    await expect(listIn(preview).getByRole("option")).toHaveCount(2)
    await page.keyboard.type("sign-")
    await expect(listIn(preview).getByRole("option")).toHaveCount(1)
    await page.keyboard.press("Enter")
    await expect(field).toHaveValue("#design-reviews ")
  }),
  "custom-items": example("custom-items", async (preview) => {
    const page = preview.page()
    const field = preview.getByRole("textbox", { name: "Message" })
    await field.click()
    await page.keyboard.type("@ko")
    await page.keyboard.press("Enter")
    await expect(field).toHaveValue("@Kofi ")
    await page.keyboard.type("@")
    await expect(option(preview, "Tomasz Wójcik Deactivated")).toHaveAttribute("aria-disabled", "true")
    await option(preview, "Notify everyone here").click()
    await expect(field).toHaveValue("@Kofi @here ")
  }),
  input: example("input", async (preview) => {
    const page = preview.page()
    const field = preview.getByRole("combobox", { name: "Task" })
    await field.click()
    await page.keyboard.type("@")
    await expect(field).toHaveAttribute("aria-expanded", "true")
    const frame = (await preview.boundingBox())!
    const content = (await contentIn(preview).boundingBox())!
    expect(content.x + content.width).toBeLessThanOrEqual(frame.x + frame.width)
    await expect(listIn(preview).locator("[data-highlighted]")).toHaveCount(0)
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("Enter")
    await expect(field).toHaveValue("@Inès Moreau ")
  }),
  positioning: example("positioning", async (preview) => {
    const page = preview.page()
    await preview.getByRole("textbox", { name: "Comment" }).click()
    await page.keyboard.type("@")
    await expect(listIn(preview)).toBeVisible()
    const label = (await preview.getByText("Comment", { exact: true }).boundingBox())!
    const content = (await contentIn(preview).boundingBox())!
    expect(content.y + content.height).toBeLessThanOrEqual(label.y)
    await page.keyboard.press("Escape")
  }),
  controlled: example("controlled", async (preview) => {
    const page = preview.page()
    await preview.getByRole("textbox", { name: "Message" }).click()
    await page.keyboard.type("@w")
    await expect(consoleLines(preview).first()).toHaveText("Opening (input-change)")
    await expect(consoleLines(preview).getByText("Open", { exact: true })).toHaveCount(1)
    await expect(consoleLines(preview).getByText("Query “w”", { exact: true })).toHaveCount(1)
    await page.keyboard.press("Escape")
    await expect(lastLog(preview)).toHaveText("Closed")
    await page.keyboard.press("Control+j")
    await expect(consoleLines(preview)).toContainText(["Opening (shortcut)"])
    await expect(listIn(preview)).toBeVisible()
  }),
  controller: example("controller", async (preview) => {
    const page = preview.page()
    const field = preview.getByRole("textbox", { name: "Message" })
    await preview.getByRole("button", { name: "Mention" }).click()
    await expect(listIn(preview)).toBeVisible()
    await page.keyboard.press("Enter")
    await expect(lastLog(preview)).toHaveText("Closed (item-press)")
    await expect(field).toHaveValue("@Hollis Grant ")
    await preview.getByRole("button", { name: "Insert Date" }).click()
    await expect(field).toHaveValue(/^@Hollis Grant \w+ \d+$/)
  }),
  editor: example("editor", async (preview) => {
    const page = preview.page()
    const field = preview.getByRole("textbox", { name: "Notes" })
    await field.click()
    await page.keyboard.type("@to")
    await expect(listIn(preview)).toBeVisible()
    await page.keyboard.press("Enter")
    await expect(field).toHaveValue("@Tomasz Wójcik ")
  }),
})
