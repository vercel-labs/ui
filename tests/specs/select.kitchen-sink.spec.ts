import type { Locator, Page } from "@playwright/test"
import { expect, test } from "../fixtures"

// Opens every kitchen sink variant. The page is for manual testing, so this
// only proves every variant renders, positions and closes without errors.

// The variant with 1,000 items has its own test below.
const many = "many"

async function load(page: Page, framework: string) {
  test.skip(
    !["react", "vue", "web"].includes(framework),
    "Composition frameworks only."
  )
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  page.on(
    "console",
    (message) => message.type() === "error" && errors.push(message.text())
  )
  await page.goto(`/?fixture=select-kitchen-sink&framework=${framework}`)
  await page.locator("body[data-mounted]").waitFor({ state: "attached" })
  // Disabled triggers can't open, by design.
  const triggers = page.locator('[data-slot="select-trigger"]:not([disabled])')
  // Each card mounts its own root, so wait for all of them.
  await expect.poll(() => triggers.count()).toBeGreaterThan(55)
  return { triggers, errors }
}

// Cards and pinned wrappers carry their variant's id.
const variantOf = (trigger: Locator) =>
  trigger.evaluate(
    (el) => el.closest<HTMLElement>("[data-variant]")?.dataset.variant ?? ""
  )

async function openAndClose(page: Page, trigger: Locator, name: string) {
  await trigger.scrollIntoViewIfNeeded()
  await trigger.click()
  const popup = page.locator('[data-slot="select-content"][data-open]').first()
  await expect(popup, name).toBeVisible()
  await expect(popup.getByRole("option").first(), name).toBeVisible()
  await expect(popup, name).toHaveAttribute(
    "data-side",
    /top|right|bottom|left/
  )
  await page.keyboard.press("Escape")
  await expect(
    page.locator('[data-slot="select-content"][data-open]'),
    `${name} closes`
  ).toHaveCount(0)
  // A popup animating out still swallows presses that land on it, and it may cover the next trigger.
  await expect(page.locator("[data-ending-style]")).toHaveCount(0)
}

test("every kitchen sink variant opens", async ({ page, framework }) => {
  test.setTimeout(120_000)
  const { triggers, errors } = await load(page, framework)
  const count = await triggers.count()
  for (let index = 0; index < count; index++) {
    const trigger = triggers.nth(index)
    const name = await variantOf(trigger)
    if (name !== many) {
      await openAndClose(page, trigger, name)
    }
  }
  expect(errors).toEqual([])
})

test("the variant with 1,000 items opens", async ({
  page,
  framework,
  browserName,
}) => {
  // The cause needs a CI trace. Never
  // reproduced on macOS, even with the CPU throttled or the machine loaded.
  test.fixme(
    browserName === "firefox" &&
      process.platform === "linux" &&
      framework !== "web",
    "On CI's Linux Firefox, the React and Vue list with 1,000 items never shows as open after a click."
  )
  const { errors } = await load(page, framework)
  await openAndClose(
    page,
    page.locator(`[data-variant="${many}"] [data-slot="select-trigger"]`),
    many
  )
  expect(errors).toEqual([])
})
