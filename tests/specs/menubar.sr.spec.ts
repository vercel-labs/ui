import type { Page } from "@playwright/test"
import { expect, expectFocus, menuNamed, test } from "../fixtures"
import { enter } from "./menubar.helpers"

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

const withoutNoise = (log: string[]) =>
  log
    .filter((phrase) => !phrase.startsWith("polite:"))
    .map((phrase) => phrase.replace(", not disabled", ""))

// Tabs onto the menubar, along it, opens a menu, moves through it and closes it.
test("announcements while using the menubar with a keyboard", async ({
  page,
  open,
  tab,
}) => {
  await open("menubar", { sr: "" })
  const log = await record(page, async () => {
    await enter(page, tab)
    await page.keyboard.press("ArrowRight")
    await expectFocus(page, "Edit")
    await page.keyboard.press("Enter")
    await expect(menuNamed(page, "Edit")).toBeVisible()
    await expectFocus(page, "Undo")
    await page.keyboard.press("ArrowDown")
    await expectFocus(page, "Redo")
    await page.keyboard.press("Escape")
    await expectFocus(page, "Edit")
  })
  expect(withoutNoise(log)).toEqual([
    "document",
    "button, Before",
    "menuitem, File, not expanded, has popup menu, position 1, set size 5",
    "menuitem, Edit, not expanded, has popup menu, position 2, set size 5",
    "menuitem, Undo, position 1, set size 3",
    "menuitem, Redo, disabled, position 2, set size 3",
    "menuitem, Edit, not expanded, has popup menu, position 2, set size 5",
  ])
})
