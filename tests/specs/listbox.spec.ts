import { expect, lastAction, test } from "../fixtures"
import { expectSelected, list, option, reason, submitted, tabIn } from "./listbox.helpers"

// An always-visible listbox, following the WAI-ARIA APG listbox pattern
// https://www.w3.org/WAI/ARIA/apg/patterns/listbox/. Options take real focus,
// with one tab stop for the list.

test.describe("focus", () => {
  test("Tab lands on the first option when nothing is selected", async ({ page, open, tab }) => {
    await open("listbox")
    await tabIn(page, tab)
    await expect(option(page, "Basil")).toBeFocused()
  })

  test("Tab lands on the selected option", async ({ page, open, tab }) => {
    await open("listbox", { value: "onion" })
    await tabIn(page, tab)
    await expect(option(page, "Onion")).toBeFocused()
  })

  test("Tab lands on the first selected option with multiple", async ({ page, open, tab }) => {
    await open("listbox", { multiple: "", value: "pepper,garlic" })
    await tabIn(page, tab)
    await expect(option(page, "Garlic")).toBeFocused()
  })

  test("the list is one tab stop: Tab leaves it from any option", async ({ page, open, tab }) => {
    await open("listbox")
    await tabIn(page, tab)
    await page.keyboard.press("ArrowDown")
    await expect(option(page, "Cheese")).toBeFocused()
    await tab()
    await expect(page.getByRole("button", { name: "Submit" })).toBeFocused()
  })

  test("Shift+Tab back into the list returns to the option focused last", async ({ page, open, tab }) => {
    await open("listbox", { activation: "manual" })
    await tabIn(page, tab)
    await page.keyboard.press("End")
    await expect(option(page, "Tomato")).toBeFocused()
    await tab()
    await tab({ shift: true })
    await expect(option(page, "Tomato")).toBeFocused()
  })

  test("a press focuses the option", async ({ page, open }) => {
    await open("listbox")
    await option(page, "Garlic").click()
    await expect(option(page, "Garlic")).toBeFocused()
  })

  test("arrow keys skip disabled options", async ({ page, open }) => {
    await open("listbox", { value: "mushroom", activation: "manual" })
    await option(page, "Mushroom").focus()
    await page.keyboard.press("ArrowDown")
    await expect(option(page, "Onion")).toBeFocused()
    await expect(option(page, "Olive")).toHaveAttribute("aria-disabled", "true")
    await page.keyboard.press("ArrowUp")
    await expect(option(page, "Mushroom")).toBeFocused()
  })

  test("a disabled option can't be chosen", async ({ page, open }) => {
    await open("listbox", { value: "mushroom" })
    await option(page, "Olive").click({ force: true })
    await expectSelected(page, ["Mushroom"])
  })

  test("arrow keys from a pressed disabled option move to the enabled ones around it", async ({
    page,
    open,
  }) => {
    await open("listbox", { activation: "manual" })
    await option(page, "Olive").click({ force: true })
    await page.keyboard.press("ArrowDown")
    await expect(option(page, "Onion")).toBeFocused()
    await option(page, "Olive").click({ force: true })
    await page.keyboard.press("ArrowUp")
    await expect(option(page, "Mushroom")).toBeFocused()
  })

  test("Tab lands on the first enabled option when the selected one is disabled", async ({
    page,
    open,
    tab,
  }) => {
    await open("listbox", { value: "olive" })
    await tabIn(page, tab)
    await expect(option(page, "Basil")).toBeFocused()
    await expectSelected(page, ["Olive"])
  })
})

