import type { Page } from "@playwright/test"
import { expect, regionNamed, test, triggerNamed } from "../fixtures"

// What a screen reader announces, recorded by a virtual screen reader that
// follows focus and the accessibility tree. Every implementation must say the same.

type Virtual = {
  start: (options: { container: Element }) => Promise<void>
  stop: () => Promise<void>
  spokenPhraseLog: () => Promise<string[]>
}

async function record(page: Page, steps: () => Promise<void>) {
  await page.waitForFunction(() => "virtual" in window)
  await page.evaluate(() =>
    (window as unknown as { virtual: Virtual }).virtual.start({
      container: document.body,
    })
  )
  await steps()
  const log = await page.evaluate(() =>
    (window as unknown as { virtual: Virtual }).virtual.spokenPhraseLog()
  )
  await page.evaluate(() =>
    (window as unknown as { virtual: Virtual }).virtual.stop()
  )
  return log
}

// The fixture's status region and an explicit aria-disabled="false" add phrases
// that say nothing about the accordion.
const withoutNoise = (log: string[]) =>
  log
    .filter((phrase) => !phrase.startsWith("polite:"))
    .map((phrase) => phrase.replace(", not disabled", ""))

// Tabs through the triggers, expands one, moves into its panel and back.
test("announcements while using the accordion with a keyboard", async ({
  page,
  open,
  tab,
}) => {
  await open("accordion", { sr: "" })
  const log = await record(page, async () => {
    await page.getByRole("button", { name: "Before" }).focus()
    await tab()
    await expect(triggerNamed(page, "Shipping")).toBeFocused()
    await tab()
    await expect(triggerNamed(page, "Returns")).toBeFocused()
    await page.keyboard.press("Enter")
    await expect(regionNamed(page, "Returns")).toBeVisible()
    await tab()
    await expect(
      page.getByRole("textbox", { name: "Order number" })
    ).toBeFocused()
    await tab()
    await expect(triggerNamed(page, "Warranty")).toBeFocused()
    await tab({ shift: true })
    await tab({ shift: true })
    await expect(triggerNamed(page, "Returns")).toBeFocused()
    await page.keyboard.press(" ")
    await expect(triggerNamed(page, "Returns")).toHaveAttribute(
      "aria-expanded",
      "false"
    )
  })
  expect(withoutNoise(log)).toEqual([
    "document",
    "button, Before",
    "button, Shipping, 1 control, expanded",
    "button, Returns, not expanded",
    "textbox, Order number",
    "button, Warranty, disabled, not expanded",
    "textbox, Order number",
    "button, Returns, 1 control, expanded",
  ])
})
