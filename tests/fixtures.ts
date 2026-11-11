import { test as base, expect, type Locator, type Page } from "@playwright/test"
import { hasFixture } from "./fixture-files"

const test = base.extend<{
  framework: string
  // URL options every test in a project gets, like a portal container.
  fixtureOptions: Record<string, string>
  // Whether apps/playground serves the fixtures, so their files say which exist.
  playground: boolean
  open: (fixture: string, options?: Record<string, string>) => Promise<void>
  // Presses Tab. Safari only tabs to buttons with Option held, like its default setting.
  tab: (options?: { shift?: boolean }) => Promise<void>
  // Fails a Solid spec when Solid's dev checker reported anything on its page.
  solidDiagnostics: void
  // Fails a Svelte spec when its page wrote state while options were handed over.
  svelteRelays: void
}>({
  framework: ["react", { option: true }],
  fixtureOptions: [{}, { option: true }],
  playground: [false, { option: true }],
  open: async ({ page, framework, fixtureOptions, playground }, use) => {
    await use(async (fixture, options = {}) => {
      // Known without loading the page when the playground serves the fixtures.
      if (playground) {
        test.skip(
          !hasFixture(fixture, framework),
          `No ${fixture} fixture for ${framework}.`
        )
      }
      const search = new URLSearchParams({
        fixture,
        framework,
        ...fixtureOptions,
        ...options,
      })
      await page.goto(`/?${search}`)
      const missing = await page.evaluate(
        () => "missingFixture" in document.body.dataset
      )
      test.skip(missing, `No ${fixture} fixture for ${framework}.`)
      await page.getByRole("button", { name: "Before" }).waitFor()
      await page.locator("body[data-mounted]").waitFor({ state: "attached" })
    })
  },
  solidDiagnostics: [
    async ({ page, framework }, use, info) => {
      await use()
      if (!framework.startsWith("solid") || page.isClosed()) {
        return
      }
      const allowed = info.annotations
        .filter(({ type }) => type === "solid-diagnostic")
        .map(({ description }) => description!.split(":")[0])
      const reported = await page
        .evaluate(
          () =>
            (window as { solidDiagnostics?: { code: string }[] })
              .solidDiagnostics ?? []
        )
        .catch(() => [])
      expect(
        reported.filter(({ code }) => !allowed.includes(code)),
        "Solid's dev diagnostics"
      ).toEqual([])
    },
    { auto: true },
  ],
  svelteRelays: [
    async ({ page, framework }, use) => {
      await use()
      if (!framework.startsWith("svelte") || page.isClosed()) {
        return
      }
      const relays = await page
        .evaluate(
          () =>
            (
              window as unknown as Record<
                symbol,
                { relays?: unknown[] } | undefined
              >
            )[Symbol.for("ui-sdk.devtools.history@1")]?.relays ?? []
        )
        .catch(() => [])
      expect(relays, "state written while options were handed over").toEqual([])
    },
    { auto: true },
  ],
  tab: async ({ page, browserName }, use) => {
    await use(async (options) => {
      await page.keyboard.press(tabKey(browserName, options))
    })
  },
})

/**
 * Lets a Solid spec cause one of Solid's dev diagnostics on purpose, like
 * every part rendering again at once, and says why.
 */
function allowSolidDiagnostic(code: string, why: string) {
  test.info().annotations.push({
    type: "solid-diagnostic",
    description: `${code}: ${why}`,
  })
}

/** Whether the project presents popups as sheets, like `react-sheet`. Specs that measure placement against a trigger skip there. */
const isSheet = (fixtureOptions: Record<string, string>) =>
  fixtureOptions.presentation === "sheet"

/**
 * Waits until nothing on the popup animates, like a sheet rising, for presses
 * and measurements that can't wait for a still target. Effects tied to a
 * scroll timeline follow the scroller and never finish, so they don't count.
 */
async function waitForStill(popup: Locator) {
  await expect
    .poll(() =>
      popup.evaluate((el) =>
        // The sheet is the content, around a list part.
        (el.closest('[data-slot$="-content"]') ?? el)
          .getAnimations()
          .every(
            (animation) =>
              animation.playState !== "running" ||
              animation.timeline !== document.timeline
          )
      )
    )
    .toBe(true)
}

// Menus are found by name, which their trigger provides. Submenus may be DOM
// children of their parent menu, so containment cannot identify them.
function menuNamed(page: Page, name: string) {
  return page.getByRole("menu", { name, exact: true })
}

