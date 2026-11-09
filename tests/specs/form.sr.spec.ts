import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"
import { textbox } from "./form.helpers"

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
  log.filter((phrase) => !phrase.startsWith("polite:"))

test("announcements while tabbing into the form", async ({
  page,
  open,
  tab,
}) => {
  await open("form", { sr: "" })
  const log = await record(page, async () => {
    await page.getByRole("button", { name: "Before" }).focus()
    await tab()
    await expect(textbox(page, "Username")).toBeFocused()
    await tab()
    await expect(textbox(page, "Bio")).toBeFocused()
  })
  expect(withoutNoise(log)).toEqual([
    "document",
    "button, Before",
    "textbox, Username, Letters and numbers, at least 3., required",
    "textbox, Bio, A few words about you.",
  ])
})
