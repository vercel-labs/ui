import type { Page } from "@playwright/test"
import { expect, isSheet, lastAction, test, waitForStill } from "../fixtures"
import { moveIntoShadowRoot } from "../fixtures/popup"

// A select-only combobox: a button that opens a listbox, following the WAI-ARIA
// APG pattern https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/
// Focus moves to the options while the list is open.

const trigger = (page: Page) => page.getByRole("combobox", { name: "Fruit" })
// The list is found by role. Naming it is an enhancement.
const listbox = (page: Page) => page.getByRole("listbox")
const option = (page: Page, name: string) => page.getByRole("option", { name, exact: true })

async function openWithKeyboard(page: Page, key = "Enter") {
  await trigger(page).focus()
  await page.keyboard.press(key)
  await expect(listbox(page)).toBeVisible()
}

test.describe("trigger", () => {
  test.beforeEach(async ({ open }) => {
    await open("select")
  })

  test("is a combobox named by its label that shows the placeholder", async ({ page }) => {
    await expect(trigger(page)).toHaveAttribute("aria-expanded", "false")
    await expect(trigger(page)).toContainText("Pick a fruit")
  })

  test("click opens the list", async ({ page }) => {
    await trigger(page).click()
    await expect(listbox(page)).toBeVisible()
    await expect(trigger(page)).toHaveAttribute("aria-expanded", "true")
  })

  for (const key of ["Enter", " ", "ArrowDown"]) {
    test(`${key === " " ? "Space" : key} opens the list and focuses the first item`, async ({ page }) => {
      await openWithKeyboard(page, key)
      await expect(option(page, "Apple")).toBeFocused()
    })
  }

  test("points to the list it controls while open", async ({ page }) => {
    await trigger(page).click()
    const id = await listbox(page).getAttribute("id")
    await expect(trigger(page)).toHaveAttribute("aria-controls", id!)
  })

  test("a click on the open trigger closes the list", async ({ page }) => {
    await trigger(page).click()
    await expect(listbox(page)).toBeVisible()
    await trigger(page).click({ force: true })
    await expect(listbox(page)).toBeHidden()
  })

  test("a click on a trigger in a shadow root opens the list, and it stays open", async ({
    page,
    framework,
  }) => {
    test.skip(
      framework.startsWith("react"),
      "React stops hearing events once its tree moves into a shadow root.",
    )
    await moveIntoShadowRoot(page.locator(".fixture"))
    await trigger(page).click()
    await expect(listbox(page)).toBeVisible()
    await page.waitForTimeout(100)
    await expect(listbox(page)).toBeVisible()
    await expect(trigger(page)).toHaveAttribute("aria-expanded", "true")
  })
})

