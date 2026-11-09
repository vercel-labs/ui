import type { Page } from "@playwright/test"
import { buttonNamed, expect, test } from "../fixtures"
import { passwordInputFixture } from "../fixtures/password-input"

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
// The toggle's aria-controls ("1 control") has its own enhancement spec.
const withoutNoise = (log: string[]) =>
  log
    .filter((phrase) => !phrase.startsWith("polite:"))
    .map((phrase) =>
      phrase.replace(", not disabled", "").replace(", 1 control", "")
    )

const { password } = passwordInputFixture

// Focuses the field, tabs on to the toggle and presses it, back to the field,
// which is a text field now, and on to the toggle again, which is pressed.
test("announcements while showing and hiding a password with a keyboard", async ({
  page,
  open,
  tab,
}) => {
  await open("password-input", { sr: "" })
  const field = page.getByLabel(password.label, { exact: true })
  const toggle = buttonNamed(page, password.toggle)
  const log = await record(page, async () => {
    await field.focus()
    await tab()
    await expect(toggle).toBeFocused()
    await page.keyboard.press(" ")
    await expect(toggle).toHaveAttribute("aria-pressed", "true")
    await tab({ shift: true })
    await expect(field).toBeFocused()
    await tab()
    await expect(toggle).toBeFocused()
  })
  expect(withoutNoise(log)).toEqual([
    "document",
    // A password field has no role of its own, so only its name and description are read.
    `${password.label}, ${password.description}`,
    `button, ${password.toggle}, not pressed`,
    `textbox, ${password.label}, ${password.description}`,
    `button, ${password.toggle}, pressed`,
  ])
})
