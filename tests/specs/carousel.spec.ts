import { carouselFixture } from "../fixtures/carousel"
import { expect, lastAction, test } from "../fixtures"
import {
  drag,
  expectShown,
  nextButton,
  previousButton,
  settled,
  slideLink,
  watchBackward,
} from "./carousel.helpers"

// Behavior follows the WAI-ARIA carousel pattern:
// https://www.w3.org/WAI/ARIA/apg/patterns/carousel/

test.describe("structure", () => {
  test.beforeEach(async ({ open }) => {
    await open("carousel")
  })

  test("the carousel is a named region described as a carousel", async ({
    page,
  }) => {
    const region = page.getByRole("region", { name: carouselFixture.label })
    await expect(region).toHaveAttribute("aria-roledescription", "carousel")
  })

  test("each slide is a group described as a slide", async ({ page }) => {
    for (let index = 0; index < carouselFixture.slides.length; index++) {
      const slide = slideLink(page, index).locator(
        "xpath=ancestor::*[@role='group'][1]"
      )
      await expect(slide).toHaveAttribute("aria-roledescription", "slide")
    }
  })

  test("the first slide shows first", async ({ page }) => {
    await expectShown(page, 0)
  })
})

test.describe("previous and next", () => {
  test.beforeEach(async ({ open }) => {
    await open("carousel")
  })

  test("Next shows the next slide", async ({ page }) => {
    await nextButton(page).click()
    await expectShown(page, 1)
    expect(await lastAction(page)).toBe("2")
  })

  test("Previous shows the previous slide", async ({ page }) => {
    await nextButton(page).click()
    await expectShown(page, 1)
    await previousButton(page).click()
    await expectShown(page, 0)
    expect(await lastAction(page)).toBe("1")
  })

  test("Previous is disabled on the first slide and Next on the last", async ({
    page,
  }) => {
    await expect(previousButton(page)).toBeDisabled()
    await expect(nextButton(page)).toBeEnabled()
    for (let index = 1; index < carouselFixture.slides.length; index++) {
      await nextButton(page).click()
      await expectShown(page, index)
    }
    await expect(nextButton(page)).toBeDisabled()
    await expect(previousButton(page)).toBeEnabled()
  })

  test("Next on the last slide does nothing", async ({ page }) => {
    for (let index = 1; index < carouselFixture.slides.length; index++) {
      await nextButton(page).click()
      await expectShown(page, index)
    }
    await nextButton(page).click({ force: true })
    await settled(page)
    await expectShown(page, 4)
    expect(await lastAction(page)).toBe("5")
  })

  test("Next and Previous are buttons that don't submit a form", async ({
    page,
  }) => {
    await expect(nextButton(page)).toHaveAttribute("type", "button")
    await expect(previousButton(page)).toHaveAttribute("type", "button")
  })
})

test.describe("keyboard", () => {
  test.beforeEach(async ({ open }) => {
    await open("carousel")
  })

  test("ArrowRight in a slide shows the next slide, and ArrowLeft the previous", async ({
    page,
  }) => {
    await slideLink(page, 0).focus()
    await page.keyboard.press("ArrowRight")
    await expectShown(page, 1)
    expect(await lastAction(page)).toBe("2")
    await page.keyboard.press("ArrowLeft")
    await expectShown(page, 0)
    expect(await lastAction(page)).toBe("1")
  })

  test("ArrowLeft on the first slide stays there", async ({ page }) => {
    await slideLink(page, 0).focus()
    await page.keyboard.press("ArrowLeft")
    await settled(page)
    await expectShown(page, 0)
    expect(await lastAction(page)).toBe("")
  })
})

test.describe("pages", () => {
  test("with three slides to a view, Next moves one slide, and the last page shows the last three", async ({
    page,
    open,
  }) => {
    await open("carousel", { "per-view": "3" })
    await expectShown(page, 0, 1, 2)
    await nextButton(page).click()
    await expectShown(page, 1, 2, 3)
    await nextButton(page).click()
    await expectShown(page, 2, 3, 4)
    await expect(nextButton(page)).toBeDisabled()
  })

  test("three slides to a page move three at a time", async ({
    page,
    open,
  }) => {
    await open("carousel", { "per-view": "3", "slides-per-page": "3" })
    await nextButton(page).click()
    await expectShown(page, 2, 3, 4)
    expect(await lastAction(page)).toBe("2")
    await expect(nextButton(page)).toBeDisabled()
  })

  test("auto pages fit as many slides as show", async ({ page, open }) => {
    await open("carousel", { "per-view": "2", "slides-per-page": "auto" })
    await expectShown(page, 0, 1)
    await nextButton(page).click()
    await expectShown(page, 2, 3)
    await nextButton(page).click()
    await expectShown(page, 3, 4)
  })

  test("it can start on another page", async ({ page, open }) => {
    await open("carousel", { "default-page": "3" })
    await expectShown(page, 2)
    await expect(previousButton(page)).toBeEnabled()
  })

  test("a controller pages it from outside", async ({ page, open }) => {
    await open("carousel")
    await page.getByRole("button", { name: "Show page 4" }).click()
    await expectShown(page, 3)
    expect(await lastAction(page)).toBe("4")
  })
})

test.describe("rest", () => {
  test.beforeEach(async ({ open }) => {
    await open("carousel")
  })

  test("it reports the page once the slides come to rest", async ({ page }) => {
    const rested = page.getByLabel("Rested on")
    await nextButton(page).click()
    await expect(rested).toHaveText("2")
    await drag(page, 1, -200)
    await expect(rested).toHaveText("3")
  })
})

