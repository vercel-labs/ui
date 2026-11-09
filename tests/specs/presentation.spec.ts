import type { Browser, Locator, Page } from "@playwright/test"
import { expect, menuNamed, test, waitForStill } from "../fixtures"
import { hasFixture } from "../fixture-files"

// Popups with `presentation="sheet"` sit on the Drawer's sheet layer: they
// keep their roles, keys and focus, and add the sheet's motion, a swipe away
// and the dim. Each popup runs the same checks; the *-sheet projects also run
// every popup's shared specs as a sheet.

type Sheet = {
  /** The fixture, and the component name its changes are reported under. */
  fixture: string
  component: string
  trigger: (page: Page) => Locator
  popup: (page: Page) => Locator
  /** Where a keyboard open puts focus, as it does for the popover presentation. */
  keyboardFocus: (page: Page) => Locator
  /** The key on the focused trigger that opens it. Defaults to Enter. */
  openKey?: string
  /** Whether a viewport `::backdrop` dims the page, rather than a backdrop part. */
  dimsViewport: boolean
}

const sheets: Sheet[] = [
  {
    fixture: "popover",
    component: "popover",
    trigger: (page) => page.getByRole("button", { name: "Profile" }),
    popup: (page) => page.getByRole("dialog", { name: "Edit profile" }),
    keyboardFocus: (page) =>
      page.getByRole("textbox", { name: "Display name" }),
    dimsViewport: true,
  },
  {
    fixture: "dialog",
    component: "dialog",
    trigger: (page) => page.getByRole("button", { name: "Edit profile" }),
    popup: (page) => page.getByRole("dialog", { name: "Profile settings" }),
    keyboardFocus: (page) =>
      page.getByRole("textbox", { name: "Display name" }),
    dimsViewport: false,
  },
  {
    fixture: "menu",
    component: "menu",
    trigger: (page) => page.getByRole("button", { name: "File" }),
    popup: (page) => menuNamed(page, "File"),
    keyboardFocus: (page) => page.getByRole("menuitem", { name: "New file" }),
    dimsViewport: true,
  },
  {
    fixture: "select",
    component: "select",
    trigger: (page) => page.getByRole("combobox", { name: "Fruit" }),
    popup: (page) => page.getByRole("listbox"),
    keyboardFocus: (page) => page.getByRole("option", { name: "Apple" }),
    dimsViewport: true,
  },
  {
    fixture: "combobox",
    component: "combobox",
    trigger: (page) => page.getByRole("combobox", { name: "Country" }),
    popup: (page) => page.locator('[data-slot="combobox-content"]'),
    keyboardFocus: (page) => page.getByRole("combobox", { name: "Country" }),
    openKey: "ArrowDown",
    dimsViewport: true,
  },
  {
    fixture: "autocomplete",
    component: "autocomplete",
    trigger: (page) => page.getByRole("combobox", { name: "Fruit" }),
    popup: (page) => page.locator('[data-slot="autocomplete-content"]'),
    keyboardFocus: (page) => page.getByRole("combobox", { name: "Fruit" }),
    openKey: "ArrowDown",
    dimsViewport: true,
  },
]

// Opens with the keyboard, from the focused trigger.
async function openWithKeyboard(page: Page, sheet: Sheet) {
  await sheet.trigger(page).focus()
  await page.keyboard.press(sheet.openKey ?? "Enter")
  await expect(sheet.keyboardFocus(page)).toBeFocused()
}

// The last open change the component reported, from the development history.
function lastOpenChange(page: Page, component: string) {
  return page.evaluate((component) => {
    const history = (
      globalThis as unknown as Record<
        symbol,
        {
          changes: {
            component: string
            key: string
            value: unknown
            reason: string
          }[]
        }
      >
    )[Symbol.for("ui-sdk.devtools.history@1")]
    const change = history.changes
      .filter((entry) => entry.component === component && entry.key === "open")
      .at(-1)
    return change && `${change.value}:${change.reason}`
  }, component)
}

