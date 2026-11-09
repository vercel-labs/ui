import { carouselFixture } from "../fixtures/carousel"
import { expect, lastAction, test } from "../fixtures"
import {
  drag,
  expectShown,
  indicator,
  lastReason,
  nextButton,
  playToggle,
  previousButton,
  settled,
  slideLink,
} from "./carousel.helpers"

// Behavior past the WAI-ARIA carousel pattern, tagged `@enhancement`.

test.describe("focus @enhancement", () => {
  test.beforeEach(async ({ open }) => {
    await open("carousel")
  })

  test("Next keeps focus when it reaches the last slide @enhancement", async ({
    page,
    tab,
  }) => {
    await nextButton(page).focus()
    for (let index = 1; index < carouselFixture.slides.length; index++) {
      await page.keyboard.press("Enter")
      await expectShown(page, index)
    }
    await expect(nextButton(page)).toBeFocused()
    await expect(nextButton(page)).toHaveAttribute("aria-disabled", "true")
    await tab({ shift: true })
    await expect(previousButton(page)).toBeFocused()
  })

  test("Tab reaches only the slides in view @enhancement", async ({
    page,
    tab,
  }) => {
    await page.getByRole("button", { name: "Before" }).focus()
    await tab()
    await expect(slideLink(page, 0)).toBeFocused()
    await tab()
    await expect(previousButton(page)).toBeFocused()
    await nextButton(page).click()
    await expectShown(page, 1)
    await page.getByRole("button", { name: "Before" }).focus()
    await tab()
    await expect(slideLink(page, 1)).toBeFocused()
  })

  test("slides out of view are hidden from assistive technology @enhancement", async ({
    page,
  }) => {
    await expect(page.getByRole("link")).toHaveCount(1)
    await expect(
      page.getByRole("link", { name: carouselFixture.slides[0].link })
    ).toBeVisible()
    await expect(page.getByRole("group", { name: "1 of 5" })).toBeVisible()
    await expect(page.getByRole("group", { name: "2 of 5" })).toHaveCount(0)
  })

  test("arrow keys bring the next slide in and move focus to it @enhancement", async ({
    page,
  }) => {
    await slideLink(page, 0).focus()
    await page.keyboard.press("ArrowRight")
    await expectShown(page, 1)
    await expect(page.getByRole("group", { name: "2 of 5" })).toBeFocused()
    await page.keyboard.press("ArrowRight")
    await expectShown(page, 2)
    await expect(page.getByRole("group", { name: "3 of 5" })).toBeFocused()
  })

  test("a text field in a slide keeps its arrow keys @enhancement", async ({
    page,
  }) => {
    // Next rather than an indicator, which some carousels don't have.
    await nextButton(page).click()
    await nextButton(page).click()
    await expectShown(page, 2)
    const field = page.getByRole("textbox", { name: carouselFixture.field })
    await field.fill("Happy birthday")
    // One key at a time, since a carousel taking both would end up back here.
    // The last page change is checked too, since a transformed track moves
    // after `settled` sees the scroll position hold.
    await page.keyboard.press("ArrowLeft")
    await settled(page)
    await expectShown(page, 2)
    expect(await lastAction(page)).toBe("3")
    await page.keyboard.press("ArrowRight")
    await settled(page)
    await expectShown(page, 2)
    expect(await lastAction(page)).toBe("3")
    await expect(field).toBeFocused()
  })

  test("Home and End go to the first and last slide @enhancement", async ({
    page,
  }) => {
    await slideLink(page, 0).focus()
    await page.keyboard.press("End")
    await expectShown(page, 4)
    await page.keyboard.press("Home")
    await expectShown(page, 0)
  })
})

test.describe("orientation @enhancement", () => {
  test("a vertical carousel pages with ArrowDown and ArrowUp @enhancement", async ({
    page,
    open,
  }) => {
    await open("carousel", { orientation: "vertical" })
    await slideLink(page, 0).focus()
    await page.keyboard.press("ArrowDown")
    await expectShown(page, 1)
    await page.keyboard.press("ArrowUp")
    await expectShown(page, 0)
    await page.keyboard.press("ArrowRight")
    await settled(page)
    await expectShown(page, 0)
  })
})