test.describe("single selection", () => {
  test("arrow keys move focus and the selection follows", async ({ page, open, tab }) => {
    await open("listbox")
    await tabIn(page, tab)
    await page.keyboard.press("ArrowDown")
    await expect(option(page, "Cheese")).toBeFocused()
    await expectSelected(page, ["Cheese"])
    await page.keyboard.press("ArrowUp")
    await expectSelected(page, ["Basil"])
    expect(await lastAction(page)).toBe("value:basil")
    await expect(reason(page)).toHaveText("list-navigation")
  })

  test("Home and End move to the first and last option", async ({ page, open, tab }) => {
    await open("listbox")
    await tabIn(page, tab)
    await page.keyboard.press("End")
    await expect(option(page, "Tomato")).toBeFocused()
    await expectSelected(page, ["Tomato"])
    await page.keyboard.press("Home")
    await expect(option(page, "Basil")).toBeFocused()
    await expectSelected(page, ["Basil"])
  })

  test("arrow keys wrap from the last option to the first", async ({ page, open }) => {
    await open("listbox", { value: "tomato" })
    await option(page, "Tomato").focus()
    await page.keyboard.press("ArrowDown")
    await expect(option(page, "Basil")).toBeFocused()
  })

  test("with loop off, arrow keys stop at the ends", async ({ page, open }) => {
    await open("listbox", { value: "tomato", loop: "false" })
    await option(page, "Tomato").focus()
    await page.keyboard.press("ArrowDown")
    await expect(option(page, "Tomato")).toBeFocused()
  })

  test("a press selects the option", async ({ page, open }) => {
    await open("listbox")
    await option(page, "Pepper").click()
    await expectSelected(page, ["Pepper"])
    expect(await lastAction(page)).toBe("value:pepper")
    await expect(reason(page)).toHaveText("item-press")
  })

  test("pressing the selected option keeps it selected", async ({ page, open }) => {
    await open("listbox", { value: "pepper" })
    await option(page, "Pepper").click()
    await expectSelected(page, ["Pepper"])
  })

  test("with deselectable, pressing the selected option unselects it", async ({ page, open }) => {
    await open("listbox", { value: "pepper", deselectable: "" })
    await option(page, "Pepper").click()
    await expectSelected(page, [])
    expect(await lastAction(page)).toBe("value:")
  })

  test("with manual activation, arrows only move focus and Space selects", async ({ page, open, tab }) => {
    await open("listbox", { activation: "manual" })
    await tabIn(page, tab)
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("ArrowDown")
    await expect(option(page, "Garlic")).toBeFocused()
    await expectSelected(page, [])
    await page.keyboard.press(" ")
    await expectSelected(page, ["Garlic"])
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("Enter")
    await expectSelected(page, ["Mushroom"])
    await expect(reason(page)).toHaveText("item-press")
  })

  test("typing moves focus to the next option that starts with it, and selects it", async ({
    page,
    open,
    tab,
  }) => {
    await open("listbox")
    await tabIn(page, tab)
    await page.keyboard.press("o")
    // Olive is disabled, so typing skips it.
    await expect(option(page, "Onion")).toBeFocused()
    await expectSelected(page, ["Onion"])
  })

  test("typing several letters finds the option that starts with them", async ({ page, open, tab }) => {
    await open("listbox", { activation: "manual" })
    await tabIn(page, tab)
    await page.keyboard.type("ga")
    await expect(option(page, "Garlic")).toBeFocused()
    await expectSelected(page, [])
  })

  test("Escape leaves the selection alone", async ({ page, open }) => {
    await open("listbox", { value: "cheese" })
    await option(page, "Cheese").focus()
    await page.keyboard.press("Escape")
    await expectSelected(page, ["Cheese"])
  })
})