// Drags the sheet down from just inside its top edge, with pointer events
// dispatched in the page every 16ms, so the release velocity is the same on
// every machine. The edge is padding, which a mouse may drag from.
async function swipeDown(popup: Locator, distance: number) {
  await popup.evaluate(async (el, distance) => {
    // From the top of its content, so the drag moves the sheet rather than scrolling a list.
    el.scrollTop = 0
    const box = el.getBoundingClientRect()
    const x = box.left + box.width / 2
    const y = box.top + 2
    const target = document.elementFromPoint(x, y) ?? el
    const fire = (type: string, at: number, buttons: number) =>
      target.dispatchEvent(
        new PointerEvent(type, {
          bubbles: true,
          cancelable: true,
          composed: true,
          pointerId: 9,
          pointerType: "mouse",
          isPrimary: true,
          button: 0,
          buttons,
          clientX: x,
          clientY: at,
        })
      )
    fire("pointerdown", y, 1)
    for (let step = 1; step <= 12; step++) {
      await new Promise((resolve) => setTimeout(resolve, 16))
      fire("pointermove", y + (distance * step) / 12, 1)
    }
    fire("pointerup", y + distance, 0)
  }, distance)
}

async function openSheet(page: Page, sheet: Sheet) {
  await sheet.trigger(page).click()
  await expect(sheet.popup(page)).toBeVisible()
  await waitForStill(sheet.popup(page))
}

// A phone: a narrow screen that only takes touch, where `"auto"` picks the sheet.
async function phone(browser: Browser, baseURL: string | undefined) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 700 },
    hasTouch: true,
    isMobile: true,
    baseURL,
  })
  return { context, page: await context.newPage() }
}

for (const sheet of sheets) {
  test.describe(sheet.component, () => {
    test.beforeEach(async ({ open }) => {
      await open(sheet.fixture, { presentation: "sheet" })
    })

    test("opens at the bottom of the screen, inside a viewport in the top layer", async ({
      page,
    }) => {
      await openWithKeyboard(page, sheet)
      await waitForStill(sheet.popup(page))
      const popup = sheet.popup(page)
      await expect(popup).toHaveAttribute("data-presentation", "sheet")
      expect(
        await popup.evaluate((el) =>
          el.parentElement!.matches(':popover-open[data-slot$="-viewport"]')
        )
      ).toBe(true)
      const box = (await popup.boundingBox())!
      expect(Math.round(box.y + box.height)).toBe(page.viewportSize()!.height)
    })

    test("a swipe down closes it with the swipe reason and returns focus to the trigger", async ({
      page,
    }) => {
      await openWithKeyboard(page, sheet)
      await waitForStill(sheet.popup(page))
      const { height } = (await sheet.popup(page).boundingBox())!
      await swipeDown(sheet.popup(page), height * 0.8)
      await expect(sheet.popup(page)).toBeHidden()
      expect(await lastOpenChange(page, sheet.component)).toBe("false:swipe")
      await expect(sheet.trigger(page)).toBeFocused()
    })

    test("a short swipe springs back and keeps it open", async ({ page }) => {
      await openWithKeyboard(page, sheet)
      await waitForStill(sheet.popup(page))
      const before = (await sheet.popup(page).boundingBox())!
      await swipeDown(sheet.popup(page), 12)
      await waitForStill(sheet.popup(page))
      expect(Math.round((await sheet.popup(page).boundingBox())!.y)).toBe(
        Math.round(before.y)
      )
      await expect(sheet.popup(page)).toBeVisible()
    })

    test("Escape closes it and returns focus to the trigger", async ({
      page,
    }) => {
      await openWithKeyboard(page, sheet)
      await page.keyboard.press("Escape")
      await expect(sheet.popup(page)).toBeHidden()
      expect(await lastOpenChange(page, sheet.component)).toBe(
        "false:escape-key"
      )
      await expect(sheet.trigger(page)).toBeFocused()
    })

    test("a press on the dim closes it", async ({ page }) => {
      await openWithKeyboard(page, sheet)
      await waitForStill(sheet.popup(page))
      await page.mouse.click(8, 8)
      await expect(sheet.popup(page)).toBeHidden()
      expect(await lastOpenChange(page, sheet.component)).toBe(
        "false:outside-press"
      )
    })

    test("a keyboard open moves focus in as the popover presentation does", async ({
      page,
    }) => {
      await openWithKeyboard(page, sheet)
    })

    test("the dim is the viewport's backdrop, colored by --sheet-backdrop", async ({
      page,
    }) => {
      test.skip(!sheet.dimsViewport, "A backdrop part dims instead.")
      await page.addStyleTag({
        content:
          '[data-presentation="sheet"] { --sheet-backdrop: rgb(255 0 0 / 0.5) }',
      })
      await openWithKeyboard(page, sheet)
      const dim = await sheet
        .popup(page)
        .evaluate(
          (el) =>
            getComputedStyle(el.parentElement!, "::backdrop").backgroundColor
        )
      expect(dim).toBe("rgba(255, 0, 0, 0.5)")
    })
  })

  test.describe(`${sheet.component} with presentation auto`, () => {
    test("is a sheet on a phone", async ({ browser, baseURL, framework }) => {
      test.skip(
        !hasFixture(sheet.fixture, framework),
        `No ${sheet.fixture} fixture for ${framework}.`
      )
      test.skip(
        test.info().project.use.browserName === "firefox",
        "Firefox has no mobile emulation."
      )
      const { context, page } = await phone(browser, baseURL)
      await page.goto(
        `/?fixture=${sheet.fixture}&framework=${framework}&presentation=auto`
      )
      await page.locator("body[data-mounted]").waitFor({ state: "attached" })
      await sheet.trigger(page).tap()
      await expect(sheet.popup(page)).toHaveAttribute(
        "data-presentation",
        "sheet"
      )
      await waitForStill(sheet.popup(page))
      const box = (await sheet.popup(page).boundingBox())!
      expect(Math.round(box.y + box.height)).toBe(700)
      await context.close()
    })

    test("stays a popover without a touch screen", async ({ page, open }) => {
      await open(sheet.fixture, { presentation: "auto" })
      await openWithKeyboard(page, sheet)
      await expect(sheet.popup(page)).not.toHaveAttribute(
        "data-presentation",
        "sheet"
      )
      expect(
        await sheet.popup(page).evaluate((el) => el.matches(":popover-open"))
      ).toBe(true)
    })
  })
}

