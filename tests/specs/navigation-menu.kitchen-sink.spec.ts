import type { Locator, Page } from "@playwright/test"
import {
  variants,
  type Variant,
} from "../../apps/playground/src/fixtures/navigation-menu-kitchen-sink/variants"
import { expect, test } from "../fixtures"

// Opens every kitchen sink variant. The page is for manual testing, so this
// only proves every variant renders, opens next to its trigger or anchor,
// and closes without errors.

const openPanels = (page: Page) =>
  page.locator(
    '[data-slot="navigation-menu-viewport"][data-open], [data-slot="navigation-menu-content"][data-open]'
  )

// Moves the pointer somewhere empty, in the header.
const moveAway = (page: Page) => page.mouse.move(5, 5)

// A panel animating out may cover the next trigger, and swallows presses.
async function expectClosed(page: Page, label: string) {
  await expect(openPanels(page), `${label} closes`).toHaveCount(0)
  await expect(
    page.locator('[data-slot^="navigation-menu"][data-ending-style]')
  ).toHaveCount(0)
}

// Centers an element, clear of the navigations pinned to the window's corners.
const center = (locator: Locator) =>
  locator.evaluate((el) => el.scrollIntoView({ block: "center" }))

// The panel a trigger opened: the viewport its content renders into, or the
// content itself. Also the boxes of the panel and what it positions against.
async function placement(trigger: Locator, anchorSelector?: string) {
  return trigger.evaluate((el, anchorSelector) => {
    const content = document.getElementById(
      el.getAttribute("aria-controls") ?? ""
    )
    // Contents in a viewport are its children. A nested menu's content is a popup inside its parent's viewport.
    const parent = content?.parentElement
    const panel = parent?.matches('[data-slot="navigation-menu-viewport"]')
      ? parent
      : content
    if (!panel) {
      return null
    }
    const anchor = anchorSelector ? document.querySelector(anchorSelector)! : el
    const box = (rect: DOMRect) => ({
      left: rect.left,
      right: rect.right,
      top: rect.top,
      bottom: rect.bottom,
    })
    return {
      id: panel.id,
      side: panel.dataset.side,
      panel: box(panel.getBoundingClientRect()),
      anchor: box(anchor.getBoundingClientRect()),
      window: { width: innerWidth, height: innerHeight },
    }
  }, anchorSelector)
}

type Placement = NonNullable<Awaited<ReturnType<typeof placement>>>

// Variants whose panel has no room on the side it asks for, so it flips.
const flips = new Set([
  "place-left-start",
  "place-left-center",
  "place-left-end",
  "corner-tl",
  "corner-tr",
  "corner-bl",
  "padding-48",
  "popup-corner-tr",
  "popup-corner-bl",
  "vertical-start",
])

const opposite = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
} as const

// What a variant asks for, on screen.
function requested(variant: Variant) {
  const props =
    variant.viewport === false ? variant.content : variant.viewport || undefined
  const rtl = variant.place === "rtl"
  const vertical = variant.options?.orientation === "vertical"
  const side = props?.side ?? (vertical ? "end" : "bottom")
  const physical =
    side === "start"
      ? rtl
        ? "right"
        : "left"
      : side === "end"
        ? rtl
          ? "left"
          : "right"
        : side
  return {
    side: physical,
    align: props?.align ?? "start",
    sideOffset: props?.sideOffset ?? 4,
    alignOffset: props?.alignOffset ?? 0,
    padding: props?.collisionPadding ?? 8,
    rtl,
  }
}

