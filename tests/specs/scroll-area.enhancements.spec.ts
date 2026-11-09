import type { Page } from "@playwright/test"
import { scrollAreaFixture } from "../fixtures/scroll-area"
import { expect, test } from "../fixtures"
import {
  area,
  box,
  dragBy,
  pointAt,
  restingScroll,
  scrollbar,
  scrollOf,
  setScroll,
  settle,
  thumb,
  trackBox,
  viewport,
} from "./scroll-area.helpers"

// Behavior past a plain scroll area: paging track presses, scrollbar types,
// sticking to the end, native scrollbars when there are no custom ones, and
// tab stops only where nothing inside takes focus.

const { tags, gallery, chat } = scrollAreaFixture

const distanceToEnd = async (page: Page, name: string) => {
  const scroll = await scrollOf(viewport(page, name))
  return scroll.maxTop - scroll.top
}

const press = (page: Page, name: string) =>
  page.getByRole("button", { name, exact: true }).click()

// Runs in the page.
const clickButton = (name: string) =>
  Array.from(document.querySelectorAll("button"))
    .find((button) => button.textContent === name)!
    .click()

test.describe("track", { tag: "@enhancement" }, () => {
  test.beforeEach(async ({ open }) => {
    await open("scroll-area")
  })

  test("pressing the track pages by most of a viewport, like a native scrollbar", async ({
    page,
  }) => {
    const track = await trackBox(page, tags.label)
    await page.mouse.click(
      track.x + track.width / 2,
      track.y + track.height - 4
    )
    const scroll = await scrollOf(viewport(page, tags.label))
    await expect
      .poll(async () => (await scrollOf(viewport(page, tags.label))).top)
      .toBe(Math.round(scroll.client * 0.875))
  })

  test("Escape during a thumb drag puts the content back", async ({ page }) => {
    await dragBy(page, thumb(page, tags.label), 0, 60)
    // Pointer moves are applied once per frame.
    await expect
      .poll(async () => (await scrollOf(viewport(page, tags.label))).top)
      .toBeGreaterThan(0)
    await page.keyboard.press("Escape")
    await page.mouse.up()
    expect((await scrollOf(viewport(page, tags.label))).top).toBe(0)
  })
})

test.describe("keyboard", { tag: "@enhancement" }, () => {
  test.beforeEach(async ({ open }) => {
    await open("scroll-area")
  })

  test("a viewport with focusable content is no tab stop: Tab goes to the content", async ({
    page,
  }) => {
    await expect(viewport(page, gallery.label)).not.toHaveAttribute("tabindex")
  })
})

test.describe("native scrollbars", { tag: "@enhancement" }, () => {
  test("without custom scrollbars, the native ones stay", async ({
    page,
    open,
    browserName,
  }) => {
    test.skip(
      browserName === "firefox",
      "Playwright's Firefox hides every scrollbar itself."
    )
    await open("scroll-area", { native: "" })
    await expect
      .poll(() =>
        viewport(page, tags.label).evaluate(
          (el) => getComputedStyle(el).scrollbarWidth
        )
      )
      .toBe("auto")
  })

  test("hiding native scrollbars injects no style element", async ({
    page,
    open,
  }) => {
    await open("scroll-area")
    const injected = await page.evaluate(() =>
      Array.from(document.querySelectorAll("style")).some((style) =>
        style.textContent?.includes("scrollbar-width")
      )
    )
    expect(injected).toBe(false)
  })
})