// The ids `aria-labelledby` names that no element in the page has, as
// "role → id", so a spec can check that nothing points at a missing label.
async function missingLabelledBy(page: Page) {
  return page.evaluate(() =>
    [...document.querySelectorAll("[aria-labelledby]")].flatMap((el) =>
      el
        .getAttribute("aria-labelledby")!
        .split(/\s+/)
        .filter((id) => id && !document.getElementById(id))
        .map((id) => `${el.getAttribute("role") ?? el.localName} → ${id}`)
    )
  )
}

// Swaps a list's items for the fixture's change of that name, without a press,
// which would close the list. See fixtures/items.ts.
async function changeItems(page: Page, change: string) {
  await page.evaluate(
    (detail) =>
      document.dispatchEvent(new CustomEvent("fixture-items", { detail })),
    change
  )
}

// The page's own clock, which its timers run on. A delay timed on the test's
// clock can come out short, since the two drift apart.
const pageNow = (page: Page) => page.evaluate(() => Date.now())

async function lastAction(page: Page) {
  return page.getByRole("status", { name: "Last action" }).textContent()
}

// A shortcut's names on this platform: `aria` for aria-keyshortcuts, and `text`
// for a Shortcut part, ⌘ on Apple platforms and Ctrl elsewhere.
async function shortcutKeys(page: Page, key: string) {
  const apple = await page.evaluate(() =>
    /Mac|iPhone|iPad|iPod/.test(navigator.platform)
  )
  return {
    aria: `${apple ? "Meta" : "Control"}+${key}`,
    text: `\u2066${apple ? "⌘" : "Ctrl+"}${key}\u2069`,
  }
}

// Makes the page report another platform from its first script, so a spec can
// check the Ctrl names on a Mac or the ⌘ names elsewhere.
async function emulatePlatform(
  page: Page,
  platform: "Linux x86_64" | "MacIntel"
) {
  await page.addInitScript((platform) => {
    Object.defineProperty(Navigator.prototype, "platform", {
      get: () => platform,
    })
  }, platform)
}

// True when focus is on or inside an element with the given role.
async function focusIsWithin(page: Page, role: string) {
  return page.evaluate(
    (role) => !!document.activeElement?.closest(`[role="${role}"]`),
    role
  )
}

// Tabs are found by name. Panels are named by their tabs.
function tabNamed(page: Page, name: string) {
  return page.getByRole("tab", { name, exact: true })
}

function panelNamed(page: Page, name: string) {
  return page.getByRole("tabpanel", { name, exact: true })
}

// The indicator is presentational, so it has no role to find it by.
async function coversTab(page: Page, name: string) {
  const indicator = await page.locator(".indicator").boundingBox()
  const tab = await tabNamed(page, name).boundingBox()
  if (!indicator || !tab) {
    return false
  }
  return (["x", "y", "width", "height"] as const).every(
    (key) => Math.abs(indicator[key] - tab[key]) <= 1
  )
}

// Accordion triggers are buttons named by their text, and panels are regions
// named by their triggers.
function triggerNamed(page: Page, name: string) {
  return page.getByRole("button", { name, exact: true })
}

function regionNamed(page: Page, name: string) {
  return page.getByRole("region", { name, exact: true })
}

// A panel found by its trigger, whether or not it is shown.
async function panelOf(page: Page, name: string) {
  const id = await triggerNamed(page, name).getAttribute("id")
  return page.locator(`[aria-labelledby="${id}"]`)
}

// Counts the `input` and `change` events that reach the document from now on,
// like a form's own listeners would hear them. Read it with `formEventCounts`.
async function countFormEvents(page: Page) {
  await page.evaluate(() => {
    const counts = { input: 0, change: 0 }
    Object.assign(window, { formEventCounts: counts })
    for (const type of ["input", "change"] as const) {
      document.addEventListener(type, () => counts[type]++)
    }
  })
}

async function formEventCounts(page: Page) {
  return page.evaluate(
    () =>
      (
        window as unknown as {
          formEventCounts: { input: number; change: number }
        }
      ).formEventCounts
  )
}

// Records, from now on, what a dialog is named and described by each time
// focus moves into it, which is what a screen reader announces then, as
// "name / description". Read it with `dialogNamesAtFocus`.
async function recordDialogNamesAtFocus(page: Page) {
  await page.evaluate(() => {
    const names: string[] = []
    Object.assign(window, { dialogNamesAtFocus: names })
    const textOf = (ids: string | null) =>
      ids
        ?.split(" ")
        .map((id) => document.getElementById(id)?.textContent)
        .join(" ")
    document.addEventListener("focusin", (event) => {
      const dialog = (event.target as Element).closest(
        '[role="dialog"], [role="alertdialog"]'
      )
      if (!dialog) {
        return
      }
      const name =
        textOf(dialog.getAttribute("aria-labelledby")) ??
        dialog.getAttribute("aria-label")
      names.push(`${name} / ${textOf(dialog.getAttribute("aria-describedby"))}`)
    })
  })
}

