import type { Page } from "@playwright/test"
import { collapsibleFixture as fixture } from "../fixtures/collapsible"
import { expect, test } from "../fixtures"

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
// that say nothing about the collapsible.
const withoutNoise = (log: string[]) =>
  log
    .filter((phrase) => !phrase.startsWith("polite:"))
    .map((phrase) => phrase.replace(", not disabled", ""))

test("announcements while using the collapsible with a keyboard", async ({
  page,
  open,
  tab,
}) => {
  await open("collapsible", { sr: "" })
  const trigger = page.getByRole("button", {
    name: fixture.trigger,
    exact: true,
  })
  const log = await record(page, async () => {
    await page.getByRole("button", { name: "Before" }).focus()
    await tab()
    await expect(trigger).toBeFocused()
    await page.keyboard.press("Enter")
    await expect(page.getByText(fixture.content)).toBeVisible()
    await tab()
    await expect(
      page.getByRole("textbox", { name: fixture.field })
    ).toBeFocused()
    await tab({ shift: true })
    await expect(trigger).toBeFocused()
    await page.keyboard.press(" ")
    await expect(trigger).toHaveAttribute("aria-expanded", "false")
  })
  expect(withoutNoise(log)).toEqual([
    "document",
    "button, Before",
    `button, ${fixture.trigger}, not expanded`,
    `textbox, ${fixture.field}`,
    `button, ${fixture.trigger}, 1 control, expanded`,
  ])
})