test.describe("state", { tag: "@enhancement" }, () => {
  test.beforeEach(async ({ open }) => {
    await open("scroll-area")
  })

  test("the root says which axes overflow and which edges the view is at", async ({
    page,
  }) => {
    const root = area(page, tags.label)
    await expect(root).toHaveAttribute("data-overflow-y", "")
    await expect(root).not.toHaveAttribute("data-overflow-x")
    await expect(root).toHaveAttribute("data-at-start", "")
    await expect(root).not.toHaveAttribute("data-at-end")
    await setScroll(viewport(page, tags.label), { top: 1e6 })
    await expect(root).toHaveAttribute("data-at-end", "")
    await expect(root).toHaveAttribute("data-at-y-end", "")
    await expect(root).not.toHaveAttribute("data-at-start")
  })

  test("CSS variables say how far the content reaches past each edge, and the progress", async ({
    page,
  }) => {
    await setScroll(viewport(page, tags.label), { top: 100 })
    await settle(page)
    const { maxTop } = await scrollOf(viewport(page, tags.label))
    const variables = await area(page, tags.label).evaluate((el) => ({
      start: el.style.getPropertyValue("--scroll-area-overflow-y-start"),
      end: el.style.getPropertyValue("--scroll-area-overflow-y-end"),
      progress: el.style.getPropertyValue("--scroll-area-progress-y"),
    }))
    expect(variables.start).toBe("100px")
    expect(variables.end).toBe(`${maxTop - 100}px`)
    expect(Number(variables.progress)).toBeCloseTo(100 / maxTop, 3)
  })

  test("the variables don't inherit, and a child of the root takes them with inherit", async ({
    page,
  }) => {
    await setScroll(viewport(page, tags.label), { top: 100 })
    await settle(page)
    const seen = await area(page, tags.label).evaluate((el) => {
      const read = (target: Element) =>
        getComputedStyle(target)
          .getPropertyValue("--scroll-area-overflow-y-start")
          .trim()
      const probe = document.createElement("div")
      probe.style.setProperty("--scroll-area-overflow-y-start", "inherit")
      el.append(probe)
      const result = {
        viewport: read(el.querySelector('[data-slot="scroll-area-viewport"]')!),
        probe: read(probe),
      }
      probe.remove()
      return result
    })
    expect(seen).toEqual({ viewport: "", probe: "100px" })
  })
})

test.describe("scrollbar types", { tag: "@enhancement" }, () => {
  test("hover shows the scrollbar while the pointer is over the area, then hides it after the delay", async ({
    page,
    open,
  }) => {
    await open("scroll-area", { type: "hover", delay: "200" })
    await expect(scrollbar(page, tags.label)).not.toHaveAttribute(
      "data-visible"
    )
    await viewport(page, tags.label).hover()
    await expect(scrollbar(page, tags.label)).toHaveAttribute(
      "data-visible",
      ""
    )
    await page.getByRole("button", { name: "Before" }).hover()
    await expect(scrollbar(page, tags.label)).toHaveAttribute(
      "data-visible",
      ""
    )
    await expect(scrollbar(page, tags.label)).not.toHaveAttribute(
      "data-visible"
    )
  })

  test("scroll shows the scrollbar only while scrolling, not on hover", async ({
    page,
    open,
  }) => {
    await open("scroll-area", { type: "scroll", delay: "100" })
    await viewport(page, tags.label).hover()
    await page.waitForTimeout(50)
    await expect(scrollbar(page, tags.label)).not.toHaveAttribute(
      "data-visible"
    )
    await page.mouse.wheel(0, 100)
    await expect(scrollbar(page, tags.label)).toHaveAttribute(
      "data-visible",
      ""
    )
    await expect(scrollbar(page, tags.label)).not.toHaveAttribute(
      "data-visible"
    )
  })

  test("scroll shows only the scrollbar of the axis that scrolls", async ({
    page,
    open,
  }) => {
    await open("scroll-area", { type: "scroll" })
    await setScroll(viewport(page, gallery.label), { top: 100 })
    await expect(scrollbar(page, gallery.label)).toHaveAttribute(
      "data-visible",
      ""
    )
    await expect(
      scrollbar(page, gallery.label, "horizontal")
    ).not.toHaveAttribute("data-visible")
  })

  test("auto shows the scrollbar whenever the content overflows", async ({
    page,
    open,
  }) => {
    await open("scroll-area", { type: "auto" })
    await expect(scrollbar(page, tags.label)).toHaveAttribute(
      "data-visible",
      ""
    )
  })

  test("always shows the scrollbar even when the content fits", async ({
    page,
    open,
  }) => {
    await open("scroll-area", { type: "always" })
    await expect(scrollbar(page, scrollAreaFixture.short.label)).toBeVisible()
    await expect(
      scrollbar(page, scrollAreaFixture.short.label)
    ).toHaveAttribute("data-visible", "")
  })

  test("a hidden scrollbar lets presses through to the content under it", async ({
    page,
    open,
  }) => {
    await open("scroll-area", { type: "scroll" })
    const hidden = await box(scrollbar(page, gallery.label))
    const hit = await page.evaluate(
      ({ x, y }) =>
        document.elementFromPoint(x, y)?.closest(".scroll-area-scrollbar") ??
        null,
      { x: hidden.x + hidden.width / 2, y: hidden.y + 20 }
    )
    expect(hit).toBeNull()
  })
})