test.describe("indicators @enhancement", () => {
  test.beforeEach(async ({ open }) => {
    await open("carousel")
  })

  test("indicators are a tablist with the current page selected @enhancement", async ({
    page,
  }) => {
    await expect(
      page.getByRole("tablist", { name: carouselFixture.indicators })
    ).toBeVisible()
    await expect(indicator(page, 1)).toHaveAttribute("aria-selected", "true")
    await nextButton(page).click()
    await expect(indicator(page, 2)).toHaveAttribute("aria-selected", "true")
    await expect(indicator(page, 1)).toHaveAttribute("aria-selected", "false")
  })

  test("pressing an indicator shows its page @enhancement", async ({
    page,
  }) => {
    await indicator(page, 4).click()
    await expectShown(page, 3)
    expect(await lastAction(page)).toBe("4")
    expect(await lastReason(page)).toBe("item-press")
  })

  test("arrow keys move between indicators and show their page @enhancement", async ({
    page,
    tab,
  }) => {
    await nextButton(page).focus()
    await tab()
    await expect(indicator(page, 1)).toBeFocused()
    await page.keyboard.press("ArrowRight")
    await expect(indicator(page, 2)).toBeFocused()
    await expectShown(page, 1)
    expect(await lastReason(page)).toBe("list-navigation")
    await page.keyboard.press("End")
    await expect(indicator(page, 5)).toBeFocused()
    await expectShown(page, 4)
    await page.keyboard.press("ArrowRight")
    await expect(indicator(page, 1)).toBeFocused()
    await expectShown(page, 0)
  })

  test("the indicators are one tab stop, on the current page @enhancement", async ({
    page,
    tab,
  }) => {
    await indicator(page, 3).click()
    await expectShown(page, 2)
    await nextButton(page).focus()
    await tab()
    await expect(indicator(page, 3)).toBeFocused()
    await tab()
    await expect(page.getByRole("button", { name: "After" })).toBeFocused()
  })

  test("an indicator controls the slides of its page @enhancement", async ({
    page,
  }) => {
    const controls = await indicator(page, 2).getAttribute("aria-controls")
    const slide = slideLink(page, 1).locator(
      "xpath=ancestor::*[@role='group'][1]"
    )
    expect(controls).toBe(await slide.getAttribute("id"))
  })

  test("indicators past the page count hide themselves @enhancement", async ({
    page,
    open,
  }) => {
    await open("carousel", { "per-view": "3" })
    await expect(page.getByRole("tab")).toHaveCount(3)
    await expect(indicator(page, 4)).toHaveCount(0)
    await indicator(page, 3).click()
    await expectShown(page, 2, 3, 4)
  })
})

test.describe("changes @enhancement", () => {
  test("a change can be canceled @enhancement", async ({ page, open }) => {
    await open("carousel", { cancel: "2" })
    await nextButton(page).click()
    await settled(page)
    await expectShown(page, 0)
    await indicator(page, 3).click()
    await expectShown(page, 2)
  })

  test("a canceled drag springs back @enhancement", async ({ page, open }) => {
    await open("carousel", { cancel: "2" })
    await drag(page, 0, -200)
    await page.waitForTimeout(100)
    await settled(page)
    await expectShown(page, 0)
  })

  test("every change says why @enhancement", async ({ page, open }) => {
    await open("carousel")
    await nextButton(page).click()
    await expectShown(page, 1)
    expect(await lastReason(page)).toBe("next-press")
    await previousButton(page).click()
    await expectShown(page, 0)
    expect(await lastReason(page)).toBe("previous-press")
    await drag(page, 0, -200)
    await expectShown(page, 1)
    expect(await lastReason(page)).toBe("swipe")
    await page.getByRole("button", { name: "Show page 4" }).click()
    await expectShown(page, 3)
    expect(await lastReason(page)).toBe("imperative")
  })

  test("a horizontal wheel scrolls to the next slide @enhancement", async ({
    page,
    open,
  }) => {
    await open("carousel")
    const box = await slideLink(page, 0).boundingBox()
    await page.mouse.move(box!.x, box!.y)
    await page.mouse.wheel(220, 0)
    await expectShown(page, 1)
    await expect.poll(() => lastReason(page)).toBe("scroll")
    expect(await lastAction(page)).toBe("2")
  })

  test("with loop, a wheel back from the first slide scrolls natively to the last @enhancement", async ({
    page,
    open,
  }) => {
    await open("carousel", { loop: "" })
    await settled(page)
    const box = await slideLink(page, 0).boundingBox()
    await page.mouse.move(box!.x, box!.y)
    await page.mouse.wheel(-220, 0)
    await expectShown(page, 4)
    await expect.poll(() => lastReason(page)).toBe("scroll")
    expect(await lastAction(page)).toBe("5")
  })

  test("--carousel-progress on the root follows the slides, for progress bars in CSS @enhancement", async ({
    page,
    open,
  }) => {
    await open("carousel")
    const region = page.getByRole("region", { name: carouselFixture.label })
    const progress = () =>
      region.evaluate((el) =>
        getComputedStyle(el).getPropertyValue("--carousel-progress")
      )
    await expect.poll(progress).toBe("0.0000")
    await nextButton(page).click()
    await expectShown(page, 1)
    await expect.poll(progress).toBe("0.2500")
    await indicator(page, 5).click()
    await expect.poll(progress).toBe("1.0000")
  })

  test("with loop, --carousel-progress goes round, whatever the track's rotation @enhancement", async ({
    page,
    open,
  }) => {
    await open("carousel", { loop: "" })
    const region = page.getByRole("region", { name: carouselFixture.label })
    const progress = () =>
      region.evaluate((el) =>
        getComputedStyle(el).getPropertyValue("--carousel-progress")
      )
    await expect.poll(progress).toBe("0.0000")
    await previousButton(page).click()
    await expectShown(page, 4)
    await expect.poll(progress).toBe("0.8000")
  })

  test("Next outside the carousel works through its controller @enhancement", async ({
    page,
    open,
  }) => {
    await open("carousel")
    await page.getByRole("button", { name: "Next from outside" }).click()
    await expectShown(page, 1)
    expect(await lastAction(page)).toBe("2")
  })
})