test.describe("keyboard in the list", () => {
  test.beforeEach(async ({ open }) => {
    await open("select")
  })

  test("arrow keys move focus through the items", async ({ page }) => {
    await openWithKeyboard(page)
    await page.keyboard.press("ArrowDown")
    await expect(option(page, "Banana")).toBeFocused()
    await page.keyboard.press("ArrowUp")
    await expect(option(page, "Apple")).toBeFocused()
  })

  test("Home and End move to the first and last items", async ({ page }) => {
    await openWithKeyboard(page)
    await page.keyboard.press("End")
    await expect(option(page, "Orange")).toBeFocused()
    await page.keyboard.press("Home")
    await expect(option(page, "Apple")).toBeFocused()
  })

  test("arrow keys skip disabled items", async ({ page }) => {
    await openWithKeyboard(page)
    for (let step = 0; step < 4; step++) await page.keyboard.press("ArrowDown")
    await expect(option(page, "Lemon")).toBeFocused()
    await expect(option(page, "Grape")).toHaveAttribute("aria-disabled", "true")
    await page.keyboard.press("ArrowUp")
    await expect(option(page, "Cherry")).toBeFocused()
  })

  test("typing focuses the next item that starts with the text", async ({ page }) => {
    await openWithKeyboard(page)
    await page.keyboard.type("m")
    await expect(option(page, "Mango")).toBeFocused()
    // Typing again soon after continues the same search. A pause starts a new one.
    await page.waitForTimeout(1000)
    await page.keyboard.type("bl")
    await expect(option(page, "Blueberry")).toBeFocused()
  })

  test("Enter chooses the focused item, closes and returns focus to the trigger", async ({ page }) => {
    await openWithKeyboard(page)
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("Enter")
    await expect(listbox(page)).toBeHidden()
    await expect(trigger(page)).toBeFocused()
    await expect(trigger(page)).toContainText("Banana")
    expect(await lastAction(page)).toContain("banana")
  })

  test("Space chooses the focused item", async ({ page }) => {
    await openWithKeyboard(page)
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press(" ")
    await expect(listbox(page)).toBeHidden()
    await expect(trigger(page)).toContainText("Banana")
  })

  test("Escape closes without choosing and returns focus to the trigger", async ({ page }) => {
    await openWithKeyboard(page)
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("Escape")
    await expect(listbox(page)).toBeHidden()
    await expect(trigger(page)).toBeFocused()
    await expect(trigger(page)).toContainText("Pick a fruit")
  })

  test("the chosen item is selected when the list opens again, and takes focus", async ({ page }) => {
    await openWithKeyboard(page)
    await page.keyboard.press("End")
    await page.keyboard.press("Enter")
    await expect(listbox(page)).toBeHidden()
    await page.keyboard.press("Enter")
    await expect(option(page, "Orange")).toBeFocused()
    await expect(option(page, "Orange")).toHaveAttribute("aria-selected", "true")
    await expect(option(page, "Apple")).not.toHaveAttribute("aria-selected", "true")
  })
})

test.describe("typing on the closed trigger", () => {
  test("selects the next item that starts with the text, like a native select", async ({ page, open }) => {
    await open("select")
    await trigger(page).focus()
    await page.keyboard.type("b")
    await expect(trigger(page)).toContainText("Banana")
    await expect(listbox(page)).toBeHidden()
    await page.keyboard.type("b")
    await expect(trigger(page)).toContainText("Blueberry")
  })

  test("skips disabled items", async ({ page, open }) => {
    await open("select")
    await trigger(page).focus()
    await page.keyboard.type("g")
    await expect(trigger(page)).toContainText("Pick a fruit")
  })
})

test.describe("pointer", () => {
  test.beforeEach(async ({ open }) => {
    await open("select")
  })

  test("clicking an item chooses it and closes the list", async ({ page }) => {
    await trigger(page).click()
    await option(page, "Cherry").click()
    await expect(listbox(page)).toBeHidden()
    await expect(trigger(page)).toContainText("Cherry")
  })

  test("clicking a disabled item does nothing", async ({ page }) => {
    await trigger(page).click()
    // A forced press doesn't wait for a rising sheet.
    await waitForStill(listbox(page))
    await option(page, "Grape").click({ force: true })
    await expect(listbox(page)).toBeVisible()
    await expect(trigger(page)).toContainText("Pick a fruit")
  })

  test("moving over a disabled item leaves the highlight where it was", async ({ page }) => {
    await trigger(page).click()
    await waitForStill(listbox(page))
    await option(page, "Cherry").hover()
    await expect(option(page, "Cherry")).toHaveAttribute("data-highlighted", "")
    await option(page, "Grape").hover({ force: true })
    await expect(option(page, "Cherry")).toHaveAttribute("data-highlighted", "")
    await expect(option(page, "Grape")).not.toHaveAttribute("data-highlighted", "")
  })

  test("clicking outside closes without choosing", async ({ page }) => {
    await trigger(page).click()
    await expect(listbox(page)).toBeVisible()
    await page.mouse.click(5, 5)
    await expect(listbox(page)).toBeHidden()
    await expect(trigger(page)).toContainText("Pick a fruit")
  })

  test("pressing, dragging to an item and releasing chooses it", async ({ page }) => {
    const from = (await trigger(page).boundingBox())!
    await page.mouse.move(from.x + 10, from.y + from.height / 2)
    await page.mouse.down()
    await expect(listbox(page)).toBeVisible()
    await waitForStill(listbox(page))
    const target = (await option(page, "Lemon").boundingBox())!
    await page.mouse.move(target.x + 10, target.y + target.height / 2, { steps: 5 })
    await page.mouse.up()
    await expect(listbox(page)).toBeHidden()
    await expect(trigger(page)).toContainText("Lemon")
  })

  test("Enter opens the list after a drag chose an item", async ({ page }) => {
    const from = (await trigger(page).boundingBox())!
    await page.mouse.move(from.x + 10, from.y + from.height / 2)
    await page.mouse.down()
    await waitForStill(listbox(page))
    const target = (await option(page, "Lemon").boundingBox())!
    await page.mouse.move(target.x + 10, target.y + target.height / 2, { steps: 5 })
    await page.mouse.up()
    await expect(listbox(page)).toBeHidden()
    await openWithKeyboard(page)
  })

  test("Enter opens the list after pressing the open trigger and releasing elsewhere", async ({ page }) => {
    await trigger(page).click()
    await waitForStill(listbox(page))
    const from = (await trigger(page).boundingBox())!
    await page.mouse.move(from.x + 10, from.y + from.height / 2)
    await page.mouse.down()
    await expect(listbox(page)).toBeHidden()
    await page.mouse.move(5, 5, { steps: 5 })
    await page.mouse.up()
    await openWithKeyboard(page)
  })
})