test.describe("multiple selection", () => {
  test("presses and Space toggle options", async ({ page, open, tab }) => {
    await open("listbox", { multiple: "" })
    await option(page, "Cheese").click()
    await option(page, "Onion").click()
    await expectSelected(page, ["Cheese", "Onion"])
    await option(page, "Cheese").click()
    await expectSelected(page, ["Onion"])
    await page.keyboard.press("ArrowDown")
    await expect(option(page, "Garlic")).toBeFocused()
    await page.keyboard.press(" ")
    await expectSelected(page, ["Garlic", "Onion"])
    expect(await lastAction(page)).toBe("value:onion,garlic")
  })

  test("arrow keys move focus without changing the selection", async ({ page, open }) => {
    await open("listbox", { multiple: "", value: "basil" })
    await option(page, "Basil").focus()
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("ArrowDown")
    await expect(option(page, "Garlic")).toBeFocused()
    await expectSelected(page, ["Basil"])
  })

  test("Shift with a press selects the range from the last option chosen", async ({ page, open }) => {
    await open("listbox", { multiple: "" })
    await option(page, "Cheese").click()
    await option(page, "Mushroom").click({ modifiers: ["Shift"] })
    await expectSelected(page, ["Cheese", "Garlic", "Mushroom"])
  })

  test("Shift with an arrow passes over a disabled option", async ({ page, open }) => {
    await open("listbox", { multiple: "" })
    await option(page, "Mushroom").click()
    await page.keyboard.press("Shift+ArrowDown")
    await expect(option(page, "Onion")).toBeFocused()
    await expectSelected(page, ["Mushroom", "Onion"])
  })

  test("a range skips disabled options", async ({ page, open }) => {
    await open("listbox", { multiple: "" })
    await option(page, "Mushroom").click()
    await option(page, "Pepper").click({ modifiers: ["Shift"] })
    await expectSelected(page, ["Mushroom", "Onion", "Pepper"])
  })

  test("a second Shift press changes the range, keeping what was selected before it", async ({
    page,
    open,
  }) => {
    await open("listbox", { multiple: "" })
    await option(page, "Tomato").click()
    await option(page, "Basil").click()
    await option(page, "Mushroom").click({ modifiers: ["Shift"] })
    await expectSelected(page, ["Basil", "Cheese", "Garlic", "Mushroom", "Tomato"])
    await option(page, "Cheese").click({ modifiers: ["Shift"] })
    await expectSelected(page, ["Basil", "Cheese", "Tomato"])
  })

  test("Shift with an arrow key moves focus and extends the selection", async ({ page, open }) => {
    await open("listbox", { multiple: "" })
    await option(page, "Cheese").click()
    await page.keyboard.press("Shift+ArrowDown")
    await page.keyboard.press("Shift+ArrowDown")
    await expect(option(page, "Mushroom")).toBeFocused()
    await expectSelected(page, ["Cheese", "Garlic", "Mushroom"])
    await page.keyboard.press("Shift+ArrowUp")
    await expectSelected(page, ["Cheese", "Garlic"])
    await expect(reason(page)).toHaveText("list-navigation")
  })

  test("Shift with Space selects from the last option chosen to the focused one", async ({ page, open }) => {
    await open("listbox", { multiple: "" })
    await option(page, "Basil").click()
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("Shift+ ")
    await expectSelected(page, ["Basil", "Cheese", "Garlic"])
  })

  test("Ctrl+Shift+End selects from the focused option to the last", async ({ page, open }) => {
    await open("listbox", { multiple: "" })
    await option(page, "Onion").click()
    await page.keyboard.press("ControlOrMeta+Shift+End")
    await expect(option(page, "Tomato")).toBeFocused()
    await expectSelected(page, ["Onion", "Pepper", "Tomato"])
  })

  test("Ctrl+Shift+Home selects from the focused option to the first", async ({ page, open }) => {
    await open("listbox", { multiple: "" })
    await option(page, "Garlic").click()
    await page.keyboard.press("ControlOrMeta+Shift+Home")
    await expect(option(page, "Basil")).toBeFocused()
    await expectSelected(page, ["Basil", "Cheese", "Garlic"])
  })

  test("Ctrl+A selects every enabled option, and again unselects them", async ({ page, open }) => {
    await open("listbox", { multiple: "" })
    await option(page, "Basil").click()
    await page.keyboard.press("ControlOrMeta+a")
    await expectSelected(page, ["Basil", "Cheese", "Garlic", "Mushroom", "Onion", "Pepper", "Tomato"])
    await page.keyboard.press("ControlOrMeta+a")
    await expectSelected(page, [])
  })

  test("Ctrl+A does nothing in a single listbox", async ({ page, open }) => {
    await open("listbox", { value: "basil" })
    await option(page, "Basil").focus()
    await page.keyboard.press("ControlOrMeta+a")
    await expectSelected(page, ["Basil"])
  })

  test("typing moves focus without selecting", async ({ page, open }) => {
    await open("listbox", { multiple: "" })
    await option(page, "Basil").focus()
    await page.keyboard.press("p")
    await expect(option(page, "Pepper")).toBeFocused()
    await expectSelected(page, [])
  })
})