test.describe("sticking to the end", { tag: "@enhancement" }, () => {
  test.beforeEach(async ({ open }) => {
    await open("scroll-area")
  })

  test("it starts at the end", async ({ page }) => {
    await expect.poll(() => distanceToEnd(page, chat.label)).toBeLessThan(1)
    await expect(area(page, chat.label)).toHaveAttribute("data-sticking", "")
  })

  test("new messages, streamed words and late images keep the end in view", async ({
    page,
  }) => {
    await press(page, "Add message")
    await expect.poll(() => distanceToEnd(page, chat.label)).toBeLessThan(1)
    await press(page, "Stream")
    await press(page, "Stream")
    await expect.poll(() => distanceToEnd(page, chat.label)).toBeLessThan(1)
    await press(page, "Add image")
    await press(page, "Load images")
    await expect.poll(() => distanceToEnd(page, chat.label)).toBeLessThan(1)
  })

  test("a wheel toward the start lets go, and growth no longer moves the view", async ({
    page,
  }) => {
    await viewport(page, chat.label).hover()
    await page.mouse.wheel(0, -120)
    await expect(area(page, chat.label)).not.toHaveAttribute("data-sticking")
    await expect
      .poll(async () => (await scrollOf(viewport(page, chat.label))).top)
      .toBeLessThan((await scrollOf(viewport(page, chat.label))).maxTop)
    const top = await restingScroll(viewport(page, chat.label))
    await press(page, "Add message")
    await press(page, "Stream")
    await settle(page)
    expect((await scrollOf(viewport(page, chat.label))).top).toBe(top)
  })

  test("content streaming in during a wheel toward the start doesn't pull the view back", async ({
    page,
  }) => {
    await viewport(page, chat.label).hover()
    // The wheel and the growth land in the same frame.
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"))
      const stream = buttons.find((button) => button.textContent === "Stream")!
      const el = document.querySelector<HTMLElement>('[aria-label="Messages"]')!
      el.dispatchEvent(new WheelEvent("wheel", { deltaY: -100, bubbles: true }))
      el.scrollBy({ top: -100, behavior: "instant" })
      stream.click()
    })
    await settle(page)
    expect(await distanceToEnd(page, chat.label)).toBeGreaterThan(50)
  })

  test("PageUp in the viewport lets go", async ({ page }) => {
    await viewport(page, chat.label).focus()
    await page.keyboard.press("PageUp")
    await expect(area(page, chat.label)).not.toHaveAttribute("data-sticking")
  })

  test("a wheel toward the start inside a scroller in the content keeps following", async ({
    page,
  }) => {
    // A code block in a message, scrolled partway, scrolls itself.
    await viewport(page, chat.label).evaluate((el) => {
      const block = document.createElement("pre")
      block.setAttribute("data-testid", "nested")
      block.style.cssText = "height:40px;overflow:auto;margin:0"
      block.textContent = Array.from(
        { length: 12 },
        (_, line) => `line ${line + 1}`
      ).join("\n")
      el.firstElementChild!.append(block)
      block.scrollTop = 60
    })
    await expect.poll(() => distanceToEnd(page, chat.label)).toBeLessThan(1)
    await page.getByTestId("nested").hover()
    await page.mouse.wheel(0, -20)
    await expect
      .poll(() => page.getByTestId("nested").evaluate((el) => el.scrollTop))
      .toBeLessThan(60)
    await expect(area(page, chat.label)).toHaveAttribute("data-sticking", "")
  })

  test("a key a widget inside uses keeps following", async ({ page }) => {
    // A listbox in a message takes its arrow and paging keys.
    await viewport(page, chat.label).evaluate((el) => {
      const list = document.createElement("div")
      list.tabIndex = 0
      list.setAttribute("data-testid", "widget")
      list.addEventListener("keydown", (event) => event.preventDefault())
      el.firstElementChild!.append(list)
    })
    await page.getByTestId("widget").focus()
    await page.keyboard.press("PageUp")
    await page.keyboard.press("ArrowUp")
    await expect(area(page, chat.label)).toHaveAttribute("data-sticking", "")
  })

  test("the controller reads where the view is from a scroll listener", async ({
    page,
    framework,
  }) => {
    test.skip(framework !== "web", "The element's api is the controller.")
    const result = await area(page, chat.label).evaluate((el) => {
      type Api = {
        scrollToStart: (options: object) => void
        isAtStart: () => boolean
        isAtEnd: () => boolean
      }
      const api = (el as HTMLElement & { api: Api }).api
      const view = el.querySelector('[aria-label="Messages"]')!
      return new Promise<boolean[]>((resolve) => {
        view.addEventListener(
          "scroll",
          () => resolve([api.isAtStart(), api.isAtEnd()]),
          { once: true }
        )
        api.scrollToStart({ behavior: "instant" })
      })
    })
    expect(result).toEqual([true, false])
  })

  test("a scroll toward the start from the app or find in page lets go too", async ({
    page,
  }) => {
    await setScroll(viewport(page, chat.label), { top: 0 })
    await expect(area(page, chat.label)).not.toHaveAttribute("data-sticking")
    await press(page, "Add message")
    await settle(page)
    expect((await scrollOf(viewport(page, chat.label))).top).toBe(0)
  })

  test("scrolling back to the end follows again", async ({ page }) => {
    await setScroll(viewport(page, chat.label), { top: 0 })
    await expect(area(page, chat.label)).not.toHaveAttribute("data-sticking")
    await viewport(page, chat.label).hover()
    // Firefox scrolls a few hundred pixels at most per wheel event.
    await expect(async () => {
      await page.mouse.wheel(0, 400)
      await expect(area(page, chat.label)).toHaveAttribute(
        "data-sticking",
        "",
        { timeout: 300 }
      )
    }).toPass()
    await press(page, "Add message")
    await expect.poll(() => distanceToEnd(page, chat.label)).toBeLessThan(1)
  })

  test("dragging the thumb toward the start lets go, and back to the end follows", async ({
    page,
  }) => {
    await dragBy(page, thumb(page, chat.label), 0, -60)
    await page.mouse.up()
    await expect(area(page, chat.label)).not.toHaveAttribute("data-sticking")
    await dragBy(page, thumb(page, chat.label), 0, 400)
    await page.mouse.up()
    await expect(area(page, chat.label)).toHaveAttribute("data-sticking", "")
  })

  test("keeping the end in view never scrolls the page", async ({ page }) => {
    await page.evaluate(() => scrollTo(0, 40))
    // Clicked from the page, since Playwright's own click may scroll to the button.
    for (let index = 0; index < 3; index++) {
      await page.evaluate(clickButton, "Add message")
    }
    await expect.poll(() => distanceToEnd(page, chat.label)).toBeLessThan(1)
    expect(await page.evaluate(() => scrollY)).toBe(40)
  })

  test("keeping the end in view doesn't flash the scrollbars as scrolling", async ({
    page,
  }) => {
    await settle(page)
    const flashes = await page.evaluate(async () => {
      const root = document.querySelector(
        '[aria-label="Messages"]'
      )!.parentElement!
      let seen = 0
      const observer = new MutationObserver(
        () => root.hasAttribute("data-scrolling") && seen++
      )
      observer.observe(root, {
        attributes: true,
        attributeFilter: ["data-scrolling"],
      })
      const stream = Array.from(document.querySelectorAll("button")).find(
        (button) => button.textContent === "Stream"
      )!
      for (let index = 0; index < 5; index++) {
        stream.click()
        await new Promise((resolve) => requestAnimationFrame(resolve))
      }
      await new Promise((resolve) => setTimeout(resolve, 100))
      observer.disconnect()
      return seen
    })
    expect(flashes).toBe(0)
  })

  test("a smooth scroll-behavior doesn't slow down keeping the end in view", async ({
    page,
  }) => {
    await viewport(page, chat.label).evaluate(
      (el) => (el.style.scrollBehavior = "smooth")
    )
    await press(page, "Add message")
    await settle(page)
    expect(await distanceToEnd(page, chat.label)).toBeLessThan(1)
  })

  test("text selection in progress isn't pulled away by growth", async ({
    page,
  }) => {
    const message = viewport(page, chat.label).getByText("Message 19", {
      exact: true,
    })
    const start = await box(message)
    await page.mouse.move(start.x + 2, start.y + start.height / 2)
    await page.mouse.down()
    await page.mouse.move(start.x + 40, start.y + start.height / 2, {
      steps: 3,
    })
    const top = (await scrollOf(viewport(page, chat.label))).top
    await page.evaluate(clickButton, "Add message")
    await settle(page)
    expect((await scrollOf(viewport(page, chat.label))).top).toBe(top)
    await page.mouse.up()
    await expect.poll(() => distanceToEnd(page, chat.label)).toBeLessThan(1)
  })
})

