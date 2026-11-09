import type { CDPSession, Page } from "@playwright/test"
import { expect, test } from "../fixtures"
import { budgets } from "../perf/budgets"
import {
  addedListeners,
  countFrames,
  listenersNow,
  snapshot,
  type LeakSnapshot,
} from "../perf/leaks"

// Leak gates: open and close a popup or a panel 200 times, move through tabs
// a toolbar or a tree, or drag a slider, a resizable handle or a scroll area's thumb,
// then mount and unmount it 200 times, and nothing it added stays behind. See
// tests/perf/budgets.ts.

// How each popup or panel opens and closes from the keyboard, from its trigger.
// A collapsible's panel has no role, so it's found by its class.
const popups = {
  menu: { trigger: "button", popup: "menu", open: "Enter", close: "Escape" },
  select: {
    trigger: "combobox",
    popup: "listbox",
    open: "Enter",
    close: "Escape",
  },
  combobox: {
    trigger: "combobox",
    popup: "listbox",
    open: "ArrowDown",
    close: "Escape",
  },
  popover: {
    trigger: "button",
    popup: "dialog",
    open: "Enter",
    close: "Escape",
  },
  dialog: {
    trigger: "button",
    popup: "dialog",
    open: "Enter",
    close: "Escape",
  },
  // Keyboard focus shows a tooltip at once, and moving it away hides it.
  tooltip: {
    trigger: "button",
    popup: "tooltip",
    open: "Tab",
    close: "Shift+Tab",
  },
  accordion: {
    trigger: "button",
    popup: "region",
    open: "Enter",
    close: "Enter",
  },
  collapsible: {
    trigger: "button",
    popup: ".collapsible-panel",
    open: "Enter",
    close: "Enter",
  },
} as const

// Panels that animate their height when the page asks, so unmounting one while
// it opens stops an animation in flight.
const animated: Name[] = ["accordion", "collapsible"]

const withArticle = (name: string) =>
  `${/^[aeiou]/.test(name) ? "an" : "a"} ${name}`

type Name = keyof typeof popups

function parts(page: Page, name: Name) {
  const { trigger, popup } = popups[name]
  return {
    trigger: page.getByRole(trigger, { name: "Open", exact: true }),
    popup:
      popup === ".collapsible-panel"
        ? page.locator(popup)
        : page.getByRole(popup),
  }
}

// Focus where the open key starts from: the trigger, or before it for a tooltip.
async function focusTrigger(page: Page, name: Name) {
  if (name === "tooltip") {
    await page.getByRole("button", { name: "Before" }).focus()
  } else {
    await parts(page, name).trigger.focus()
  }
}

async function openAndClose(page: Page, name: Name, times: number) {
  const { popup } = parts(page, name)
  await focusTrigger(page, name)
  for (let time = 0; time < times; time++) {
    await page.keyboard.press(popups[name].open)
    await popup.waitFor()
    await page.keyboard.press(popups[name].close)
    await popup.waitFor({ state: "hidden" })
  }
}

// Clicks Toggle `times` times from the page, a frame apart so effects run.
// An even number leaves the popup mounted.
async function toggle(page: Page, times: number) {
  await page.evaluate(async (times) => {
    const button = [...document.querySelectorAll("button")].find(
      ({ textContent }) => textContent === "Toggle"
    )!
    for (let time = 0; time < times; time++) {
      button.click()
      await new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve))
      )
    }
  }, times)
}

// Vue's development build keeps devtools events, with the elements they
// name, for the first 3 seconds after it starts, in case devtools connect,
// then drops them and clears `__VUE_DEVTOOLS_HOOK_REPLAY__`. Other frameworks
// never set it, so they don't wait. Called after the warmup, which runs while
// Vue waits, and before the first snapshot.
async function waitOutDevtools(page: Page) {
  await page.waitForFunction(
    () =>
      !(window as { __VUE_DEVTOOLS_HOOK_REPLAY__?: unknown[] | null })
        .__VUE_DEVTOOLS_HOOK_REPLAY__,
    undefined,
    { polling: 100 }
  )
}

