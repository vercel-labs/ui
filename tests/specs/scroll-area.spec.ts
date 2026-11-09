import { scrollAreaFixture } from "../fixtures/scroll-area"
import { expect, test } from "../fixtures"
import {
  area,
  box,
  dragBy,
  pointAt,
  scrollbar,
  scrollOf,
  setScroll,
  settle,
  thumb,
  trackBox,
  viewport,
} from "./scroll-area.helpers"

// The viewport is a native scroller, and the scrollbars are drawn over it. No
// APG pattern covers scroll areas; keyboard access follows axe's
// scrollable-region-focusable rule.

const { tags, gallery, short, chat } = scrollAreaFixture

test.beforeEach(async ({ open }) => {
  await open("scroll-area")
})

test.describe("thumb", () => {
  test("the wheel scrolls the viewport and moves the thumb", async ({
    page,
  }) => {
    const before = await box(thumb(page, tags.label))
    await viewport(page, tags.label).hover()
    await page.mouse.wheel(0, 300)
    await expect
      .poll(async () => (await scrollOf(viewport(page, tags.label))).top)
      .toBeGreaterThan(0)
    await expect
      .poll(async () => (await box(thumb(page, tags.label))).y)
      .toBeGreaterThan(before.y)
  })

  test("the thumb is as long as the visible share of the content", async ({
    page,
  }) => {
    const scroll = await scrollOf(viewport(page, tags.label))
    const track = await trackBox(page, tags.label)
    const expected =
      (track.height * scroll.client) / (scroll.maxTop + scroll.client)
    expect(
      Math.abs((await box(thumb(page, tags.label))).height - expected)
    ).toBeLessThan(2)
  })

  test("at the end of the content, the thumb is at the end of its track", async ({
    page,
  }) => {
    await setScroll(viewport(page, tags.label), { top: 1e6 })
    await settle(page)
    const track = await trackBox(page, tags.label)
    const end = await box(thumb(page, tags.label))
    expect(
      Math.abs(end.y + end.height - (track.y + track.height))
    ).toBeLessThan(2)
  })

  test("dragging the thumb scrolls the content as far along", async ({
    page,
  }) => {
    const track = await trackBox(page, tags.label)
    const size = (await box(thumb(page, tags.label))).height
    await dragBy(page, thumb(page, tags.label), 0, 40)
    await page.mouse.up()
    const scroll = await scrollOf(viewport(page, tags.label))
    const expected = (40 / (track.height - size)) * scroll.maxTop
    expect(Math.abs(scroll.top - expected)).toBeLessThan(8)
  })

  test("dragging the thumb past the track's end stops at the end", async ({
    page,
  }) => {
    await dragBy(page, thumb(page, tags.label), 0, 600)
    await page.mouse.up()
    const scroll = await scrollOf(viewport(page, tags.label))
    expect(Math.abs(scroll.top - scroll.maxTop)).toBeLessThan(1)
  })

  test("dragging the thumb selects no text", async ({ page }) => {
    await dragBy(page, thumb(page, tags.label), 0, 60)
    await page.mouse.up()
    expect(await page.evaluate(() => getSelection()?.toString() ?? "")).toBe("")
  })

  test("the horizontal thumb follows horizontal scrolling", async ({
    page,
  }) => {
    const before = await box(thumb(page, gallery.label, "horizontal"))
    await setScroll(viewport(page, gallery.label), { left: 200 })
    await expect
      .poll(async () => (await box(thumb(page, gallery.label, "horizontal"))).x)
      .toBeGreaterThan(before.x)
  })

  test("the thumb shrinks as the content grows", async ({ page }) => {
    // The thumb is sized once its track has been measured.
    await expect
      .poll(async () => (await box(thumb(page, chat.label))).height)
      .toBeGreaterThan(0)
    const before = await box(thumb(page, chat.label))
    for (let index = 0; index < 5; index++) {
      await page.getByRole("button", { name: "Add message" }).click()
    }
    await expect
      .poll(async () => (await box(thumb(page, chat.label))).height)
      .toBeLessThan(before.height)
  })

  test("an image loading late resizes the thumb", async ({ page }) => {
    await page.getByRole("button", { name: "Add image" }).click()
    await settle(page)
    const before = await box(thumb(page, chat.label))
    await page.getByRole("button", { name: "Load images" }).click()
    await expect
      .poll(async () => (await box(thumb(page, chat.label))).height)
      .toBeLessThan(before.height)
  })
})