// Why a panel isn't where its variant asks, or "positioned".
function misplacement(variant: Variant, box: Placement | null) {
  if (!box) {
    return "no panel"
  }
  const want = requested(variant)
  const side = box.side as keyof typeof opposite | undefined
  if (!side) {
    return "no data-side"
  }
  const { panel: p, anchor: a } = box
  if (
    side !== want.side &&
    !(flips.has(variant.id) && side === opposite[want.side])
  ) {
    // How much room the side it asked for had, to tell a real lack of room from a wrong measurement.
    const room = {
      bottom: box.window.height - a.bottom,
      top: a.top,
      right: box.window.width - a.right,
      left: a.left,
    }[want.side]
    const size =
      want.side === "top" || want.side === "bottom"
        ? p.bottom - p.top
        : p.right - p.left
    return `side ${side} instead of ${want.side}, ${Math.round(size)}px panel, ${Math.round(room)}px of room`
  }
  const gap = {
    bottom: p.top - a.bottom,
    top: a.top - p.bottom,
    right: p.left - a.right,
    left: a.left - p.right,
  }[side]
  if (Math.abs(gap - want.sideOffset) > 1.5) {
    return `${Math.round(gap)}px from its anchor instead of ${want.sideOffset}px`
  }

  // Along the side: start, center or end, unless a collision shifted it to the window's edge.
  const across = side === "top" || side === "bottom"
  const [pStart, pEnd, aStart, aEnd, edge] = across
    ? [p.left, p.right, a.left, a.right, box.window.width]
    : [p.top, p.bottom, a.top, a.bottom, box.window.height]
  if (pStart <= want.padding + 1 || pEnd >= edge - want.padding - 1) {
    return "positioned"
  }
  const reversed = across && want.rtl
  const offset = reversed ? -want.alignOffset : want.alignOffset
  const misalignment = {
    start: reversed ? pEnd - (aEnd + offset) : pStart - (aStart + offset),
    end: reversed ? pStart - (aStart + offset) : pEnd - (aEnd + offset),
    center: (pStart + pEnd) / 2 - (aStart + aEnd) / 2 - offset,
  }[want.align]
  if (Math.abs(misalignment) > 1.5) {
    return `aligned ${Math.round(misalignment)}px off ${want.align}`
  }
  return "positioned"
}

// Opens a variant's panel with its first enabled trigger, and checks it sits next to its anchor.
async function openAndCheck(
  page: Page,
  variant: Variant,
  trigger: Locator,
  label: string
) {
  await center(trigger)
  if (variant.options?.openOnHover === false) {
    await trigger.hover()
    await page.waitForTimeout(200)
    await expect(trigger, `${label} ignores hover`).toHaveAttribute(
      "aria-expanded",
      "false"
    )
    await trigger.click()
  } else {
    await trigger.hover()
  }
  await expect(trigger, `${label} opens`).toHaveAttribute(
    "aria-expanded",
    "true"
  )

  const anchor = variant.anchorNav ? `#nav-${variant.id}` : undefined
  // Animations move the panel for a while, so the check waits for it to settle.
  await expect
    .poll(
      async () => misplacement(variant, await placement(trigger, anchor)),
      `${label} positions`
    )
    .toBe("positioned")
  const box = (await placement(trigger, anchor))!
  const panel = page.locator(`[id="${box.id}"]`)
  await expect(panel, label).toBeVisible()
  await expect(
    panel.getByRole("link").first(),
    `${label} shows its links`
  ).toBeVisible()
  return panel
}

// Escape closes the menu. The pointer may then be over a navigation pinned to
// a corner, which opens, so it moves away before checking every panel closed.
async function close(page: Page, trigger: Locator, label: string) {
  await page.keyboard.press("Escape")
  await expect(trigger, `${label} closes`).toHaveAttribute(
    "aria-expanded",
    "false"
  )
  await moveAway(page)
  await expectClosed(page, label)
}

