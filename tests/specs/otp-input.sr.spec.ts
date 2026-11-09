import { expect, test } from "../fixtures"

// What a screen reader announces, recorded by a virtual screen reader that
// follows focus and the accessibility tree.

type Virtual = {
  start: (options: { container: Element }) => Promise<void>
  stop: () => Promise<void>
  spokenPhraseLog: () => Promise<string[]>
}

// The fixture's status regions add phrases that say nothing about the components.
const withoutNoise = (log: string[]) =>
  log.filter((phrase) => !phrase.startsWith("polite:"))

test("the code is announced once, as one field, not slot by slot @enhancement", async ({
  page,
  open,
  tab,
}) => {
  await open("otp-input", { sr: "" })
  await page.waitForFunction(() => "virtual" in window)
  await page.evaluate(() =>
    (window as unknown as { virtual: Virtual }).virtual.start({
      container: document.body,
    })
  )
  await page.getByRole("button", { name: "Before" }).focus()
  await tab()
  await page.keyboard.type("123456")
  await tab()
  const log = await page.evaluate(() =>
    (window as unknown as { virtual: Virtual }).virtual.spokenPhraseLog()
  )
  await page.evaluate(() =>
    (window as unknown as { virtual: Virtual }).virtual.stop()
  )
  expect(withoutNoise(log)).toEqual([
    "document",
    "button, Before",
    "textbox, Verification code",
    "button, Verify",
  ])
})
