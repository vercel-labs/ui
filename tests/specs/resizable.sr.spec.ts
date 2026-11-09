import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"
import { sidebarHandle } from "./resizable.helpers"

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

// The fixture's status regions add phrases that say nothing about the panels.
const withoutNoise = (log: string[]) =>
  log.filter((phrase) => !phrase.startsWith("polite:"))

test("announcements while moving to a handle with a keyboard", async ({
  page,
  open,
  tab,
}) => {
  await open("resizable", { sr: "" })
  await expect(sidebarHandle(page)).toHaveAttribute("aria-valuenow", "25")
  const log = await record(page, async () => {
    await page.getByRole("button", { name: "Sidebar action" }).focus()
    await tab()
    await expect(sidebarHandle(page)).toBeFocused()
  })
  expect(withoutNoise(log)).toEqual([
    "document",
    "button, Sidebar action",
    "separator, Resize sidebar, orientated vertically, max value 40, min value 0, 1 control, 25",
  ])
})