// Opens one variant, checks what it adds, and closes it.
async function checkVariant(page: Page, variant: Variant, index: number) {
  const label = `variant ${index} (${variant.id})`
  const card = page.locator(`[data-variant="${variant.id}"]`)
  const triggers = card.locator('[data-slot="navigation-menu-trigger"]')
  let trigger = triggers.first()

  if (variant.disabled === "products") {
    await center(trigger)
    await expect(trigger, `${label} is disabled`).toBeDisabled()
    await trigger.hover({ force: true })
    await page.waitForTimeout(200)
    await expect(
      card.locator('[aria-expanded="true"]'),
      `${label} stays closed`
    ).toHaveCount(0)
    trigger = triggers.nth(1)
  }

  const panel = await openAndCheck(page, variant, trigger, label)

  if (variant.body === "nested") {
    const learn = panel.getByRole("button", { name: "Learn" })
    await learn.click()
    await expect(learn, `${label} opens the nested menu`).toHaveAttribute(
      "aria-expanded",
      "true"
    )
    // A nested vertical menu opens at the inline end of its trigger.
    const nestedVariant = {
      ...variant,
      viewport: false,
      options: { orientation: "vertical" },
    } as const
    await expect
      .poll(
        async () => misplacement(nestedVariant, await placement(learn)),
        `${label} positions the nested menu`
      )
      .toBe("positioned")
    await expect(page.getByRole("link", { name: "Tutorials" })).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(learn, `${label} closes the nested menu`).toHaveAttribute(
      "aria-expanded",
      "false"
    )
    await expect(trigger, `${label} stays open`).toHaveAttribute(
      "aria-expanded",
      "true"
    )
  }

  if (variant.body === "dynamic") {
    const before = (await panel.boundingBox())!
    await panel.getByRole("button", { name: "Show more" }).click()
    await expect(panel.getByRole("link", { name: "Changelog" })).toBeVisible()
    await expect
      .poll(async () => (await panel.boundingBox())!.width, `${label} grows`)
      .toBeGreaterThan(before.width + 50)
    await expect
      .poll(
        async () => (await panel.boundingBox())!.height,
        `${label} grows taller`
      )
      .toBeGreaterThan(before.height + 50)
    // A taller panel may flip above its trigger, leaving the pointer over
    // another navigation, which opens. Back on the panel, that one closes.
    await panel.getByRole("button", { name: "Show less" }).hover()
    await expect(
      page.locator('[aria-expanded="true"]'),
      `${label} is the only one open`
    ).toHaveCount(1)
  }

  if (variant.linkCloseOnSelect) {
    // The first link does the opposite of the menu.
    const staysOpen = variant.options?.closeOnSelect === false ? 1 : 0
    await panel.getByRole("link").nth(staysOpen).click()
    await expect(trigger, `${label} stays open after a link`).toHaveAttribute(
      "aria-expanded",
      "true"
    )
    await panel
      .getByRole("link")
      .nth(1 - staysOpen)
      .click()
    await expect(trigger, `${label} closes`).toHaveAttribute(
      "aria-expanded",
      "false"
    )
    // The pointer was over the panel, and may now be over another navigation that opened.
    await moveAway(page)
    await expectClosed(page, label)
  } else {
    await close(page, trigger, label)
  }

  if (variant.content?.keepMounted || variant.content?.hiddenUntilFound) {
    const kept = card.locator('[data-slot="navigation-menu-content"]')
    await expect(kept, `${label} keeps its contents`).toHaveCount(3)
    // Content hidden until found keeps its box, so only its attribute says it's hidden.
    if (variant.content.hiddenUntilFound) {
      await expect(kept.first()).toHaveAttribute("hidden", "until-found")
    } else {
      await expect(kept.first()).toBeHidden()
    }
  }
}

const kitchenSink = (framework: string) =>
  `/?fixture=navigation-menu-kitchen-sink&framework=${framework}`

async function load(page: Page, framework: string) {
  test.skip(
    !["react", "vue", "web"].includes(framework),
    "Composition frameworks only."
  )
  await page.goto(kitchenSink(framework))
  await page.locator("body[data-mounted]").waitFor({ state: "attached" })
  // Each card mounts its own root, so wait for all of them.
  const navs = page.locator('[data-slot="navigation-menu"]:not([data-nested])')
  await expect
    .poll(() => navs.count(), { timeout: 20_000 })
    .toBe(variants.length)
}

const variantById = (id: string) => variants.find((each) => each.id === id)!
const firstTrigger = (page: Page, id: string) =>
  page
    .locator(`[data-variant="${id}"] [data-slot="navigation-menu-trigger"]`)
    .first()