test.describe("multiple selection with automatic activation", () => {
  test.beforeEach(async ({ open }) => {
    await open("listbox", { multiple: "", activation: "automatic" })
  })

  test("a press replaces the selection", async ({ page }) => {
    await option(page, "Cheese").click()
    await option(page, "Onion").click()
    await expectSelected(page, ["Onion"])
  })

  test("Ctrl or Cmd with a press adds an option, and removes it again", async ({ page }) => {
    await option(page, "Cheese").click()
    await option(page, "Onion").click({ modifiers: ["ControlOrMeta"] })
    await expectSelected(page, ["Cheese", "Onion"])
    await option(page, "Cheese").click({ modifiers: ["ControlOrMeta"] })
    await expectSelected(page, ["Onion"])
  })

  test("Shift with a press replaces the selection with a range", async ({ page }) => {
    await option(page, "Tomato").click({ modifiers: ["ControlOrMeta"] })
    await option(page, "Basil").click({ modifiers: ["ControlOrMeta"] })
    await option(page, "Garlic").click({ modifiers: ["Shift"] })
    await expectSelected(page, ["Basil", "Cheese", "Garlic"])
  })

  test("arrow keys select the option they move to", async ({ page }) => {
    await option(page, "Cheese").click()
    await page.keyboard.press("ArrowDown")
    await expectSelected(page, ["Garlic"])
  })

  test("Ctrl or Cmd with an arrow moves focus only, and with Space toggles", async ({ page }) => {
    await option(page, "Cheese").click()
    await page.keyboard.press("ControlOrMeta+ArrowDown")
    await page.keyboard.press("ControlOrMeta+ArrowDown")
    await expect(option(page, "Mushroom")).toBeFocused()
    await expectSelected(page, ["Cheese"])
    await page.keyboard.press("ControlOrMeta+ ")
    await expectSelected(page, ["Cheese", "Mushroom"])
  })

  test("Shift with an arrow key extends the selection", async ({ page }) => {
    await option(page, "Onion").click()
    await page.keyboard.press("Shift+ArrowDown")
    await expectSelected(page, ["Onion", "Pepper"])
  })
})

test.describe("horizontal", () => {
  test("Left and Right move between options, and Up and Down don't", async ({ page, open }) => {
    await open("listbox", { orientation: "horizontal" })
    await expect(list(page)).toHaveAttribute("aria-orientation", "horizontal")
    await option(page, "Basil").focus()
    await page.keyboard.press("ArrowRight")
    await expect(option(page, "Cheese")).toBeFocused()
    await page.keyboard.press("ArrowDown")
    await expect(option(page, "Cheese")).toBeFocused()
    await page.keyboard.press("ArrowLeft")
    await expect(option(page, "Basil")).toBeFocused()
  })
})

test.describe("groups", () => {
  test("arrow keys move across groups, skipping their labels", async ({ page, open }) => {
    await open("listbox", { grouped: "" })
    await option(page, "Garlic").focus()
    await page.keyboard.press("ArrowDown")
    await expect(option(page, "Mushroom")).toBeFocused()
    await expectSelected(page, ["Mushroom"])
  })

  test("a range crosses groups", async ({ page, open }) => {
    await open("listbox", { grouped: "", multiple: "" })
    await option(page, "Garlic").click()
    await option(page, "Onion").click({ modifiers: ["Shift"] })
    await expectSelected(page, ["Garlic", "Mushroom", "Onion"])
  })
})

