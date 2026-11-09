import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"

// What a screen reader announces, recorded by a virtual screen reader that
// follows focus, aria-activedescendant and the accessibility tree. Every
// implementation must say the same.

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

test("announcements while typing and choosing with a keyboard", async ({
  page,
  open,
  tab,
}) => {
  await open("autocomplete", { sr: "" })
  const input = page.getByRole("combobox", { name: "Fruit" })
  const log = await record(page, async () => {
    await page.getByRole("button", { name: "Before" }).focus()
    await tab()
    await expect(input).toBeFocused()
    await page.keyboard.type("lem")
    await expect(page.getByRole("option", { name: "Lemon" })).toBeVisible()
    await page.keyboard.press("ArrowDown")
    await expect(input).toHaveAttribute("aria-activedescendant", /.+/)
    await page.keyboard.press("Enter")
    await expect(input).toHaveValue("Lemon")
  })
  // The fixture's own status regions aren't part of the contract, and neither
  // are live regions that empty out, which say nothing.
  expect(
    log.filter(
      (phrase) =>
        !/^polite: (Last action|Submitted|value:|submit:|$)/.test(phrase)
    )
  ).toEqual([
    "document",
    "button, Before",
    "combobox, Fruit, has popup listbox, not expanded, autocomplete in list",
  ])
})