test.describe("rotation @enhancement", () => {
  test("it rotates on its own, past the last slide to the first @enhancement", async ({
    page,
    open,
  }) => {
    // Long enough for each page to come to rest before the next.
    await open("carousel", { playing: "", interval: "800" })
    // Every page it moves to, numbered from 1, since a page shows for less
    // time than a check can take on a busy machine.
    await page.evaluate(() => {
      const output = document.querySelector("output[aria-label='Last action']")!
      const pages: string[] = []
      Object.assign(window, { pages })
      new MutationObserver(() => pages.push(output.textContent ?? "")).observe(
        output,
        {
          childList: true,
          characterData: true,
          subtree: true,
        }
      )
    })
    const pages = () =>
      page.evaluate(() =>
        (window as unknown as { pages: string[] }).pages
          .filter((value, index, all) => value !== all[index - 1])
          .join(",")
      )
    await expect.poll(pages, { timeout: 15_000 }).toContain("3,4,5,1")
    expect(await lastReason(page)).toBe("timeout")
    // Stopped, it rests on the page it was on.
    await playToggle(page, true).click()
    await expectShown(page, Number(await lastAction(page)) - 1)
  })

  test("the play toggle stops and starts rotation, and its name says which @enhancement", async ({
    page,
    open,
  }) => {
    await open("carousel", { playing: "", interval: "300" })
    await playToggle(page, true).click()
    await expect(playToggle(page, false)).toBeVisible()
    const stoppedAt = await lastAction(page)
    await page.waitForTimeout(700)
    expect(await lastAction(page)).toBe(stoppedAt)
    await playToggle(page, false).click()
    await expect(playToggle(page, true)).toBeVisible()
    // The mouse over the carousel pauses it.
    await page.getByRole("button", { name: "After" }).hover()
    await expect.poll(() => lastAction(page)).not.toBe(stoppedAt)
  })

  test("keyboard focus moving in stops rotation, as the pattern asks @enhancement", async ({
    page,
    open,
    tab,
  }) => {
    await open("carousel", { playing: "", interval: "300" })
    await page.getByRole("button", { name: "Before" }).focus()
    await tab()
    await expect(playToggle(page, false)).toBeFocused()
    const stoppedAt = await lastAction(page)
    await page.waitForTimeout(700)
    expect(await lastAction(page)).toBe(stoppedAt)
  })

  test("hovering pauses rotation, and leaving resumes it @enhancement", async ({
    page,
    open,
  }) => {
    await open("carousel", { playing: "", interval: "300" })
    await page.getByRole("region", { name: carouselFixture.label }).hover()
    await expect(
      page.getByRole("region", { name: carouselFixture.label })
    ).toHaveAttribute("data-paused", "")
    const pausedAt = await lastAction(page)
    await page.waitForTimeout(700)
    expect(await lastAction(page)).toBe(pausedAt)
    await expect(playToggle(page, true)).toBeVisible()
    await page.getByRole("button", { name: "After" }).hover()
    await expect.poll(() => lastAction(page)).not.toBe(pausedAt)
  })

  test("pressing Next stops rotation @enhancement", async ({ page, open }) => {
    await open("carousel", { playing: "", interval: "400" })
    await nextButton(page).click()
    await expect(playToggle(page, false)).toBeVisible()
  })

  test("the slides are a live region only while not rotating @enhancement", async ({
    page,
    open,
  }) => {
    await open("carousel", { playing: "", interval: "5000" })
    const content = slideLink(page, 0).locator(
      "xpath=ancestor::*[@aria-live][1]"
    )
    await expect(content).toHaveAttribute("aria-live", "off")
    await playToggle(page, true).click()
    await expect(content).toHaveAttribute("aria-live", "polite")
  })

  test("it doesn't start rotating when the user prefers reduced motion @enhancement", async ({
    page,
    open,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    await open("carousel", { playing: "", interval: "200" })
    await expect(playToggle(page, false)).toBeVisible()
    await page.waitForTimeout(500)
    expect(await lastAction(page)).toBe("")
  })

  test("reduced motion pages without animating @enhancement", async ({
    page,
    open,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    await open("carousel")
    await nextButton(page).click()
    await expectShown(page, 1)
    const box = await slideLink(page, 1).boundingBox()
    await page.waitForTimeout(50)
    expect(await slideLink(page, 1).boundingBox()).toEqual(box)
  })
})

test.describe("pages @enhancement", () => {
  test("indicators follow a change in size @enhancement", async ({
    page,
    open,
  }) => {
    await open("carousel", { "per-view": "3" })
    await expect(page.getByRole("tab")).toHaveCount(3)
    // A stylesheet, since frameworks write their own inline styles back.
    await page.addStyleTag({
      content: ".carousel-slide { flex-basis: 100% !important }",
    })
    await expect(page.getByRole("tab")).toHaveCount(5)
  })
})