test.describe("loop", () => {
  test.beforeEach(async ({ open }) => {
    await open("carousel", { loop: "" })
  })

  test("Next on the last slide shows the first", async ({ page }) => {
    for (let index = 1; index < carouselFixture.slides.length; index++) {
      await nextButton(page).click()
      await expectShown(page, index)
    }
    await nextButton(page).click()
    await expectShown(page, 0)
    expect(await lastAction(page)).toBe("1")
  })

  test("Previous on the first slide shows the last", async ({ page }) => {
    await previousButton(page).click()
    await expectShown(page, 4)
    expect(await lastAction(page)).toBe("5")
  })

  test("Previous and Next are never disabled", async ({ page }) => {
    await expect(previousButton(page)).toBeEnabled()
    await expect(nextButton(page)).toBeEnabled()
  })

  test("Next on the last slide carries on the same way to the first", async ({
    page,
  }) => {
    await previousButton(page).click()
    await expectShown(page, 4)
    await settled(page)
    const backward = await watchBackward(page)
    await nextButton(page).click()
    await expectShown(page, 0)
    // Seamless: the first slide comes in after the last, rather than the
    // carousel running back over every slide.
    expect(await backward()).toBeLessThan(12)
  })

  test("pressing Next quickly keeps going forward, round past the last slide", async ({
    page,
  }) => {
    await settled(page)
    const backward = await watchBackward(page)
    // Seven presses from the first slide of five land on the third.
    for (let press = 0; press < 7; press++) {
      await nextButton(page).click()
    }
    await expectShown(page, 2)
    expect(await lastAction(page)).toBe("3")
    expect(await backward()).toBeLessThan(12)
  })

  test("a mouse drag back from the first slide shows the last", async ({
    page,
  }) => {
    await drag(page, 0, 200)
    await expectShown(page, 4)
    expect(await lastAction(page)).toBe("5")
  })
  test("with three slides to a view, the last slide shows before the first", async ({
    page,
    open,
  }) => {
    await open("carousel", { loop: "", "per-view": "3" })
    await previousButton(page).click()
    await expectShown(page, 4, 0, 1)
    expect(await lastAction(page)).toBe("5")
    await nextButton(page).click()
    await nextButton(page).click()
    await expectShown(page, 1, 2, 3)
  })

  test("a vertical carousel drags down from the first slide to the last", async ({
    page,
    open,
  }) => {
    await open("carousel", { loop: "", orientation: "vertical" })
    await drag(page, 0, 120, { axis: "y" })
    await expectShown(page, 4)
  })
})

test.describe("dragging", () => {
  test.beforeEach(async ({ open }) => {
    await open("carousel")
  })

  test("dragging the slides with a mouse shows the next one", async ({
    page,
  }) => {
    await drag(page, 0, -200)
    await expectShown(page, 1)
    expect(await lastAction(page)).toBe("2")
  })

  test("a short, slow drag settles back on the same slide", async ({
    page,
  }) => {
    await drag(page, 0, -40, { steps: 10, stepDelay: 30 })
    await page.waitForTimeout(100)
    await settled(page)
    await expectShown(page, 0)
    expect(await lastAction(page)).toBe("")
  })

  test("dragging back shows the previous slide", async ({ page }) => {
    await nextButton(page).click()
    await expectShown(page, 1)
    await drag(page, 1, 200)
    await expectShown(page, 0)
  })

  test("a drag that starts on a link doesn't follow it", async ({ page }) => {
    const box = await slideLink(page, 0).boundingBox()
    if (!box) {
      throw new Error("The link isn't laid out.")
    }
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
    await page.mouse.down()
    for (let step = 1; step <= 12; step++) {
      await page.mouse.move(
        box.x + box.width / 2 - step * 16,
        box.y + box.height / 2
      )
    }
    await page.mouse.up()
    await expectShown(page, 1)
    expect(new URL(page.url()).searchParams.has("product")).toBe(false)
  })

  test("without dragging, a drag moves nothing", async ({ page, open }) => {
    await open("carousel", { "no-drag": "" })
    await drag(page, 0, -200)
    await settled(page)
    await expectShown(page, 0)
    expect(await lastAction(page)).toBe("")
  })
})

test.describe("more", () => {
  test("a vertical carousel drags up and down", async ({ page, open }) => {
    await open("carousel", { orientation: "vertical" })
    await drag(page, 0, -90, { axis: "y" })
    await expectShown(page, 1)
  })

  test("pressing keys with no waits lands on the right slide", async ({
    page,
    open,
  }) => {
    await open("carousel")
    await slideLink(page, 0).focus()
    await page.keyboard.press("ArrowRight")
    await page.keyboard.press("ArrowRight")
    await page.keyboard.press("ArrowRight")
    await expectShown(page, 3)
    expect(await lastAction(page)).toBe("4")
  })

  test("a fast flick moves one page, not more", async ({ page, open }) => {
    await open("carousel")
    // Even steps: a few uneven synthetic moves can fit a velocity that points back.
    await drag(page, 0, -280, { steps: 6 })
    await expectShown(page, 1)
  })

  test("the current slide stays in view when the slides change size", async ({
    page,
    open,
  }) => {
    await open("carousel", { "per-view": "3" })
    await nextButton(page).click()
    await nextButton(page).click()
    await expectShown(page, 2, 3, 4)
    // A stylesheet, since frameworks write their own inline styles back.
    await page.addStyleTag({
      content: ".carousel-slide { flex-basis: 100% !important }",
    })
    await expectShown(page, 2)
  })
})
