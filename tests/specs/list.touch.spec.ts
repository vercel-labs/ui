import type { Page } from "@playwright/test"
import { screenReaderTap } from "../fixtures/screen-reader"
import { expect, test } from "../fixtures"

// Touch screen readers. VoiceOver on iOS ignores aria-activedescendant, so a
// list opened by a screen reader's tap takes real focus, and focus goes back
// to the field when it closes. Result counts and removed chips are announced,
// since nothing else on screen says them.

const option = (page: Page, name: string) =>
  page.getByRole("option", { name, exact: true })
// What the page's shared announcer says. Live regions have no name, so it's found by its text.
const announced = (page: Page, text: string) =>
  page.getByRole("status").filter({ hasText: new RegExp(`^${text}$`) })

test.describe(
  "a screen reader's tap moves real focus into the list",
  { tag: "@enhancement" },
  () => {
    test.beforeEach(({ browserName, framework }) => {
      test.skip(
        browserName !== "chromium",
        "The tap is sent through the DevTools protocol."
      )
      test.skip(
        framework.endsWith("-ssr"),
        "Hydration races the tap; the client fixtures cover it."
      )
    })

    test.describe("combobox", () => {
      const input = (page: Page) =>
        page.getByRole("combobox", { name: "Country" })
      const trigger = (page: Page) =>
        page.getByRole("button", { name: "Show countries" })

      test("tapping the trigger focuses the selected item, with no aria-activedescendant", async ({
        page,
        open,
      }) => {
        await open("combobox", { value: "fr" })
        await screenReaderTap(page, trigger(page))
        await expect(option(page, "France")).toBeFocused()
        await expect(input(page)).not.toHaveAttribute("aria-activedescendant")
      })

      test("arrow keys move real focus, and choosing returns focus to the input", async ({
        page,
        open,
      }) => {
        await open("combobox")
        await screenReaderTap(page, trigger(page))
        await expect(option(page, "Argentina")).toBeFocused()
        await page.keyboard.press("ArrowDown")
        await expect(option(page, "Australia")).toBeFocused()
        await screenReaderTap(page, option(page, "Austria"))
        await expect(page.getByRole("listbox")).toBeHidden()
        await expect(input(page)).toBeFocused()
        await expect(input(page)).toHaveValue("Austria")
      })

      test("Escape closes the list and focus returns to the input", async ({
        page,
        open,
      }) => {
        await open("combobox")
        await screenReaderTap(page, trigger(page))
        await expect(option(page, "Argentina")).toBeFocused()
        await page.keyboard.press("Escape")
        await expect(page.getByRole("listbox")).toBeHidden()
        await expect(input(page)).toBeFocused()
      })
    })

    test("autocomplete: tapping the trigger focuses the first suggestion, and Escape returns", async ({
      page,
      open,
    }) => {
      await open("autocomplete")
      await screenReaderTap(
        page,
        page.getByRole("button", { name: "Show fruits" })
      )
      await expect(option(page, "Apple")).toBeFocused()
      await page.keyboard.press("Escape")
      await expect(page.getByRole("combobox", { name: "Fruit" })).toBeFocused()
    })

    test("searchable select: tapping the trigger focuses the selected item, not the search field", async ({
      page,
      open,
    }) => {
      await open("select", { search: "", value: "cherry" })
      await screenReaderTap(page, page.getByRole("combobox", { name: "Fruit" }))
      await expect(option(page, "Cherry")).toBeFocused()
      await expect(
        page.getByRole("combobox", { name: "Search fruits" })
      ).not.toHaveAttribute("aria-activedescendant")
    })
  }
)

test.describe("announcements", { tag: "@enhancement" }, () => {
  test("how many items match is announced once typing pauses", async ({
    page,
    open,
  }) => {
    await open("combobox", { nostatus: "" })
    await page
      .getByRole("combobox", { name: "Country" })
      .pressSequentially("au")
    await expect(announced(page, "2 results")).toBeAttached()
    await page
      .getByRole("combobox", { name: "Country" })
      .pressSequentially("zz")
    await expect(announced(page, "No results")).toBeAttached()
  })

  test("autocomplete and searchable select announce counts too", async ({
    page,
    open,
  }) => {
    await open("autocomplete", { nostatus: "" })
    await page
      .getByRole("combobox", { name: "Fruit" })
      .pressSequentially("berr")
    await expect(announced(page, "2 results")).toBeAttached()
    await open("select", { search: "" })
    await page.getByRole("combobox", { name: "Fruit" }).click()
    await page
      .getByRole("combobox", { name: "Search fruits" })
      .pressSequentially("err")
    await expect(announced(page, "2 results")).toBeAttached()
  })

  test("removing a chip announces which", async ({ page, open }) => {
    await open("combobox", { multiple: "", value: "fr,cl" })
    await page.getByRole("button", { name: "Remove Chile" }).click()
    await expect(announced(page, "Chile removed")).toBeAttached()
  })
})

test.describe("touch screen readers and announcements", () => {
  test("a tap on the input is for typing: focus stays there", async ({
    page,
    open,
    browserName,
    framework,
  }) => {
    test.skip(
      browserName !== "chromium",
      "The tap is sent through the DevTools protocol."
    )
    test.skip(
      framework.endsWith("-ssr"),
      "Hydration races the tap; the client fixtures cover it."
    )
    await open("combobox")
    const input = page.getByRole("combobox", { name: "Country" })
    await screenReaderTap(page, input)
    await expect(page.getByRole("listbox")).toBeVisible()
    await expect(input).toBeFocused()
  })

  test("a status part says it instead, so nothing is announced twice", async ({
    page,
    open,
  }) => {
    await page.clock.install()
    await open("combobox")
    await page
      .getByRole("combobox", { name: "Country" })
      .pressSequentially("au")
    await expect(option(page, "Austria")).toBeVisible()
    // Past the pause an announcement waits for.
    await page.clock.runFor(1000)
    await expect(announced(page, "2 results")).toHaveCount(0)
  })
})
