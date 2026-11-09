import type { Page } from "@playwright/test"
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

const item = (page: Page, name: string) =>
  page.getByRole("treeitem", { name, exact: true })

// The fixture's status region adds phrases that say nothing about the tree.
const withoutNoise = (log: string[]) =>
  log.filter((phrase) => !phrase.startsWith("polite:"))

// Tabs into the tree, expands a branch, steps into it and back out.
test("announcements while using the tree with a keyboard", async ({
  page,
  open,
  tab,
}) => {
  await open("tree", { sr: "" })
  const log = await record(page, async () => {
    await page.getByRole("button", { name: "Before" }).focus()
    await tab()
    await expect(item(page, "src")).toBeFocused()
    await page.keyboard.press("ArrowRight")
    await expect(item(page, "src")).toHaveAttribute("aria-expanded", "true")
    await page.keyboard.press("ArrowRight")
    await expect(item(page, "components")).toBeFocused()
    await page.keyboard.press("ArrowDown")
    await expect(item(page, "index.ts")).toBeFocused()
    await page.keyboard.press("ArrowLeft")
    await expect(item(page, "src")).toBeFocused()
  })
  expect(withoutNoise(log)).toEqual([
    "document",
    "button, Before",
    "treeitem, src, not expanded, level 1, position 1, not selected, set size 3",
    "treeitem, components, not expanded, level 2, position 1, not selected, set size 3",
    "treeitem, index.ts, level 2, position 2, not selected, set size 3",
    "treeitem, src, expanded, level 1, position 1, not selected, set size 3",
  ])
})

// VoiceOver on macOS reads nothing when the focused item expands, so the tree says it.
test("expanding the focused item is announced on Apple platforms", async ({
  page,
  open,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, "platform", { get: () => "MacIntel" })
  )
  await open("tree")
  const announced = () =>
    page.locator("[data-ui-sdk-announcer]:not([role=alert])").textContent()
  await item(page, "src").focus()
  await page.keyboard.press("ArrowRight")
  await expect(item(page, "src")).toHaveAttribute("aria-expanded", "true")
  await expect.poll(announced).toBe("Expanded")
  await page.keyboard.press("ArrowLeft")
  await expect.poll(announced).toBe("Collapsed")
})

test("nothing is announced elsewhere, where screen readers read the change", async ({
  page,
  open,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, "platform", { get: () => "Win32" })
  )
  await open("tree")
  await item(page, "src").focus()
  await page.keyboard.press("ArrowRight")
  await expect(item(page, "src")).toHaveAttribute("aria-expanded", "true")
  await page.waitForTimeout(200)
  await expect(
    page.locator("[data-ui-sdk-announcer]:not([role=alert])")
  ).toHaveCount(0)
})