test.describe("track", () => {
  test("pressing the track after the thumb scrolls toward the press", async ({
    page,
  }) => {
    const track = await trackBox(page, tags.label)
    await page.mouse.click(
      track.x + track.width / 2,
      track.y + track.height - 4
    )
    await expect
      .poll(async () => (await scrollOf(viewport(page, tags.label))).top)
      .toBeGreaterThan(0)
  })

  test("pressing the track before the thumb scrolls back toward the press", async ({
    page,
  }) => {
    await setScroll(viewport(page, tags.label), { top: 1e6 })
    await settle(page)
    const { maxTop } = await scrollOf(viewport(page, tags.label))
    const track = await trackBox(page, tags.label)
    await page.mouse.click(track.x + track.width / 2, track.y + 4)
    await expect
      .poll(async () => (await scrollOf(viewport(page, tags.label))).top)
      .toBeLessThan(maxTop)
  })

  test("holding the track keeps paging until the thumb reaches the pointer", async ({
    page,
  }) => {
    const track = await trackBox(page, tags.label)
    const y = track.y + track.height * 0.6
    await page.mouse.move(track.x + track.width / 2, y)
    await page.mouse.down()
    await expect
      .poll(async () => {
        const handle = await box(thumb(page, tags.label))
        return handle.y <= y && y <= handle.y + handle.height
      })
      .toBe(true)
    await page.mouse.up()
    const scroll = await scrollOf(viewport(page, tags.label))
    expect(scroll.top).toBeLessThan(scroll.maxTop)
  })

  test("Alt with a press on the track jumps there", async ({ page }) => {
    const track = await trackBox(page, tags.label)
    await page.keyboard.down("Alt")
    await page.mouse.click(
      track.x + track.width / 2,
      track.y + track.height / 2
    )
    await page.keyboard.up("Alt")
    await expect
      .poll(async () => {
        const handle = await box(thumb(page, tags.label))
        return Math.abs(
          handle.y + handle.height / 2 - (track.y + track.height / 2)
        )
      })
      .toBeLessThan(3)
  })

  test("pressing a scrollbar leaves focus where it was", async ({ page }) => {
    await page.getByRole("button", { name: "Before" }).focus()
    const track = await trackBox(page, tags.label)
    await page.mouse.click(
      track.x + track.width / 2,
      track.y + track.height - 4
    )
    await expect(page.getByRole("button", { name: "Before" })).toBeFocused()
  })

  test("a wheel over a scrollbar scrolls the viewport, not the page", async ({
    page,
  }) => {
    await pointAt(page, scrollbar(page, tags.label))
    await page.mouse.wheel(0, 200)
    await expect
      .poll(async () => (await scrollOf(viewport(page, tags.label))).top)
      .toBeGreaterThan(0)
    expect(await page.evaluate(() => scrollY)).toBe(0)
  })

  test("a wheel over a scrollbar at the end scrolls the page", async ({
    page,
  }) => {
    await setScroll(viewport(page, tags.label), { top: 1e6 })
    await settle(page)
    await pointAt(page, scrollbar(page, tags.label))
    await page.mouse.wheel(0, 200)
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0)
  })
})

test.describe("overflow", () => {
  test("custom scrollbars hide the native ones", async ({ page }) => {
    expect(
      await viewport(page, tags.label).evaluate(
        (el) => getComputedStyle(el).scrollbarWidth
      )
    ).toBe("none")
  })

  test("the root says while the user scrolls, and stops after", async ({
    page,
  }) => {
    await viewport(page, tags.label).hover()
    await page.mouse.wheel(0, 100)
    await expect(area(page, tags.label)).toHaveAttribute("data-scrolling", "")
    await expect(area(page, tags.label)).not.toHaveAttribute("data-scrolling")
  })

  test("content that fits shows no scrollbar", async ({ page }) => {
    await expect(scrollbar(page, short.label)).toBeHidden()
    await expect(scrollbar(page, tags.label)).toBeVisible()
  })

  test("content that overflows both ways shows both scrollbars and the corner between them", async ({
    page,
  }) => {
    await expect(scrollbar(page, gallery.label, "horizontal")).toBeVisible()
    await expect(
      area(page, gallery.label).locator(".scroll-area-corner")
    ).toBeVisible()
    const vertical = await box(scrollbar(page, gallery.label))
    const horizontal = await box(scrollbar(page, gallery.label, "horizontal"))
    // Neither runs into the corner.
    expect(vertical.y + vertical.height).toBeLessThanOrEqual(horizontal.y + 1)
    expect(horizontal.x + horizontal.width).toBeLessThanOrEqual(vertical.x + 1)
  })
})

test.describe("keyboard", () => {
  test("a viewport that scrolls and holds nothing focusable is a tab stop", async ({
    page,
    tab,
  }) => {
    await page.getByRole("button", { name: "Before" }).focus()
    await tab()
    await expect(viewport(page, tags.label)).toBeFocused()
  })

  // Chrome animates key scrolling, and under load can drop a key that lands
  // mid-animation, in every implementation, so each key is pressed until it lands.
  test("keys scroll a focused viewport natively", async ({ page }) => {
    await setScroll(viewport(page, tags.label), { top: 300 })
    await viewport(page, tags.label).focus()
    await expect(async () => {
      await page.keyboard.press("Home")
      await expect
        .poll(async () => (await scrollOf(viewport(page, tags.label))).top, {
          timeout: 1000,
        })
        .toBe(0)
    }).toPass()
    await expect(async () => {
      await page.keyboard.press("End")
      await expect
        .poll(
          async () => {
            const scroll = await scrollOf(viewport(page, tags.label))
            return scroll.maxTop - scroll.top
          },
          { timeout: 1000 }
        )
        .toBeLessThan(1)
    }).toPass()
  })

  test("a viewport that doesn't scroll is no tab stop", async ({ page }) => {
    await expect(viewport(page, short.label)).not.toHaveAttribute(
      "tabindex",
      "0"
    )
  })

  test("focusing content scrolls it into view", async ({ page }) => {
    await page.getByRole("link", { name: "Artwork 36" }).focus()
    await expect
      .poll(async () => (await scrollOf(viewport(page, gallery.label))).top)
      .toBeGreaterThan(0)
  })
})

test.describe("web components", () => {
  test.beforeEach(({ framework }) =>
    test.skip(!framework.startsWith("web"), "Web components only.")
  )

  test("a scrollbar whose orientation changes sizes its thumb along the new axis", async ({
    page,
  }) => {
    const bar = scrollbar(page, tags.label)
    await expect(bar).toHaveAttribute("style", /--scroll-area-thumb-height/)
    await bar.evaluate((el) =>
      el
        .closest("ui-scroll-area-scrollbar")!
        .setAttribute("orientation", "horizontal")
    )
    const turned = scrollbar(page, tags.label, "horizontal")
    await expect(turned).toHaveAttribute("style", /--scroll-area-thumb-width/)
    await expect(turned).not.toHaveAttribute(
      "style",
      /--scroll-area-thumb-height/
    )
  })
})
