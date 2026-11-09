import type { Page } from "@playwright/test"
import { toastRole } from "../fixtures/toast"
import { expect, test } from "../fixtures"
import type { FixtureToast } from "../fixtures/toast"

const role = () => toastRole

// In right-to-left pages, `start` and `end` follow the writing direction:
// a region aligned to the end sits on the left and swipes to the left.
const toastNamed = (page: Page, name: string) =>
  page.getByRole(role(), { name })
const show = (page: Page, options: FixtureToast) =>
  page.evaluate(
    (options) =>
      (
        window as unknown as { showToast: (o: FixtureToast) => string }
      ).showToast(options),
    options
  )

async function drag(page: Page, name: string, dx: number) {
  const box = (await toastNamed(page, name).boundingBox())!
  const x = box.x + box.width - 4
  const y = box.y + 4
  await page.mouse.move(x, y)
  await page.mouse.down()
  for (let step = 1; step <= 8; step++) {
    await page.mouse.move(x + (dx * step) / 8, y)
  }
  await page.mouse.up()
}

test(
  "a region aligned to the end sits on the left",
  { tag: "@enhancement" },
  async ({ page, open }) => {
    await open("toast", { dir: "rtl" })
    await show(page, { title: "Saved" })
    const box = (await toastNamed(page, "Saved").boundingBox())!
    expect(box.x).toBeLessThan(100)
  }
)

test(
  "a toast aligned to the end swipes to the left, and a swipe to the right snaps back",
  { tag: "@enhancement" },
  async ({ page, open }) => {
    await open("toast", { dir: "rtl" })
    await show(page, {
      title: "Saved",
      duration: Infinity as unknown as number,
    })
    await drag(page, "Saved", 120)
    await expect(toastNamed(page, "Saved")).toBeVisible()
    await drag(page, "Saved", -120)
    await expect(toastNamed(page, "Saved")).toHaveCount(0)
  }
)
