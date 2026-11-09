import type { Page } from "@playwright/test"
import { buttonNamed, expect, test } from "../fixtures"

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

// The fixture's status regions add phrases that say nothing about the components.
const withoutNoise = (log: string[]) =>
  log
    .filter((phrase) => !phrase.startsWith("polite:"))
    .map((phrase) => phrase.replace(", not disabled", ""))

// Tabs onto the toggle and presses it, into the alignment group and along it,
// into the formatting group, and onto a button that's disabled but focusable.
test("announcements while using toggles with a keyboard", async ({
  page,
  open,
  tab,
}) => {
  await open("toggle", { sr: "" })
  const log = await record(page, async () => {
    await page.getByRole("button", { name: "Before" }).focus()
    await tab()
    await expect(buttonNamed(page, "Bookmark")).toBeFocused()
    await page.keyboard.press(" ")
    await expect(buttonNamed(page, "Bookmark")).toHaveAttribute(
      "aria-pressed",
      "true"
    )
    await tab()
    await expect(buttonNamed(page, "Left")).toBeFocused()
    await page.keyboard.press("ArrowRight")
    await expect(buttonNamed(page, "Center")).toBeFocused()
    await tab()
    await expect(buttonNamed(page, "Bold")).toBeFocused()
    await buttonNamed(page, "Reset").focus()
    await tab()
    await expect(buttonNamed(page, "Archive")).toBeFocused()
  })
  expect(withoutNoise(log)).toEqual([
    "document",
    "button, Before",
    "button, Bookmark, not pressed",
    "button, Left, pressed",
    "button, Center, not pressed",
    "button, Bold, pressed",
    "button, Reset",
    "button, Archive, disabled",
  ])
})