test.describe("select", () => {
  test("choosing an option closes the sheet and shows the value", async ({
    page,
    open,
  }) => {
    await open("select", { presentation: "sheet" })
    await openSheet(page, sheets[3])
    await page.getByRole("option", { name: "Cherry" }).click()
    await expect(page.getByRole("listbox")).toBeHidden()
    await expect(page.getByRole("combobox", { name: "Fruit" })).toContainText(
      "Cherry"
    )
    await expect(page.getByRole("combobox", { name: "Fruit" })).toBeFocused()
  })

  test("a tap opens it with the selected option scrolled into view, and focus on the sheet", async ({
    browser,
    baseURL,
    framework,
  }) => {
    test.skip(
      !hasFixture("select", framework),
      `No select fixture for ${framework}.`
    )
    test.skip(
      test.info().project.use.browserName === "firefox",
      "Firefox has no mobile emulation."
    )
    const { context, page } = await phone(browser, baseURL)
    await page.goto(
      `/?fixture=select&framework=${framework}&presentation=sheet&value=orange`
    )
    await page.locator("body[data-mounted]").waitFor({ state: "attached" })
    // A short list, so the last option starts out of view.
    await page.addStyleTag({
      content: '[data-slot="select-content"] { max-height: 96px }',
    })
    await page.getByRole("combobox", { name: "Fruit" }).tap()
    const list = page.getByRole("listbox")
    await waitForStill(list)
    const shown = await page
      .getByRole("option", { name: "Orange" })
      .evaluate((option) => {
        const box = option.getBoundingClientRect()
        const area = option
          .closest('[data-slot="select-content"]')!
          .getBoundingClientRect()
        return box.top >= area.top - 1 && box.bottom <= area.bottom + 1
      })
    expect(shown).toBe(true)
    // Focus in the sheet. Chromium's tap focuses the sheet itself, and WebKit's, a click, the selected option.
    expect(
      await list.evaluate((el) =>
        el
          .closest('[data-slot="select-content"]')!
          .contains(document.activeElement)
      )
    ).toBe(true)
    await context.close()
  })
})