test.describe("value", () => {
  test("a disabled value stays in the trigger, and the list opens on the first enabled item", async ({
    page,
    open,
  }) => {
    await open("select", { value: "grape" })
    await expect(trigger(page)).toContainText("Grape")
    await openWithKeyboard(page)
    await expect(option(page, "Apple")).toBeFocused()
    await expect(option(page, "Grape")).toHaveAttribute("aria-selected", "true")
  })

  test("a default value shows its label and is selected", async ({ page, open }) => {
    await open("select", { value: "banana" })
    await expect(trigger(page)).toContainText("Banana")
    await trigger(page).click()
    await expect(option(page, "Banana")).toHaveAttribute("aria-selected", "true")
  })

  test("opening with a selected item focuses it", async ({ page, open }) => {
    await open("select", { value: "mango" })
    await openWithKeyboard(page)
    await expect(option(page, "Mango")).toBeFocused()
  })

  test("canceling the change keeps the value", async ({ page, open }) => {
    await open("select", { cancel: "", value: "apple" })
    await openWithKeyboard(page)
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("Enter")
    await expect(trigger(page)).toContainText("Apple")
  })
})

test.describe("multiple", () => {
  test.beforeEach(async ({ open }) => {
    await open("select", { multiple: "" })
  })

  test("the list allows several selections", async ({ page }) => {
    await trigger(page).click()
    await expect(listbox(page)).toHaveAttribute("aria-multiselectable", "true")
  })

  test("choosing toggles items and keeps the list open", async ({ page }) => {
    await openWithKeyboard(page)
    await page.keyboard.press("Enter")
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("Enter")
    await expect(listbox(page)).toBeVisible()
    await expect(option(page, "Apple")).toHaveAttribute("aria-selected", "true")
    await expect(option(page, "Banana")).toHaveAttribute("aria-selected", "true")
    expect(await lastAction(page)).toBe("value:apple,banana")
    await page.keyboard.press("ArrowUp")
    await page.keyboard.press("Enter")
    expect(await lastAction(page)).toBe("value:banana")
  })
})