test("every kitchen sink variant opens", async ({ page, framework }) => {
  test.setTimeout(240_000)
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  page.on(
    "console",
    (message) => message.type() === "error" && errors.push(message.text())
  )
  await load(page, framework)

  // The defaultValue variant is open from the start.
  await expect(openPanels(page)).toHaveCount(2)
  const opened = firstTrigger(page, "default-value")
  await expect(opened).toHaveAttribute("aria-expanded", "true")
  await center(opened)
  await expect
    .poll(
      async () =>
        misplacement(variantById("default-value"), await placement(opened)),
      "defaultValue positions"
    )
    .toBe("positioned")
  const panel = page.locator(`[id="${(await placement(opened))!.id}"]`)
  await expect(
    panel.getByRole("link").first(),
    "defaultValue shows its links"
  ).toBeVisible()
  await page.keyboard.press("Escape")
  await expectClosed(page, "defaultValue")

  // Every variant runs, and failures are listed together at the end.
  const failures: string[] = []
  for (const [index, variant] of variants.entries()) {
    try {
      await checkVariant(page, variant, index)
    } catch (error) {
      const lines = (error as Error).message.split("\n")
      const received = lines.find((line) => line.trim().startsWith("Received"))
      failures.push(`${lines[0]}${received ? ` (${received.trim()})` : ""}`)
      // Closes whatever stayed open, so the next variant starts clean.
      for (let attempt = 0; attempt < 3; attempt++) {
        await page.keyboard.press("Escape")
      }
      await moveAway(page)
      await page.waitForTimeout(800)
    }
  }

  // A select outside the controlled menu opens an item.
  const select = page.getByRole("combobox", { name: "Open item" })
  await center(select)
  await select.selectOption("company")
  const company = page
    .locator('[data-variant="controlled"]')
    .getByRole("button", { name: "Company" })
  await expect(company).toHaveAttribute("aria-expanded", "true")
  await expect(openPanels(page).first()).toBeVisible()
  await select.selectOption("")
  await expectClosed(page, "controlled select")

  // The controller opens and closes items from outside the menu.
  const controls = page.locator("article", {
    has: page.locator('[data-variant="controller"]'),
  })
  await center(controls)
  await controls.getByRole("button", { name: "Open Company" }).click()
  const controlled = page
    .locator('[data-variant="controller"]')
    .getByRole("button", { name: "Company" })
  await expect(controlled).toHaveAttribute("aria-expanded", "true")
  expect(
    misplacement(variantById("controller"), await placement(controlled)),
    "controller opens next to Company"
  ).toBe("positioned")
  await controls.getByRole("button", { name: "Close", exact: true }).click()
  await expectClosed(page, "controller close")

  // The indicator covers the current page's link while closed, and the open trigger.
  for (const id of ["indicator", "indicator-vertical", "indicator-rtl"]) {
    const card = page.locator(`[data-variant="${id}"]`)
    const indicator = card.locator('[data-slot="navigation-menu-indicator"]')
    await center(card)
    const covers = async (target: Locator) => {
      const [box, item] = [
        await indicator.boundingBox(),
        await target.boundingBox(),
      ]
      if (!box || !item) {
        return false
      }
      const vertical = id === "indicator-vertical"
      return vertical
        ? Math.abs(box.y - item.y) < 2 && Math.abs(box.height - item.height) < 2
        : Math.abs(box.x - item.x) < 2 && Math.abs(box.width - item.width) < 2
    }
    await expect(indicator, `${id} shows`).toHaveAttribute("data-visible", "")
    await expect
      .poll(
        () => covers(card.getByRole("link", { name: "Pricing" })),
        `${id} covers Pricing`
      )
      .toBe(true)
    const trigger = card.getByRole("button", { name: "Resources" })
    await trigger.hover()
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
    await expect
      .poll(() => covers(trigger), `${id} covers Resources`)
      .toBe(true)
    await close(page, trigger, id)
  }
  await expect(
    page.locator(
      '[data-variant="indicator-none"] [data-slot="navigation-menu-indicator"]'
    )
  ).not.toHaveAttribute("data-visible", "")

  expect(failures).toEqual([])
  expect(errors).toEqual([])
})

// Records where a trigger's panel is in each of the first frames it shows in after `open` runs.
async function framesAfter(
  page: Page,
  trigger: Locator,
  open: () => Promise<void>
) {
  await trigger.evaluate((el) => {
    const frames: unknown[] = []
    Object.assign(window, { frames_: frames })
    const record = () => {
      const content = document.getElementById(
        el.getAttribute("aria-controls") ?? ""
      )
      const parent = content?.parentElement
      const panel = parent?.matches('[data-slot="navigation-menu-viewport"]')
        ? parent
        : content
      const box = (rect: DOMRect) => ({
        left: rect.left,
        right: rect.right,
        top: rect.top,
        bottom: rect.bottom,
      })
      // The layout box, without the scale an opening animation adds.
      const layout = (panel: HTMLElement) =>
        new DOMRect(
          panel.offsetLeft,
          panel.offsetTop,
          panel.offsetWidth,
          panel.offsetHeight
        )
      if (panel && !panel.hidden) {
        frames.push({
          id: panel.id,
          side: panel.dataset.side,
          panel: box(layout(panel)),
          anchor: box(el.getBoundingClientRect()),
          window: { width: innerWidth, height: innerHeight },
        })
      }
      if (frames.length < 10) {
        requestAnimationFrame(record)
      }
    }
    requestAnimationFrame(record)
  })
  await open()
  await expect
    .poll(() =>
      page.evaluate(
        () => (window as unknown as { frames_: unknown[] }).frames_.length
      )
    )
    .toBe(10)
  return page.evaluate(
    () => (window as unknown as { frames_: Placement[] }).frames_
  )
}