// Open from the start, `"auto"` renders the default on the server and in the
// first render, so hydration matches, and decides once the client has bound it.
test.describe("open from the start with presentation auto", () => {
  for (const sheet of sheets.slice(0, 4)) {
    test(`${sheet.component} hydrates as its default, then becomes a sheet on a phone`, async ({
      browser,
      baseURL,
      framework,
    }) => {
      test.skip(
        !framework.endsWith("-ssr"),
        "Only for server-rendered fixtures."
      )
      test.skip(
        !hasFixture(sheet.fixture, framework),
        `No ${sheet.fixture} fixture for ${framework}.`
      )
      const { context, page } = await phone(browser, baseURL)
      await page.goto(
        `/?fixture=${sheet.fixture}&framework=${framework}&presentation=auto&open`
      )
      await page.locator("body[data-mounted]").waitFor({ state: "attached" })
      await expect(sheet.popup(page)).toHaveAttribute(
        "data-presentation",
        "sheet"
      )
      await waitForStill(sheet.popup(page))
      const box = (await sheet.popup(page).boundingBox())!
      expect(Math.round(box.y + box.height)).toBe(700)
      const errors = await page.evaluate(
        () =>
          (window as unknown as { __hydrationErrors: string[] })
            .__hydrationErrors
      )
      expect(errors).toEqual([])
      await context.close()
    })
  }
})

