import { expect, lastAction, test } from "../fixtures"
import { drag, expectShown, indicator, nextButton, slideLink } from "./carousel.helpers"

// Right to left, the slides run from right to left: the next one is on the left.
test.describe("right to left", () => {
  test.beforeEach(async ({ open }) => {
    await open("carousel", { dir: "rtl" })
  })

  test("Next shows the next slide, which comes in from the left", async ({ page }) => {
    const first = await slideLink(page, 0).boundingBox()
    const second = await slideLink(page, 1).boundingBox()
    expect(second!.x).toBeLessThan(first!.x)
    await nextButton(page).click()
    await expectShown(page, 1)
    expect(await lastAction(page)).toBe("2")
  })

  test("dragging to the right shows the next slide", async ({ page }) => {
    await drag(page, 0, 200)
    await expectShown(page, 1)
  })

  test("with loop, dragging to the left from the first slide shows the last", async ({ page, open }) => {
    await open("carousel", { dir: "rtl", loop: "" })
    await drag(page, 0, -200)
    await expectShown(page, 4)
    expect(await lastAction(page)).toBe("5")
  })

  test("ArrowLeft shows the next slide and ArrowRight the previous @enhancement", async ({ page }) => {
    await slideLink(page, 0).focus()
    await page.keyboard.press("ArrowLeft")
    await expectShown(page, 1)
    await page.keyboard.press("ArrowRight")
    await expectShown(page, 0)
  })

  test("ArrowLeft moves to the next indicator @enhancement", async ({ page }) => {
    await indicator(page, 1).focus()
    await page.keyboard.press("ArrowLeft")
    await expect(indicator(page, 2)).toBeFocused()
    await expectShown(page, 1)
  })

  test("Next and dragging follow the page when it turns left to right after mount", async ({ page }) => {
    await page.evaluate(() => (document.documentElement.dir = "ltr"))
    await nextButton(page).click()
    await expectShown(page, 1)
    await drag(page, 1, -200)
    await expectShown(page, 2)
  })

  test("a carousel with three slides to a view pages from the right @enhancement", async ({ page, open }) => {
    await open("carousel", { dir: "rtl", "per-view": "3" })
    await expect(page.getByRole("tab")).toHaveCount(3)
    await nextButton(page).click()
    await expectShown(page, 1, 2, 3)
    await indicator(page, 3).click()
    await expectShown(page, 2, 3, 4)
    expect(await lastAction(page)).toBe("3")
  })
})

test("Next and dragging follow the page when it turns right to left after mount", async ({ page, open }) => {
  await open("carousel")
  await page.evaluate(() => (document.documentElement.dir = "rtl"))
  await nextButton(page).click()
  await expectShown(page, 1)
  await drag(page, 1, 200)
  await expectShown(page, 2)
})

test("a controlled page follows the page when it turns right to left after mount", async ({
  page,
  open,
  framework,
}) => {
  test.skip(!["react", "vue"].includes(framework), "Only the React and Vue fixtures control the page.")
  await open("carousel", { controlled: "" })
  await page.evaluate(() => (document.documentElement.dir = "rtl"))
  await page.getByRole("button", { name: "Show page 3 by prop" }).click()
  await expectShown(page, 2)
})

test("Next in a looping carousel follows the page when it turns right to left after mount", async ({
  page,
  open,
}) => {
  await open("carousel", { loop: "" })
  await page.evaluate(() => (document.documentElement.dir = "rtl"))
  await nextButton(page).click()
  await expectShown(page, 1)
})