function expectNothingLeft(
  before: LeakSnapshot,
  after: LeakSnapshot,
  budget: {
    listeners: number
    frames: number
    layers: number
    detached: number
    heapKB: number
  },
  see: string
) {
  const added = addedListeners(before, after)
  expect
    .soft(
      Object.values(added).reduce((sum, count) => sum + count, 0),
      `Listeners left: ${JSON.stringify(added)}. ${see}`
    )
    .toBeLessThanOrEqual(budget.listeners)
  expect
    .soft(after.frames - before.frames, `Animation frames left pending. ${see}`)
    .toBeLessThanOrEqual(budget.frames)
  expect
    .soft(after.layers.open, `Layers left open. ${see}`)
    .toBeLessThanOrEqual(budget.layers)
  expect
    .soft(after.layers.listening, `The layer stack still listens. ${see}`)
    .toBe(before.layers.listening)
  expect
    .soft(
      after.detached.length - before.detached.length,
      `Detached parts: ${after.detached.join(", ")}. ${see}`
    )
    .toBeLessThanOrEqual(budget.detached)
  expect
    .soft((after.heap - before.heap) / 1024, `Heap growth in KB. ${see}`)
    .toBeLessThanOrEqual(budget.heapKB)
}

function report(name: string, before: LeakSnapshot, after: LeakSnapshot) {
  if (process.env.PERF_REPORT) {
    console.log(
      `[perf] ${test.info().project.name} ${name} ${JSON.stringify({
        listeners: addedListeners(before, after),
        frames: [before.frames, after.frames],
        layers: [before.layers, after.layers],
        detached: [
          before.detached.length,
          after.detached.length,
          after.detached.slice(0, 12),
        ],
        heapKB: Math.round((after.heap - before.heap) / 1024),
        heapMB: [before.heap, after.heap].map(
          (size) => Math.round(size / 1e5) / 10
        ),
      })}`
    )
  }
}

// Most of a leak spec's time is waiting for frames: every mount and unmount
// waits two, and each popup waits for its own. Unthrottled, Chromium draws
// them as soon as they're ready instead of at 60 a second, and every step
// still waits for the same frames. Launch options can't be set in a describe.
test.use({
  launchOptions: {
    args: ["--disable-frame-rate-limit", "--disable-gpu-vsync"],
  },
})

// Unmounts and mounts the component again while `press` holds a drag, then
// lifts the pointer. With `check`, the drag's listeners must be gone before
// it lifts: a drag ends with its component, not with the next pointerup.
async function toggleWhileHeld(
  page: Page,
  cdp: CDPSession,
  press: () => Promise<void>,
  check: boolean
) {
  const idle = check ? await listenersNow(cdp) : undefined
  await press()
  await toggle(page, 2)
  if (idle) {
    const added = addedListeners(
      { listeners: idle },
      { listeners: await listenersNow(cdp) }
    )
    expect
      .soft(
        Object.values(added).reduce((sum, count) => sum + count, 0),
        `Listeners left after unmounting, with the pointer still down: ${JSON.stringify(added)}. See tests/perf/README.md#leaks-unmount-open.`
      )
      .toBeLessThanOrEqual(budgets["leaks.unmount-open"].listeners)
  }
  await page.mouse.up()
}