test.describe("groups", () => {
  test("items sit in groups named by their labels", async ({ page, open }) => {
    await open("select", { grouped: "" })
    await trigger(page).click()
    await expect(page.getByRole("group", { name: "Vegetables" })).toBeVisible()
    await expect(page.getByRole("group", { name: "Vegetables" }).getByRole("option")).toHaveCount(3)
  })

  test("arrow keys move across groups", async ({ page, open }) => {
    await open("select", { grouped: "" })
    await openWithKeyboard(page)
    await page.keyboard.press("End")
    await expect(option(page, "Pepper")).toBeFocused()
    await page.keyboard.press("ArrowUp")
    await page.keyboard.press("ArrowUp")
    await page.keyboard.press("ArrowUp")
    await expect(option(page, "Orange")).toBeFocused()
  })
})

test.describe("forms", () => {
  test("the form submits the value under the select's name", async ({ page, open }) => {
    await open("select", { value: "banana" })
    await page.getByRole("button", { name: "Submit" }).click()
    await expect(page.getByRole("status", { name: "Submitted" })).toHaveText("fruit=banana")
  })

  test("a required select blocks submission until a value is chosen", async ({ page, open }) => {
    await open("select", { required: "" })
    await page.getByRole("button", { name: "Submit" }).click()
    await expect(page.getByRole("status", { name: "Submitted" })).toHaveText("")
    await openWithKeyboard(page)
    await page.keyboard.press("Enter")
    await page.getByRole("button", { name: "Submit" }).click()
    await expect(page.getByRole("status", { name: "Submitted" })).toHaveText("fruit=apple")
  })

  test("a disabled select can't be opened", async ({ page, open }) => {
    await open("select", { disabled: "" })
    await expect(trigger(page)).toBeDisabled()
  })

  test("a read-only select doesn't change its value", async ({ page, open }) => {
    await open("select", { readonly: "", value: "apple" })
    await openWithKeyboard(page)
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("Enter")
    await expect(trigger(page)).toContainText("Apple")
  })

  test("a disabled fieldset disables the select and leaves it out of the form", async ({ page, open }) => {
    await open("select", { fieldset: "", value: "banana" })
    await expect(trigger(page)).toBeDisabled()
    await page.getByRole("button", { name: "Submit" }).click()
    await expect(page.getByRole("status", { name: "Submitted" })).toHaveText("")
  })
})

test.describe("positioning", () => {
  test.beforeEach(({ fixtureOptions }) => {
    test.skip(isSheet(fixtureOptions), "A sheet isn't placed against its trigger.")
  })

  test("the list opens below the trigger, at least as wide", async ({ page, open }) => {
    await open("select")
    await trigger(page).click()
    await expect(listbox(page)).toBeVisible()
    const anchor = (await trigger(page).boundingBox())!
    const popup = (await page.locator(".list-popup").first().boundingBox())!
    expect(popup.y).toBeGreaterThanOrEqual(anchor.y + anchor.height - 1)
    expect(Math.abs(popup.x - anchor.x)).toBeLessThanOrEqual(1)
  })
})

test("with alignItemWithTrigger, the selected item sits over the trigger", async ({
  page,
  open,
  framework,
  fixtureOptions,
}) => {
  test.skip(framework.endsWith("-data"), "A data select renders its own content, without content props.")
  test.skip(isSheet(fixtureOptions), "A sheet isn't placed against its trigger.")
  await open("select", { align: "", value: "lemon", layout: "bottom" })
  await page.setViewportSize({ width: 800, height: 900 })
  await page.evaluate(() => {
    document.body.dataset.layout = ""
    document.querySelector<HTMLElement>(".fixture")!.style.paddingTop = "400px"
  })
  await trigger(page).focus()
  await page.keyboard.press("Enter")
  await expect(option(page, "Lemon")).toBeFocused()
  const anchor = (await trigger(page).boundingBox())!
  const item = (await option(page, "Lemon").boundingBox())!
  expect(Math.abs(item.y + item.height / 2 - (anchor.y + anchor.height / 2))).toBeLessThanOrEqual(4)
})

test("a controller opens the list", async ({ page, open }) => {
  await open("select")
  await page.getByRole("button", { name: "Open with controller" }).click()
  await expect(listbox(page)).toBeVisible()
})