// The viewport shows once its content renders, measured and placed for its
// real size. Placed for no size, side top or left, or align center or end,
// would put it in the wrong place for a frame, where it may cover the trigger.
test("the viewport opens in its final place in its first frame", async ({
  page,
  framework,
}) => {
  await load(page, framework)
  for (const id of [
    "place-top-center",
    "place-left-start",
    "place-bottom-end",
  ]) {
    const trigger = firstTrigger(page, id)
    await center(trigger)
    const frames = await framesAfter(page, trigger, () => trigger.hover())
    const width = (frame: Placement) =>
      Math.round(frame.panel.right - frame.panel.left)
    for (const [index, frame] of frames.entries()) {
      expect(
        misplacement(variantById(id), frame),
        `${id}, frame ${index}`
      ).toBe("positioned")
      expect(width(frame), `${id}, frame ${index}`).toBe(width(frames.at(-1)!))
    }
    await close(page, trigger, id)
  }
})

// A viewport that transitions left and top, to glide between triggers, opens
// in place: a first placement never animates from the window's corner.
test("a viewport that transitions left and top opens in place", async ({
  page,
  framework,
}) => {
  await load(page, framework)
  const trigger = firstTrigger(page, "anim-move")
  await center(trigger)
  const frames = await framesAfter(page, trigger, () => trigger.hover())
  for (const frame of frames) {
    expect(misplacement(variantById("anim-move"), frame)).toBe("positioned")
  }
})

// <ui-navigation-menu-viewport> takes side, align, side-offset, align-offset,
// collision-padding and anchor. Web parts without a value are keyed by an
// automatic id, so the core finds the viewport's props by element.
test("web: the viewport honors its placement attributes", async ({
  page,
  framework,
}) => {
  test.skip(framework !== "web", "Web components only.")
  await load(page, framework)
  for (const id of [
    "place-top-center",
    "offset-16",
    "align-16",
    "anchor-nav-top",
  ]) {
    const trigger = firstTrigger(page, id)
    await center(trigger)
    await trigger.hover()
    const anchor = variantById(id).anchorNav ? `#nav-${id}` : undefined
    await expect
      .poll(
        async () =>
          misplacement(variantById(id), await placement(trigger, anchor)),
        id
      )
      .toBe("positioned")
    await close(page, trigger, id)
  }
})

// Web parts bind in document order, so a content open from the start binds
// before the viewport after it. It waits a microtask before becoming a popup
// of its own, and moves into the viewport instead.
test("web: an item open from the start renders into the viewport", async ({
  page,
  framework,
}) => {
  test.skip(framework !== "web", "Web components only.")
  await load(page, framework)
  const trigger = firstTrigger(page, "default-value")
  await center(trigger)
  const box = await placement(trigger)
  expect(box?.id).toMatch(/viewport/)
  await expect(
    page.locator(`[id="${box!.id}"]`).getByRole("link", { name: "Analytics" })
  ).toBeVisible()
})

// `hidden="until-found"` hides content with content-visibility, which keeps the
// element's own box. Closed contents stay in their items, collapsed so their
// width and padding push nothing away, and web contents are blocks, where
// content-visibility applies.
test("closed contents hidden until found take no room", async ({
  page,
  framework,
}) => {
  await load(page, framework)
  for (const id of ["until-found", "until-found-popup"]) {
    const card = page.locator(`[data-variant="${id}"]`)
    await center(card)
    const products = (await card
      .getByRole("button", { name: "Products" })
      .boundingBox())!
    const resources = (await card
      .getByRole("button", { name: "Resources" })
      .boundingBox())!
    expect(resources.x - (products.x + products.width), id).toBeLessThan(8)
    // WebKit still reports boxes for what content-visibility skips, so this
    // asks the element. Found by selector, since a hidden link has no role.
    const link = card.locator('[data-slot="navigation-menu-content"] a').first()
    expect(await link.evaluate((el) => el.checkVisibility()), id).toBe(false)
  }
})

// An item open from the start, below the fold, lands next to its trigger once
// scrolled into view, even mid-transition: positioning undoes the popup's own
// scale and translate when it finds its containing block's origin.
test("an item open from the start lands next to its trigger once scrolled into view", async ({
  page,
  framework,
}) => {
  await load(page, framework)
  const trigger = firstTrigger(page, "default-value")
  await center(trigger)
  await expect
    .poll(async () =>
      misplacement(variantById("default-value"), await placement(trigger))
    )
    .toBe("positioned")
})