// Combobox and Autocomplete: the input moves into the sheet's header, and a
// tap never opens the keyboard until the input itself is tapped.
for (const sheet of sheets.slice(4)) {
  test.describe(`${sheet.component} input`, () => {
    const header = `[data-slot="${sheet.component}-header"]`

    // A phone, with a sheet tall enough to rest at half the screen.
    async function tapOpen(
      browser: Browser,
      baseURL: string | undefined,
      framework: string,
      options = ""
    ) {
      test.skip(
        !hasFixture(sheet.fixture, framework),
        `No ${sheet.fixture} fixture for ${framework}.`
      )
      test.skip(
        test.info().project.use.browserName === "firefox",
        "Firefox has no mobile emulation."
      )
      const { context, page } = await phone(browser, baseURL)
      await page.goto(
        `/?fixture=${sheet.fixture}&framework=${framework}&presentation=sheet${options}`
      )
      await page.locator("body[data-mounted]").waitFor({ state: "attached" })
      await page.addStyleTag({
        content: `[data-slot="${sheet.component}-content"] { height: 600px; max-height: none }`,
      })
      await sheet.trigger(page).tap()
      await expect(sheet.popup(page)).toBeVisible()
      await waitForStill(sheet.popup(page))
      return { context, page }
    }

    test("ArrowDown opens the sheet at the top of its list, not scrolled under the header", async ({
      page,
      open,
    }) => {
      await page.setViewportSize({ width: 375, height: 700 })
      await open(sheet.fixture, { presentation: "sheet" })
      await openWithKeyboard(page, sheet)
      await waitForStill(sheet.popup(page))
      // Waits until the list has stopped scrolling, then reads where it rests.
      const scrollTop = await sheet.popup(page).evaluate(
        (el) =>
          new Promise<number>((resolve) => {
            let timer = setTimeout(() => resolve(el.scrollTop), 300)
            el.addEventListener("scroll", () => {
              clearTimeout(timer)
              timer = setTimeout(() => resolve(el.scrollTop), 300)
            })
          })
      )
      expect(scrollTop).toBe(0)
    })

    test("a tap opens the sheet with the input in its header, unfocused, and focus on the sheet", async ({
      browser,
      baseURL,
      framework,
    }) => {
      const { context, page } = await tapOpen(browser, baseURL, framework)
      await expect(page.locator(header).getByRole("combobox")).toHaveCount(1)
      await expect(page.getByRole("combobox")).toHaveCount(1)
      await expect(sheet.trigger(page)).not.toBeFocused()
      await expect(sheet.popup(page)).toBeFocused()
      // At half the screen, since the keyboard is closed.
      expect(Math.round((await sheet.popup(page).boundingBox())!.y)).toBe(350)
      await context.close()
    })

    test("tapping the input in the header focuses it and grows the sheet to its largest snap point", async ({
      browser,
      baseURL,
      framework,
    }) => {
      const { context, page } = await tapOpen(browser, baseURL, framework)
      await sheet.trigger(page).tap()
      await expect(sheet.trigger(page)).toBeFocused()
      await expect
        .poll(async () =>
          Math.round((await sheet.popup(page).boundingBox())!.y)
        )
        .toBe(100)
      await context.close()
    })

    test("the keyboard going away keeps the sheet open, with the text", async ({
      browser,
      baseURL,
      framework,
    }) => {
      const { context, page } = await tapOpen(browser, baseURL, framework)
      await sheet.trigger(page).tap()
      await page.keyboard.type("a")
      await sheet.trigger(page).evaluate((input) => input.blur())
      await expect(sheet.popup(page)).toBeVisible()
      await expect(sheet.trigger(page)).toHaveValue("a")
      await context.close()
    })

    test("choosing an option closes the sheet and puts the input back in place", async ({
      browser,
      baseURL,
      framework,
    }) => {
      // The list cancels its items' pointerdown to keep focus, and WebKit's emulated
      // tap then fires no click, sheet or not. An iPhone check in the report.
      test.skip(
        test.info().project.use.browserName === "webkit",
        "WebKit's emulated tap fires no click here."
      )
      const { context, page } = await tapOpen(browser, baseURL, framework)
      await page.getByRole("option").first().tap()
      await expect(sheet.popup(page)).toBeHidden()
      await expect(page.locator(header)).toHaveCount(0)
      await expect(sheet.trigger(page)).not.toHaveValue("")
      await expect(sheet.trigger(page)).not.toBeFocused()
      await context.close()
    })

    test("a keyboard open keeps focus in the input as it moves into the header, and typing filters", async ({
      page,
      open,
    }) => {
      await open(sheet.fixture, { presentation: "sheet" })
      await openWithKeyboard(page, sheet)
      await expect(page.locator(header).getByRole("combobox")).toBeFocused()
      const all = await page.getByRole("option").count()
      await page.keyboard.type("a")
      await expect
        .poll(() => page.getByRole("option").count())
        .toBeLessThan(all)
      await page.keyboard.press("Escape")
      await expect(sheet.popup(page)).toBeHidden()
      await expect(sheet.trigger(page)).toBeFocused()
    })

    test("the input in the header comes before the options, so it's read and reached first", async ({
      page,
      open,
    }) => {
      await open(sheet.fixture, { presentation: "sheet" })
      await openWithKeyboard(page, sheet)
      const first = await page
        .locator(header)
        .getByRole("combobox")
        .evaluate((input) => {
          const option = document.querySelector('[role="option"]')!
          return !!(
            input.compareDocumentPosition(option) &
            Node.DOCUMENT_POSITION_FOLLOWING
          )
        })
      expect(first).toBe(true)
    })
  })
}

// A sheet is modal unless the app says otherwise, like iOS's sheets, even
// for popups that aren't modal by default.
for (const sheet of [sheets[0], sheets[4]]) {
  test.describe(`${sheet.component} modality as a sheet`, () => {
    // Whether the page behind the sheet is inert and its scroll locked.
    const pageBlocked = (page: Page) =>
      page.getByRole("button", { name: "Before" }).evaluate((before) => {
        const scroller = [document.documentElement, document.body].some(
          (el) => getComputedStyle(el).overflow === "hidden"
        )
        return { inert: !!before.closest("[inert]"), locked: scroller }
      })

    test("is modal by default: the page behind is inert and doesn't scroll", async ({
      page,
      open,
    }) => {
      await open(sheet.fixture, { presentation: "sheet" })
      await openWithKeyboard(page, sheet)
      expect(await pageBlocked(page)).toEqual({ inert: true, locked: true })
    })

    test("modal={false} keeps the page usable", async ({ page, open }) => {
      await open(sheet.fixture, { presentation: "sheet", modal: "false" })
      await openWithKeyboard(page, sheet)
      expect(await pageBlocked(page)).toEqual({ inert: false, locked: false })
    })
  })
}