test.describe("jump to latest", { tag: "@enhancement" }, () => {
  test.beforeEach(async ({ open }) => {
    await open("scroll-area")
  })

  const jump = (page: Page) => page.getByRole("button", { name: chat.jump })

  test("it's out of reach at the end, and shows once the view moves away", async ({
    page,
  }) => {
    await expect(jump(page)).toHaveAttribute("inert", "")
    await expect(jump(page)).not.toHaveAttribute("data-visible")
    await setScroll(viewport(page, chat.label), { top: 0 })
    await expect(jump(page)).toHaveAttribute("data-visible", "")
    await expect(jump(page)).not.toHaveAttribute("inert")
  })

  test("it scrolls to the end, follows the end again, and hides at once", async ({
    page,
  }) => {
    await setScroll(viewport(page, chat.label), { top: 0 })
    await jump(page).click()
    await expect(jump(page)).not.toHaveAttribute("data-visible")
    await expect(area(page, chat.label)).toHaveAttribute("data-sticking", "")
    await expect.poll(() => distanceToEnd(page, chat.label)).toBeLessThan(1)
    await press(page, "Add message")
    await expect.poll(() => distanceToEnd(page, chat.label)).toBeLessThan(1)
  })

  test("from the keyboard, focus moves to the viewport instead of the page", async ({
    page,
  }) => {
    await setScroll(viewport(page, chat.label), { top: 0 })
    await expect(jump(page)).not.toHaveAttribute("inert")
    await jump(page).focus()
    await page.keyboard.press("Enter")
    await expect(viewport(page, chat.label)).toBeFocused()
  })

  test("with reduced motion, it jumps at once", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    await setScroll(viewport(page, chat.label), { top: 0 })
    await jump(page).click()
    expect(await distanceToEnd(page, chat.label)).toBeLessThan(1)
  })
})

