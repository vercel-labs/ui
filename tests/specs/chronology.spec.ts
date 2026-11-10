import { expect, expectFocus, test } from "../fixtures"
import { chronology, eventNamed, titles } from "./chronology.helpers"

// A list of dated events with one tab stop and arrow keys between them. With
// `feed`, the WAI-ARIA feed pattern: https://www.w3.org/WAI/ARIA/apg/patterns/feed/

test.describe("a list of events", () => {
  test.beforeEach(async ({ open }) => {
    await open("chronology")
  })

  test("the events are a named list of list items", async ({ page }) => {
    await expect(chronology(page)).toBeVisible()
    await expect(chronology(page).getByRole("listitem")).toHaveCount(
      titles.length
    )
  })

  test("each event is named by its title and described by its time and description", async ({
    page,
  }) => {
    const shipped = eventNamed(page, "Shipped")
    await expect(shipped).toHaveAccessibleName("Shipped")
    await expect(shipped).toHaveAccessibleDescription(
      "Nov 3 On its way with the carrier."
    )
  })

  test("Tab lands on the current event, then on the links inside it, then leaves", async ({
    page,
    tab,
  }) => {
    await page.getByRole("button", { name: "Before" }).focus()
    await tab()
    await expect(eventNamed(page, "Shipped")).toBeFocused()
    await tab()
    await expectFocus(page, "Track package")
    await tab()
    await expectFocus(page, "After")
  })

  test("the current event says it's the current step", async ({ page }) => {
    await expect(eventNamed(page, "Shipped")).toHaveAttribute(
      "aria-current",
      "step"
    )
    await expect(eventNamed(page, "Packed")).not.toHaveAttribute(
      "aria-current",
      /.*/
    )
  })

  test("each event and its parts show its status", async ({ page }) => {
    const packed = eventNamed(page, "Packed")
    await expect(packed).toHaveAttribute("data-complete", "")
    await expect(eventNamed(page, "Shipped")).toHaveAttribute(
      "data-current",
      ""
    )
    await expect(eventNamed(page, "Delivered")).toHaveAttribute(
      "data-upcoming",
      ""
    )
    for (const slot of ["marker", "connector", "time", "title"]) {
      await expect(
        packed.locator(`[data-slot="chronology-${slot}"]`)
      ).toHaveAttribute("data-complete", "")
    }
  })

  test("ArrowDown and ArrowUp move between events", async ({ page }) => {
    await eventNamed(page, "Order placed").focus()
    await page.keyboard.press("ArrowDown")
    await expect(eventNamed(page, "Packed")).toBeFocused()
    await page.keyboard.press("ArrowDown")
    await expect(eventNamed(page, "Shipped")).toBeFocused()
    await page.keyboard.press("ArrowUp")
    await expect(eventNamed(page, "Packed")).toBeFocused()
  })

  test("ArrowLeft and ArrowRight do nothing in a vertical list", async ({
    page,
  }) => {
    await eventNamed(page, "Packed").focus()
    await page.keyboard.press("ArrowRight")
    await page.keyboard.press("ArrowLeft")
    await expect(eventNamed(page, "Packed")).toBeFocused()
  })

  test("Home and End move to the first and last events", async ({ page }) => {
    await eventNamed(page, "Packed").focus()
    await page.keyboard.press("End")
    await expect(eventNamed(page, "Delivered")).toBeFocused()
    await page.keyboard.press("Home")
    await expect(eventNamed(page, "Order placed")).toBeFocused()
  })

  test("arrow keys wrap from the last event to the first", async ({ page }) => {
    await eventNamed(page, "Delivered").focus()
    await page.keyboard.press("ArrowDown")
    await expect(eventNamed(page, "Order placed")).toBeFocused()
    await page.keyboard.press("ArrowUp")
    await expect(eventNamed(page, "Delivered")).toBeFocused()
  })

  test("arrow keys on a link inside an event leave focus on the link", async ({
    page,
  }) => {
    const link = page.getByRole("link", { name: "Track package" })
    await link.focus()
    await page.keyboard.press("ArrowDown")
    await expect(link).toBeFocused()
  })

  test("Page Down does nothing in a list", async ({ page }) => {
    await eventNamed(page, "Packed").focus()
    await page.keyboard.press("PageDown")
    await expect(eventNamed(page, "Packed")).toBeFocused()
  })

  test("Tab comes back to the event focused last", async ({ page, tab }) => {
    await eventNamed(page, "Packed").focus()
    await page.keyboard.press("ArrowUp")
    await page.getByRole("button", { name: "Before" }).focus()
    await tab()
    await expect(eventNamed(page, "Order placed")).toBeFocused()
  })

  test("only the event with the tab stop is in the tab order", async ({
    page,
  }) => {
    await expect(
      chronology(page).locator('[data-slot="chronology-item"][tabindex="0"]')
    ).toHaveCount(1)
  })

  test("the first and last events are marked", async ({ page }) => {
    await expect(eventNamed(page, "Order placed")).toHaveAttribute(
      "data-first",
      ""
    )
    await expect(eventNamed(page, "Delivered")).toHaveAttribute("data-last", "")
    await expect(eventNamed(page, "Packed")).not.toHaveAttribute(
      "data-first",
      /.*/
    )
  })

  test("an event added at the top becomes the first", async ({ page }) => {
    await page.getByRole("button", { name: "Add Event" }).click()
    await expect(eventNamed(page, "Payment confirmed")).toHaveAttribute(
      "data-first",
      ""
    )
    await expect(eventNamed(page, "Order placed")).not.toHaveAttribute(
      "data-first",
      /.*/
    )
  })

  test("events that change places move the first and last marks", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Reverse" }).click()
    await expect(eventNamed(page, "Delivered")).toHaveAttribute(
      "data-first",
      ""
    )
    await expect(eventNamed(page, "Order placed")).toHaveAttribute(
      "data-last",
      ""
    )
    await eventNamed(page, "Delivered").focus()
    await page.keyboard.press("ArrowDown")
    await expect(eventNamed(page, "Shipped")).toBeFocused()
  })

  test("each event carries its place and the list how many there are", async ({
    page,
  }) => {
    const count = () =>
      chronology(page).evaluate((el) =>
        el.style.getPropertyValue("--chronology-count")
      )
    const shippedIndex = () =>
      eventNamed(page, "Shipped").evaluate((el) =>
        el.style.getPropertyValue("--chronology-index")
      )
    await expect.poll(count).toBe("4")
    await expect.poll(shippedIndex).toBe("2")
    await page.getByRole("button", { name: "Add Event" }).click()
    await expect.poll(count).toBe("5")
    await expect.poll(shippedIndex).toBe("3")
  })

  test("the tab stop follows the current step when it moves before focus enters", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Advance" }).click()
    const delivered = eventNamed(page, "Delivered")
    await expect(delivered).toHaveAttribute("aria-current", "step")
    await expect(delivered).toHaveAttribute("tabindex", "0")
    await expect(eventNamed(page, "Shipped")).toHaveAttribute("tabindex", "-1")
  })

  test("the controller moves focus to an event", async ({ page }) => {
    await page.getByRole("button", { name: "Focus Current" }).click()
    await expect(eventNamed(page, "Shipped")).toBeFocused()
  })

  test("markers and connectors are hidden from assistive technology", async ({
    page,
  }) => {
    const packed = eventNamed(page, "Packed")
    for (const slot of ["marker", "connector"]) {
      await expect(
        packed.locator(`[data-slot="chronology-${slot}"]`)
      ).toHaveAttribute("aria-hidden", "true")
    }
  })
})