// The sheet's code loads in idle time once a popup that may present as one
// is on the page, and never for one that can't. ?lazy leaves it to the popup
// instead of the playground, which loads it first for specs.
test.describe("sheet code preload", () => {
  // Every request for the sheet's code from now on.
  function sheetRequests(page: Page) {
    const urls: string[] = []
    page.on("request", (request) => {
      if (request.url().includes("sheet-presentation")) {
        urls.push(request.url())
      }
    })
    return urls
  }

  // Waits past the page's idle time, when a preload would have started.
  const idle = (page: Page) =>
    page.evaluate(
      () =>
        new Promise((resolve) =>
          (window.requestIdleCallback ?? setTimeout)(() =>
            setTimeout(resolve, 300)
          )
        )
    )

  test("a sheet loads it after mount, once, without opening", async ({
    page,
    open,
  }) => {
    const requests = sheetRequests(page)
    await open("popover", { presentation: "sheet", lazy: "" })
    await expect.poll(() => requests.length).toBe(1)
    await idle(page)
    expect(requests).toHaveLength(1)
    await expect(page.getByRole("dialog")).toHaveCount(0)
  })

  test('"popover" never loads it', async ({ page, open }) => {
    const requests = sheetRequests(page)
    await open("popover", { presentation: "popover", lazy: "" })
    await idle(page)
    expect(requests).toEqual([])
  })

  test('"auto" with a fine pointer never loads it', async ({ page, open }) => {
    const requests = sheetRequests(page)
    await open("popover", { presentation: "auto", lazy: "" })
    await idle(page)
    expect(requests).toEqual([])
  })

  test('"auto" on a touch screen loads it', async ({
    browser,
    baseURL,
    framework,
  }) => {
    test.skip(
      !hasFixture("popover", framework),
      `No popover fixture for ${framework}.`
    )
    test.skip(
      test.info().project.use.browserName === "firefox",
      "Firefox has no mobile emulation."
    )
    const { context, page } = await phone(browser, baseURL)
    const requests = sheetRequests(page)
    await page.goto(
      `/?fixture=popover&framework=${framework}&presentation=auto&lazy`
    )
    await page.locator("body[data-mounted]").waitFor({ state: "attached" })
    await expect.poll(() => requests.length).toBe(1)
    await context.close()
  })
})

// The sheet's code loads with `import()` the first time a popup presents as
// one. A web component takes `presentation` after it's on the page, so the
// code isn't loaded yet when it opens.
test.describe("sheet code that loads late", () => {
  test.beforeEach(async ({ framework, open, page }) => {
    test.skip(
      framework !== "web",
      "Set after mount through the web component's attribute."
    )
    await open("popover")
    await page
      .locator(".fixture > ui-popover")
      .evaluate((el) => el.setAttribute("presentation", "sheet"))
  })

  test("a popup that leaves the page before the code arrives never shows", async ({
    page,
  }) => {
    let release!: () => void
    const held = new Promise<void>((resolve) => (release = resolve))
    await page.route("**/sheet-presentation*", async (route) => {
      await held
      await route.continue()
    })
    const requested = page.waitForRequest("**/sheet-presentation*")
    await page.getByRole("button", { name: "Profile" }).click()
    await requested
    await page.locator(".fixture > ui-popover").evaluate((el) => el.remove())
    const loaded = page.waitForResponse("**/sheet-presentation*")
    release()
    await loaded
    await page.evaluate(() => new Promise(requestAnimationFrame))
    expect(
      await page.evaluate(
        () => document.querySelectorAll(":popover-open").length
      )
    ).toBe(0)
  })

  test("code that fails to load shows the popup as it would be without a sheet", async ({
    page,
  }) => {
    await page.route("**/sheet-presentation*", (route) => route.abort())
    await page.getByRole("button", { name: "Profile" }).click()
    await expect(
      page.getByRole("dialog", { name: "Edit profile" })
    ).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(
      page.getByRole("dialog", { name: "Edit profile" })
    ).toBeHidden()
  })
})