async function dialogNamesAtFocus(page: Page) {
  return page.evaluate(
    () =>
      (window as unknown as { dialogNamesAtFocus: string[] }).dialogNamesAtFocus
  )
}

// Toggles and buttons are buttons named by their text. Toggles say whether
// they're pressed with aria-pressed.
function buttonNamed(page: Page, name: string) {
  return page.getByRole("button", { name, exact: true })
}

function groupNamed(page: Page, name: string) {
  return page.getByRole("group", { name, exact: true })
}

// The focused element's name as the toolbar and menubar specs name items:
// its aria-label, else its text without hidden parts like shortcuts.
async function focusedName(page: Page) {
  return page.evaluate(() => {
    const el = document.activeElement
    if (!el) {
      return ""
    }
    const label = el.getAttribute("aria-label")
    if (label !== null) {
      return label
    }
    const copy = el.cloneNode(true) as Element
    copy
      .querySelectorAll('[aria-hidden="true"]')
      .forEach((hidden) => hidden.remove())
    return copy.textContent?.trim() ?? ""
  })
}

// Waits until the focused element has this name.
async function expectFocus(page: Page, name: string) {
  await expect.poll(() => focusedName(page)).toBe(name)
}

// Waits until nothing is animating in. Content closed within its first frames,
// while its starting style still hides it, has nothing to animate out of, so
// it leaves at once.
async function entered(page: Page) {
  await page.waitForFunction(
    () =>
      !document.querySelector("[data-starting-style]") &&
      document.getAnimations().length === 0
  )
}

// Stretches transitions to ten seconds, linear, so a spec reads an enter
// animation close to where it starts.
async function slowTransitions(page: Page) {
  await page.addStyleTag({
    content:
      "* { transition-duration: 10s !important; transition-timing-function: linear !important }",
  })
}

// Waits until an element's enter transition has finished. Closing during it would
// reverse it, which CSS shortens to how far it got. A sheet's held script
// animations never end, so only transitions count.
async function transitionedIn(locator: Locator) {
  await expect
    .poll(() =>
      locator.evaluate(
        (el) =>
          !el.hasAttribute("data-starting-style") &&
          !el
            .getAnimations()
            .some((animation) => "transitionProperty" in animation)
      )
    )
    .toBe(true)
}

async function opacityOf(locator: Locator) {
  return locator.evaluate((el) => Number(getComputedStyle(el).opacity))
}

// The key press that moves focus to the next control, for a spec that presses
// it outside the tab fixture. Safari only tabs to buttons with Option held,
// like its default setting, so WebKit gets Alt+Tab.
function tabKey(
  browserName: string,
  { shift = false }: { shift?: boolean } = {}
) {
  const modifiers = [
    browserName === "webkit" && "Alt",
    shift && "Shift",
  ].filter(Boolean)
  return [...modifiers, "Tab"].join("+")
}

// checkPattern from @ui-sdk/core/testing, loaded through the page so the keys
// it sends reach the same copy of core the fixture uses.
async function patternProblems(page: Page, pattern: string) {
  return page.evaluate(async (pattern) => {
    const { checkPattern } = await (
      window as unknown as {
        loadTesting: () => Promise<{
          checkPattern: (root: Element, pattern: string) => Promise<void>
        }>
      }
    ).loadTesting()
    try {
      await checkPattern(document.getElementById("root")!, pattern)
      return ""
    } catch (error) {
      return (error as Error).message
    }
  }, pattern)
}

export {
  allowSolidDiagnostic,
  buttonNamed,
  changeItems,
  countFormEvents,
  coversTab,
  dialogNamesAtFocus,
  emulatePlatform,
  entered,
  expect,
  expectFocus,
  focusedName,
  focusIsWithin,
  formEventCounts,
  groupNamed,
  isSheet,
  lastAction,
  menuNamed,
  missingLabelledBy,
  opacityOf,
  pageNow,
  panelNamed,
  panelOf,
  patternProblems,
  recordDialogNamesAtFocus,
  regionNamed,
  shortcutKeys,
  slowTransitions,
  tabKey,
  tabNamed,
  test,
  transitionedIn,
  triggerNamed,
  waitForStill,
}