test.describe("leaks", () => {
  test.skip(
    ({ browserName }) => browserName !== "chromium",
    "Reads listeners, detached elements and the heap through the Chrome DevTools Protocol."
  )
  test.beforeEach(async ({ page }) => {
    await countFrames(page)
  })

  for (const name of Object.keys(popups) as Name[]) {
    test(`opening and closing ${withArticle(name)} 200 times, then mounting and unmounting it 200 times, leaves nothing behind`, async ({
      page,
      open,
    }) => {
      test.setTimeout(120_000)
      const budget = budgets["leaks.cycles"]
      await open("leaks", { component: name })
      const cdp = await page.context().newCDPSession(page)
      // Warm up, so what's made once per page, compiled code included, is
      // there before counting.
      await openAndClose(page, name, 20)
      await toggle(page, 40)
      await openAndClose(page, name, 1)
      await waitOutDevtools(page)
      const before = await snapshot(page, cdp)
      await openAndClose(page, name, 200)
      // Checked before the mounts too: a leak that lives as long as the
      // component, like one per open, goes once it unmounts.
      const opened = await snapshot(page, cdp)
      report(`leaks.cycles ${name} open`, before, opened)
      expectNothingLeft(
        before,
        opened,
        budget,
        "See tests/perf/README.md#leaks-cycles."
      )
      await toggle(page, 400)
      await openAndClose(page, name, 1)
      const after = await snapshot(page, cdp)
      report(`leaks.cycles ${name} mount`, before, after)
      expectNothingLeft(
        before,
        after,
        budget,
        "See tests/perf/README.md#leaks-cycles."
      )
    })

    test(`unmounting ${withArticle(name)} while it's open 50 times leaves nothing behind`, async ({
      page,
      open,
    }) => {
      test.setTimeout(120_000)
      const budget = budgets["leaks.unmount-open"]
      await open("leaks", {
        component: name,
        ...(animated.includes(name) && { animate: "" }),
      })
      const cdp = await page.context().newCDPSession(page)
      const unmountOpen = async (times: number) => {
        for (let time = 0; time < times; time++) {
          await focusTrigger(page, name)
          await page.keyboard.press(popups[name].open)
          await parts(page, name).popup.waitFor()
          await toggle(page, 2)
          await parts(page, name).trigger.waitFor()
        }
      }
      await unmountOpen(10)
      await waitOutDevtools(page)
      const before = await snapshot(page, cdp)
      await unmountOpen(50)
      const after = await snapshot(page, cdp)
      report(`leaks.unmount-open ${name}`, before, after)
      expectNothingLeft(
        before,
        after,
        budget,
        "See tests/perf/README.md#leaks-unmount-open."
      )
    })

    // Without a warmup, so nothing the last popup closed left behind is in
    // the starting values. A page that navigates away unmounts it the same
    // way, and whatever still holds one of its parts holds the whole page.
    // Toggle is clicked like a link, which moves focus first: React keeps the
    // last focused text field until focus leaves it, and removing it doesn't.
    test(`unmounting ${withArticle(name)} after it opens and closes once leaves none of its parts alive`, async ({
      page,
      open,
    }) => {
      await open("leaks", { component: name })
      const cdp = await page.context().newCDPSession(page)
      await openAndClose(page, name, 1)
      await page.getByRole("button", { name: "Toggle", exact: true }).click()
      await waitOutDevtools(page)
      const { detached } = await snapshot(page, cdp)
      expect(
        detached,
        "Parts alive after unmounting. See tests/perf/README.md#leaks-cycles."
      ).toHaveLength(budgets["leaks.cycles"].detached)
    })
  }

  // A slider listens on the document while a thumb is dragged.
  async function grabThumb(page: Page) {
    const box = (await page.locator(".slider-thumb").boundingBox())!
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
    await page.mouse.down()
  }

  // Where the pointer is `x` pixels from the thumb's center.
  async function besideThumb(page: Page, x: number) {
    const box = (await page.locator(".slider-thumb").boundingBox())!
    return [box.x + box.width / 2 + x, box.y + box.height / 2] as const
  }

  // Drags the thumb right and back `times` times, then steps it right and back
  // with keys, so it ends where it started.
  async function dragAndStep(page: Page, times: number) {
    for (let time = 0; time < times; time++) {
      for (const x of [20, -20]) {
        await grabThumb(page)
        await page.mouse.move(...(await besideThumb(page, x)), { steps: 2 })
        await page.mouse.up()
      }
    }
    await page.getByRole("slider", { name: "Volume" }).focus()
    for (let time = 0; time < times; time++) {
      await page.keyboard.press("ArrowRight")
      await page.keyboard.press("ArrowLeft")
    }
  }

  test("dragging a slider 200 times, then mounting and unmounting it 200 times, leaves nothing behind", async ({
    page,
    open,
  }) => {
    test.setTimeout(120_000)
    const budget = budgets["leaks.cycles"]
    await open("leaks", { component: "slider" })
    const cdp = await page.context().newCDPSession(page)
    // Warm up, as for the popups.
    await dragAndStep(page, 10)
    await toggle(page, 40)
    await dragAndStep(page, 1)
    await waitOutDevtools(page)
    const before = await snapshot(page, cdp)
    await dragAndStep(page, 100)
    const dragged = await snapshot(page, cdp)
    report("leaks.cycles slider drag", before, dragged)
    expectNothingLeft(
      before,
      dragged,
      budget,
      "See tests/perf/README.md#leaks-cycles."
    )
    await toggle(page, 400)
    await dragAndStep(page, 1)
    const after = await snapshot(page, cdp)
    report("leaks.cycles slider mount", before, after)
    expectNothingLeft(
      before,
      after,
      budget,
      "See tests/perf/README.md#leaks-cycles."
    )
  })

  test("unmounting a slider in the middle of a drag 50 times leaves nothing behind", async ({
    page,
    open,
  }) => {
    test.setTimeout(120_000)
    const budget = budgets["leaks.unmount-open"]
    await open("leaks", { component: "slider" })
    const cdp = await page.context().newCDPSession(page)
    const unmountDragging = async (times: number, check = false) => {
      for (let time = 0; time < times; time++) {
        await toggleWhileHeld(
          page,
          cdp,
          async () => {
            await grabThumb(page)
            await page.mouse.move(...(await besideThumb(page, 10)), {
              steps: 2,
            })
          },
          check
        )
        await page.locator(".slider-thumb").waitFor()
      }
    }
    await unmountDragging(10)
    await waitOutDevtools(page)
    const before = await snapshot(page, cdp)
    await unmountDragging(50, true)
    const after = await snapshot(page, cdp)
    report("leaks.unmount-open slider", before, after)
    expectNothingLeft(
      before,
      after,
      budget,
      "See tests/perf/README.md#leaks-unmount-open."
    )
  })

  // Tabs select on focus, so each arrow key moves focus and swaps the panel.
  // A tree's first item expands, focus moves into its group and back, and it
  // collapses, so its group mounts and unmounts.
  const roving = { tabs: "tab", toolbar: "button", tree: "treeitem" } as const
  type Roving = keyof typeof roving
  const keys = (name: Roving) =>
    name === "tree"
      ? ["ArrowRight", "ArrowDown", "ArrowUp", "ArrowLeft"]
      : ["ArrowRight", "ArrowRight", "ArrowLeft", "ArrowLeft"]

  const firstItem = (page: Page, name: Roving) =>
    page.getByRole(roving[name], { name: "Item 1", exact: true })

  // Moves through the items and back `times` times, so focus ends where it started.
  async function moveThrough(page: Page, name: Roving, times: number) {
    await firstItem(page, name).focus()
    for (let time = 0; time < times; time++) {
      for (const key of keys(name)) {
        await page.keyboard.press(key)
      }
    }
  }

  for (const name of Object.keys(roving) as Roving[]) {
    test(`moving through ${name} with the arrow keys 200 times, then mounting and unmounting it 200 times, leaves nothing behind`, async ({
      page,
      open,
    }) => {
      test.setTimeout(120_000)
      const budget = budgets["leaks.cycles"]
      await open("leaks", { component: name })
      const cdp = await page.context().newCDPSession(page)
      // Warm up, as for the popups.
      await moveThrough(page, name, 10)
      await toggle(page, 40)
      await moveThrough(page, name, 1)
      await waitOutDevtools(page)
      const before = await snapshot(page, cdp)
      await moveThrough(page, name, 100)
      const moved = await snapshot(page, cdp)
      report(`leaks.cycles ${name} keys`, before, moved)
      expectNothingLeft(
        before,
        moved,
        budget,
        "See tests/perf/README.md#leaks-cycles."
      )
      await toggle(page, 400)
      await moveThrough(page, name, 1)
      const after = await snapshot(page, cdp)
      report(`leaks.cycles ${name} mount`, before, after)
      expectNothingLeft(
        before,
        after,
        budget,
        "See tests/perf/README.md#leaks-cycles."
      )
    })

    test(`unmounting ${name} right after an arrow key 50 times leaves nothing behind`, async ({
      page,
      open,
    }) => {
      test.setTimeout(120_000)
      const budget = budgets["leaks.unmount-open"]
      await open("leaks", { component: name })
      const cdp = await page.context().newCDPSession(page)
      const unmountMoving = async (times: number) => {
        for (let time = 0; time < times; time++) {
          await firstItem(page, name).focus()
          await page.keyboard.press("ArrowRight")
          await toggle(page, 2)
          await firstItem(page, name).waitFor()
        }
      }
      await unmountMoving(10)
      await waitOutDevtools(page)
      const before = await snapshot(page, cdp)
      await unmountMoving(50)
      const after = await snapshot(page, cdp)
      report(`leaks.unmount-open ${name}`, before, after)
      expectNothingLeft(
        before,
        after,
        budget,
        "See tests/perf/README.md#leaks-unmount-open."
      )
    })
  }

  // A resizable group listens on the document for presses near its handles,
  // and while a handle is dragged. Returns where the handle's center was.
  async function grabHandle(page: Page) {
    const box = (await page.locator(".resizable-handle").boundingBox())!
    const center = [box.x + box.width / 2, box.y + box.height / 2] as const
    await page.mouse.move(...center)
    await page.mouse.down()
    return center
  }

  // Drags the handle right and back `times` times, then steps it right and
  // back with keys, so the layout ends where it started.
  async function resizeAndStep(page: Page, times: number) {
    for (let time = 0; time < times; time++) {
      for (const x of [40, -40]) {
        const [left, top] = await grabHandle(page)
        await page.mouse.move(left + x, top, { steps: 2 })
        await page.mouse.up()
      }
    }
    await page.getByRole("separator", { name: "Handle" }).focus()
    for (let time = 0; time < times; time++) {
      await page.keyboard.press("ArrowRight")
      await page.keyboard.press("ArrowLeft")
    }
  }

  test("resizing a resizable group 200 times, then mounting and unmounting it 200 times, leaves nothing behind", async ({
    page,
    open,
  }) => {
    test.setTimeout(120_000)
    const budget = budgets["leaks.cycles"]
    await open("leaks", { component: "resizable" })
    const cdp = await page.context().newCDPSession(page)
    // Warm up, as for the popups.
    await resizeAndStep(page, 10)
    await toggle(page, 40)
    await resizeAndStep(page, 1)
    await waitOutDevtools(page)
    const before = await snapshot(page, cdp)
    await resizeAndStep(page, 100)
    const resized = await snapshot(page, cdp)
    report("leaks.cycles resizable drag", before, resized)
    expectNothingLeft(
      before,
      resized,
      budget,
      "See tests/perf/README.md#leaks-cycles."
    )
    await toggle(page, 400)
    await resizeAndStep(page, 1)
    const after = await snapshot(page, cdp)
    report("leaks.cycles resizable mount", before, after)
    expectNothingLeft(
      before,
      after,
      budget,
      "See tests/perf/README.md#leaks-cycles."
    )
  })

  test("unmounting a resizable group in the middle of a drag 50 times leaves nothing behind", async ({
    page,
    open,
  }) => {
    test.setTimeout(120_000)
    const budget = budgets["leaks.unmount-open"]
    await open("leaks", { component: "resizable" })
    const cdp = await page.context().newCDPSession(page)
    const unmountDragging = async (times: number, check = false) => {
      for (let time = 0; time < times; time++) {
        await toggleWhileHeld(
          page,
          cdp,
          async () => {
            const [left, top] = await grabHandle(page)
            await page.mouse.move(left + 20, top, { steps: 2 })
          },
          check
        )
        await page.locator(".resizable-handle").waitFor()
      }
    }
    await unmountDragging(10)
    await waitOutDevtools(page)
    const before = await snapshot(page, cdp)
    await unmountDragging(50, true)
    const after = await snapshot(page, cdp)
    report("leaks.unmount-open resizable", before, after)
    expectNothingLeft(
      before,
      after,
      budget,
      "See tests/perf/README.md#leaks-unmount-open."
    )
  })

  // A scroll area's scrollbar shows while the pointer is over it, and its
  // thumb listens on the document while it's dragged.
  async function showScrollbar(page: Page) {
    const box = (await page.locator(".scroll-area-viewport").boundingBox())!
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
    await page.locator(".scroll-area-scrollbar[data-visible]").waitFor()
  }

  async function grabScrollThumb(page: Page) {
    const box = (await page.locator(".scroll-area-thumb").boundingBox())!
    const center = [box.x + box.width / 2, box.y + box.height / 2] as const
    await page.mouse.move(...center)
    await page.mouse.down()
    return center
  }

  // Shows the scrollbar, drags the thumb down and back and scrolls down and
  // back with the wheel twice, then leaves and waits for the scrollbar to
  // hide, `times` times, so the content ends where it started. Hiding waits
  // out the end of scrolling, so it's once per two drags.
  async function dragAndScroll(page: Page, times: number) {
    for (let time = 0; time < times; time++) {
      await showScrollbar(page)
      for (const y of [40, -40, 40, -40]) {
        const [left, top] = await grabScrollThumb(page)
        await page.mouse.move(left, top + y, { steps: 2 })
        await page.mouse.up()
        await page.mouse.wheel(0, y * 5)
      }
      await page.mouse.move(0, 0)
      await page
        .locator(".scroll-area-scrollbar:not([data-visible])")
        .waitFor({ state: "attached" })
    }
  }

  test("dragging and scrolling a scroll area 200 times, then mounting and unmounting it 200 times, leaves nothing behind", async ({
    page,
    open,
  }) => {
    // Each round waits for the scrollbar to hide: about a minute locally.
    test.setTimeout(180_000)
    const budget = budgets["leaks.cycles"]
    await open("leaks", { component: "scroll-area" })
    const cdp = await page.context().newCDPSession(page)
    // Warm up, as for the popups.
    await dragAndScroll(page, 5)
    await toggle(page, 40)
    await dragAndScroll(page, 1)
    await waitOutDevtools(page)
    const before = await snapshot(page, cdp)
    await dragAndScroll(page, 50)
    const scrolled = await snapshot(page, cdp)
    report("leaks.cycles scroll-area drag", before, scrolled)
    expectNothingLeft(
      before,
      scrolled,
      budget,
      "See tests/perf/README.md#leaks-cycles."
    )
    await toggle(page, 400)
    await dragAndScroll(page, 1)
    const after = await snapshot(page, cdp)
    report("leaks.cycles scroll-area mount", before, after)
    expectNothingLeft(
      before,
      after,
      budget,
      "See tests/perf/README.md#leaks-cycles."
    )
  })

  test("unmounting a scroll area in the middle of a thumb drag 50 times leaves nothing behind", async ({
    page,
    open,
  }) => {
    test.setTimeout(120_000)
    const budget = budgets["leaks.unmount-open"]
    await open("leaks", { component: "scroll-area" })
    const cdp = await page.context().newCDPSession(page)
    const unmountDragging = async (times: number, check = false) => {
      for (let time = 0; time < times; time++) {
        await showScrollbar(page)
        await toggleWhileHeld(
          page,
          cdp,
          async () => {
            const [left, top] = await grabScrollThumb(page)
            await page.mouse.move(left, top + 20, { steps: 2 })
          },
          check
        )
        await page.mouse.move(0, 0)
        await page.locator(".scroll-area-thumb").waitFor({ state: "attached" })
      }
    }
    await unmountDragging(10)
    await waitOutDevtools(page)
    const before = await snapshot(page, cdp)
    await unmountDragging(50, true)
    const after = await snapshot(page, cdp)
    report("leaks.unmount-open scroll-area", before, after)
    expectNothingLeft(
      before,
      after,
      budget,
      "See tests/perf/README.md#leaks-unmount-open."
    )
  })
})