test.describe("combobox with multiple", () => {
  test("choosing keeps the sheet open", async ({ page, open }) => {
    await open("combobox", { presentation: "sheet", multiple: "" })
    await openWithKeyboard(page, sheets[4])
    await page.getByRole("option", { name: "Brazil" }).click()
    await expect(page.getByRole("option", { name: "Brazil" })).toHaveAttribute(
      "aria-selected",
      "true"
    )
    await expect(sheets[4].popup(page)).toBeVisible()
  })
})

test.describe("menu drill-in", () => {
  test.beforeEach(async ({ open, page }) => {
    await open("menu", { presentation: "sheet" })
    await openSheet(page, sheets[2])
  })

  test("a submenu shows in its parent's place, under its trigger, and the sheet springs to its height", async ({
    page,
  }) => {
    const sheet = menuNamed(page, "File")
    const full = (await sheet.boundingBox())!
    await page.getByRole("menuitem", { name: "Share" }).click()
    await expect(menuNamed(page, "Share")).toBeVisible()
    await expect(page.getByRole("menuitem", { name: "New file" })).toBeHidden()
    // It springs down from where it was drawn to rest at the bottom again.
    const bottom = async () => {
      const box = (await sheet.boundingBox())!
      return Math.round(box.y + box.height)
    }
    await expect.poll(bottom).toBe(page.viewportSize()!.height)
    const drilled = (await sheet.boundingBox())!
    expect(drilled.height).toBeLessThan(full.height)
    // Measured together, so the sheet can't move in between.
    const gap = await menuNamed(page, "Share").evaluate((submenu) => {
      const trigger = document.querySelector(`[aria-controls="${submenu.id}"]`)!
      return (
        submenu.getBoundingClientRect().top -
        trigger.getBoundingClientRect().bottom
      )
    })
    expect(gap).toBeGreaterThanOrEqual(-1)
  })

  test("pressing the trigger again goes back, to the full height", async ({
    page,
  }) => {
    const sheet = menuNamed(page, "File")
    const full = (await sheet.boundingBox())!
    await page.getByRole("menuitem", { name: "Share" }).click()
    await expect(menuNamed(page, "Share")).toBeVisible()
    await page.getByRole("menuitem", { name: "Share" }).click()
    await expect(menuNamed(page, "Share")).toBeHidden()
    await expect(page.getByRole("menuitem", { name: "New file" })).toBeVisible()
    await expect
      .poll(async () => Math.round((await sheet.boundingBox())!.y))
      .toBe(Math.round(full.y))
    expect(Math.round((await sheet.boundingBox())!.height)).toBe(
      Math.round(full.height)
    )
  })

  test("the keys go down and up a level, and focus follows", async ({
    page,
  }) => {
    const share = page.getByRole("menuitem", { name: "Share" })
    await share.focus()
    await page.keyboard.press("ArrowRight")
    await expect(page.getByRole("menuitem", { name: "Email" })).toBeFocused()
    await page.keyboard.press("ArrowLeft")
    await expect(menuNamed(page, "Share")).toBeHidden()
    await expect(share).toBeFocused()
    await expect(page.getByRole("menuitem", { name: "New file" })).toBeVisible()
  })

  test("choosing an item in a submenu closes the whole sheet", async ({
    page,
  }) => {
    await page.getByRole("menuitem", { name: "Share" }).click()
    await page.getByRole("menuitem", { name: "Email" }).click()
    await expect(menuNamed(page, "File")).toBeHidden()
  })
})