test.describe("form", () => {
  test("submits the selected value under its name", async ({ page, open }) => {
    await open("listbox", { value: "cheese" })
    await page.getByRole("button", { name: "Submit" }).click()
    await expect(submitted(page)).toHaveText("toppings=cheese")
  })

  test("submits each value with multiple", async ({ page, open }) => {
    await open("listbox", { multiple: "" })
    await option(page, "Basil").click()
    await option(page, "Onion").click()
    await page.getByRole("button", { name: "Submit" }).click()
    await expect(submitted(page)).toHaveText("toppings=basil&toppings=onion")
  })

  test("a reset returns to the default value", async ({ page, open }) => {
    await open("listbox", { value: "cheese" })
    await option(page, "Tomato").click()
    await page.getByRole("button", { name: "Reset" }).click()
    await expectSelected(page, ["Cheese"])
    await expect(reason(page)).toHaveText("reset")
  })

  test("required blocks submission until a value is selected", async ({
    page,
    open,
    framework,
    browserName,
  }) => {
    // The cause needs a CI trace. Likely: headless
    // WebKit on Linux is WPE, which has no native validation bubble and draws
    // one inside a user agent shadow root on the validation anchor. The anchor
    // is the <ui-listbox> element, so its items would stop rendering.
    test.fixme(
      browserName === "webkit" && process.platform === "linux" && framework === "web",
      "On CI's Linux WebKit, the web listbox's items stop rendering after a blocked submit.",
    )
    await open("listbox", { required: "" })
    await expect(list(page)).toHaveAttribute("aria-required", "true")
    await page.getByRole("button", { name: "Submit" }).click()
    await expect(submitted(page)).toHaveText("")
    await option(page, "Basil").click()
    await page.getByRole("button", { name: "Submit" }).click()
    await expect(submitted(page)).toHaveText("toppings=basil")
  })

  test("a disabled listbox can't be focused or changed, and submits nothing", async ({ page, open, tab }) => {
    await open("listbox", { disabled: "", value: "cheese" })
    await expect(list(page)).toHaveAttribute("aria-disabled", "true")
    await tabIn(page, tab)
    await expect(page.getByRole("button", { name: "Submit" })).toBeFocused()
    await option(page, "Basil").click({ force: true })
    await expectSelected(page, ["Cheese"])
    await page.getByRole("button", { name: "Submit" }).click()
    await expect(submitted(page)).toHaveText("")
  })

  test("a disabled fieldset disables the listbox", async ({ page, open, tab }) => {
    await open("listbox", { fieldset: "", value: "cheese" })
    await expect(list(page)).toHaveAttribute("data-disabled", "")
    await tabIn(page, tab)
    await expect(list(page).getByRole("option").first()).not.toBeFocused()
    await expect(page.locator(":focus")).not.toHaveAttribute("role", "option")
  })

  test("a read-only listbox can be browsed but not changed, and submits", async ({ page, open, tab }) => {
    await open("listbox", { readonly: "", value: "cheese" })
    await expect(list(page)).toHaveAttribute("aria-readonly", "true")
    await tabIn(page, tab)
    await page.keyboard.press("ArrowDown")
    await expect(option(page, "Garlic")).toBeFocused()
    await page.keyboard.press(" ")
    await option(page, "Tomato").click()
    await expectSelected(page, ["Cheese"])
    await page.getByRole("button", { name: "Submit" }).click()
    await expect(submitted(page)).toHaveText("toppings=cheese")
  })
})

test.describe("changes", () => {
  test("a canceled change keeps the selection", async ({ page, open }) => {
    await open("listbox", { cancel: "", value: "cheese" })
    await option(page, "Basil").click()
    await expectSelected(page, ["Cheese"])
    await expect(reason(page)).toHaveText("item-press")
  })

  test("a controlled listbox shows the value it's given", async ({ page, open }) => {
    await open("listbox", { controlled: "", multiple: "" })
    await option(page, "Basil").click()
    await option(page, "Pepper").click({ modifiers: ["Shift"] })
    await expectSelected(page, ["Basil", "Cheese", "Garlic", "Mushroom", "Onion", "Pepper"])
  })

  test("the controller clears and selects everything", async ({ page, open }) => {
    await open("listbox", { multiple: "", value: "basil" })
    await page.getByRole("button", { name: "Select all with controller" }).click()
    await expectSelected(page, ["Basil", "Cheese", "Garlic", "Mushroom", "Onion", "Pepper", "Tomato"])
    await page.getByRole("button", { name: "Clear with controller" }).click()
    await expectSelected(page, [])
    await expect(reason(page)).toHaveText("imperative")
  })
})
