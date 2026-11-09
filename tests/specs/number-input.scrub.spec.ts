import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"
import { numberInputScrubFixture as f } from "../fixtures/number-input-scrub"
import { standInPointerLock } from "./number-input.helpers"

// Scrub areas anywhere: nested inside the number input, beside each other,
// outside it through a controller or `for`, and rendered as other elements.
// Drags lock the pointer through a stand-in, since automation can't move a
// locked one.

const width = (page: Page) =>
  page.getByRole("textbox", { name: f.label, exact: true })
const scrubArea = (page: Page, text: string) =>
  page.getByText(text, { exact: true })

// Drags horizontally across a scrub area, from its center, in small moves.
async function drag(
  page: Page,
  text: string,
  distance: number,
  modifier?: "Shift" | "Alt"
) {
  const box = (await scrubArea(page, text).boundingBox())!
  const start = { x: box.x + box.width / 2, y: box.y + box.height / 2 }
  await page.mouse.move(start.x, start.y)
  if (modifier) {
    await page.keyboard.down(modifier)
  }
  await page.mouse.down()
  await page.mouse.move(start.x + distance, start.y, {
    steps: Math.abs(distance),
  })
  await page.mouse.up()
  if (modifier) {
    await page.keyboard.up(modifier)
  }
}

test.describe("scrub areas", () => {
  test.beforeEach(async ({ page, open }) => {
    await open("number-input-scrub")
    await standInPointerLock(page)
  })

  test("a scrub area nested deep inside the number input drives it", async ({
    page,
  }) => {
    await drag(page, f.nestedScrub, 20)
    await expect(width(page)).toHaveValue("110")
  })

  test("a scrub area outside the number input drives it through its controller", async ({
    page,
  }) => {
    await drag(page, f.toolbarScrub, 20)
    await expect(width(page)).toHaveValue("110")
    await expect(page.getByRole("status", { name: "Committed" })).toHaveText(
      "110"
    )
  })

  test("a scrub area rendered as a table header cell drives the number input", async ({
    page,
    framework,
  }) => {
    test.skip(
      framework.startsWith("web"),
      "Web components have no render functions."
    )
    const header = scrubArea(page, f.headerScrub)
    expect(await header.evaluate((el) => el.tagName)).toBe("TH")
    await expect(header).toHaveAttribute("data-slot", "number-input-scrub-area")
    await drag(page, f.headerScrub, -20)
    await expect(width(page)).toHaveValue("90")
  })

  test("two scrub areas drive one number input", async ({ page }) => {
    await drag(page, f.letterScrub, 20)
    await expect(width(page)).toHaveValue("110")
    await drag(page, f.nestedScrub, -10)
    await expect(width(page)).toHaveValue("105")
    await expect(page.getByRole("status", { name: "Committed" })).toHaveText(
      "110 105"
    )
  })

  test("Shift with a scrub steps by the large step", async ({ page }) => {
    await drag(page, f.letterScrub, 4, "Shift")
    await expect(width(page)).toHaveValue("120")
  })

  test("Alt with a scrub steps by the small step", async ({ page }) => {
    await drag(page, f.letterScrub, 10, "Alt")
    await expect(width(page)).toHaveValue("100.5")
  })

  test("a click without moving focuses the input with its text selected", async ({
    page,
  }) => {
    await scrubArea(page, f.letterScrub).click()
    await expect(width(page)).toBeFocused()
    expect(
      await width(page).evaluate((input: HTMLInputElement) => [
        input.selectionStart,
        input.selectionEnd,
      ])
    ).toEqual([0, 3])
    await expect(page.getByRole("status", { name: "Committed" })).toHaveText("")
  })

  test("a drag inside a link doesn't follow it", async ({ page }) => {
    await scrubArea(page, f.letterScrub).evaluate((el) => {
      const link = Object.assign(document.createElement("a"), {
        href: "#followed",
        draggable: false,
      })
      el.replaceWith(link)
      link.append(el)
    })
    await drag(page, f.letterScrub, 20)
    await expect(width(page)).toHaveValue("110")
    expect(await page.evaluate(() => location.hash)).toBe("")
  })

  test("a drag selects no text and leaves focus where it was", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Before" }).focus()
    await drag(page, f.nestedScrub, 20)
    await expect(width(page)).toHaveValue("110")
    await expect(page.getByRole("button", { name: "Before" })).toBeFocused()
    expect(await page.evaluate(() => getSelection()?.toString() ?? "")).toBe("")
  })
})

test("Alt with an arrow key steps by the small step", async ({
  page,
  open,
}) => {
  await open("number-input-scrub")
  await width(page).focus()
  await page.keyboard.press("Alt+ArrowUp")
  await expect(width(page)).toHaveValue("100.1")
  await page.keyboard.press("Alt+ArrowDown")
  await expect(width(page)).toHaveValue("100")
})

test("a scrub steps by distance where the browser refuses pointer lock", async ({
  page,
  open,
}) => {
  await open("number-input-scrub")
  await standInPointerLock(page, { refuse: true })
  await drag(page, f.nestedScrub, 20)
  await expect(width(page)).toHaveValue("110")
})