test.describe("a list that doesn't loop", () => {
  test("arrow keys stop at either end", async ({ page, open }) => {
    await open("chronology", { loop: "false" })
    await eventNamed(page, "Delivered").focus()
    await page.keyboard.press("ArrowDown")
    await expect(eventNamed(page, "Delivered")).toBeFocused()
    await page.keyboard.press("Home")
    await page.keyboard.press("ArrowUp")
    await expect(eventNamed(page, "Order placed")).toBeFocused()
  })
})

test.describe("a horizontal list", () => {
  test.beforeEach(async ({ open }) => {
    await open("chronology", { orientation: "horizontal" })
  })

  test("ArrowRight and ArrowLeft move between events", async ({ page }) => {
    await expect(chronology(page)).toHaveAttribute(
      "data-orientation",
      "horizontal"
    )
    await eventNamed(page, "Order placed").focus()
    await page.keyboard.press("ArrowRight")
    await expect(eventNamed(page, "Packed")).toBeFocused()
    await page.keyboard.press("ArrowLeft")
    await expect(eventNamed(page, "Order placed")).toBeFocused()
  })

  test("ArrowDown and ArrowUp do nothing", async ({ page }) => {
    await eventNamed(page, "Packed").focus()
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("ArrowUp")
    await expect(eventNamed(page, "Packed")).toBeFocused()
  })
})

test.describe("a feed", () => {
  test.beforeEach(async ({ open }) => {
    await open("chronology", { feed: "" })
  })

  test("the events are a named feed of articles", async ({ page }) => {
    await expect(chronology(page, "feed")).toBeVisible()
    await expect(chronology(page, "feed").getByRole("article")).toHaveCount(
      titles.length
    )
  })

  test("each article says where it sits and how many there are", async ({
    page,
  }) => {
    const shipped = eventNamed(page, "Shipped", "article")
    await expect(shipped).toHaveAttribute("aria-posinset", "3")
    await expect(shipped).toHaveAttribute("aria-setsize", "4")
  })

  test("an article added at the top moves every position", async ({ page }) => {
    await page.getByRole("button", { name: "Add Event" }).click()
    await expect(
      eventNamed(page, "Payment confirmed", "article")
    ).toHaveAttribute("aria-posinset", "1")
    const shipped = eventNamed(page, "Shipped", "article")
    await expect(shipped).toHaveAttribute("aria-posinset", "4")
    await expect(shipped).toHaveAttribute("aria-setsize", "5")
  })

  test("Page Down and Page Up move between articles", async ({ page }) => {
    await eventNamed(page, "Packed", "article").focus()
    await page.keyboard.press("PageDown")
    await expect(eventNamed(page, "Shipped", "article")).toBeFocused()
    await page.keyboard.press("PageUp")
    await expect(eventNamed(page, "Packed", "article")).toBeFocused()
  })

  test("Page Down from a link inside an article moves to the next article", async ({
    page,
  }) => {
    await page.getByRole("link", { name: "Track package" }).focus()
    await page.keyboard.press("PageDown")
    await expect(eventNamed(page, "Delivered", "article")).toBeFocused()
  })

  test("Page Down on the last article stays there", async ({ page }) => {
    await eventNamed(page, "Delivered", "article").focus()
    await page.keyboard.press("PageDown")
    await expect(eventNamed(page, "Delivered", "article")).toBeFocused()
  })

  test("the feed isn't busy until it's told", async ({ page }) => {
    await expect(chronology(page, "feed")).not.toHaveAttribute(
      "aria-busy",
      /.*/
    )
  })
})

test("a busy feed sets aria-busy", async ({ page, open }) => {
  await open("chronology", { feed: "", busy: "" })
  await expect(chronology(page, "feed")).toHaveAttribute("aria-busy", "true")
})
