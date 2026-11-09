import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"
import { toastFixture, toastRole } from "../fixtures/toast"

const role = () => toastRole

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

const { basic } = toastFixture
const toastNamed = (page: Page, name: string) =>
  page.getByRole(role(), { name })

test(
  "announcements while reaching a toast with F6 and leaving it",
  { tag: "@enhancement" },
  async ({ page, open, tab }) => {
    await open("toast", { sr: "" })
    await page.getByRole("button", { name: basic.trigger }).click()
    await expect(toastNamed(page, basic.title)).toBeVisible()
    // The toast is announced a moment after it shows. Waiting for that keeps
    // it out of the recording, which is only about reaching the toast.
    await expect(page.locator('[data-ui-sdk-announcer=""]')).toHaveText(
      `${basic.title}. ${basic.description}`
    )
    const log = await record(page, async () => {
      await page.getByRole("button", { name: "Before" }).focus()
      await page.keyboard.press("F6")
      await expect(toastNamed(page, basic.title)).toBeFocused()
      await tab()
      await expect(
        page.getByRole("button", { name: basic.action })
      ).toBeFocused()
      await page.keyboard.press("F6")
      await expect(page.getByRole("button", { name: "Before" })).toBeFocused()
    })
    expect(log).toEqual([
      "document",
      "button, Before",
      "listitem, Event created, Sunday, December 3 at 9:00 AM, level 1, position 1, set size 1",
      "button, Undo",
      "button, Before",
    ])
  }
)