test.describe("hidden scrollbars", { tag: "@enhancement" }, () => {
  test("a scrollbar shows its thumb as soon as it's hovered", async ({
    page,
    open,
  }) => {
    await open("scroll-area", { type: "hover" })
    await pointAt(page, scrollbar(page, tags.label))
    await expect(scrollbar(page, tags.label)).toHaveAttribute(
      "data-visible",
      ""
    )
  })
})

test("a scroll area in another document times its scrollbars with that document's window", async ({
  page,
  open,
  framework,
}) => {
  test.skip(!framework.startsWith("web"), "Moves an element into an iframe.")
  await open("scroll-area")
  const used = await page.evaluate(async () => {
    const frame = document.createElement("iframe")
    // In view: WebKit and Firefox give an iframe below the fold no animation frames.
    frame.style.cssText = "position: fixed; top: 0; left: 0"
    document.body.append(frame)
    const win = frame.contentWindow!
    let timers = 0
    const setTimer = win.setTimeout.bind(win)
    win.setTimeout = ((handler: TimerHandler, delay?: number) => {
      timers++
      return setTimer(handler, delay)
    }) as typeof win.setTimeout
    const area = document.querySelector("ui-scroll-area")!
    frame.contentDocument!.body.append(area)
    await new Promise((resolve) => setTimeout(resolve, 50))
    const viewport = area.querySelector<HTMLElement>(
      "[data-slot='scroll-area-viewport']"
    )!
    // The iframe has none of the page's styles.
    Object.assign(viewport.style, {
      display: "block",
      height: "40px",
      overflow: "auto",
    })
    await new Promise((resolve) => setTimeout(resolve, 50))
    viewport.scrollTop = 40
    await new Promise((resolve) => setTimeout(resolve, 100))
    return timers
  })
  expect(used).toBeGreaterThan(0)
})
