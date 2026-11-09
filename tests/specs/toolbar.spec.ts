import { expect, expectFocus, lastAction, menuNamed, test } from "../fixtures"
import { toolbar, walkTo } from "./toolbar.helpers"

// A row of controls with one tab stop and arrow keys between them, like the
// WAI-ARIA toolbar pattern: https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/

test.beforeEach(async ({ open }) => {
  await open("toolbar")
})

test("the toolbar is named and has a horizontal orientation", async ({
  page,
}) => {
  await expect(toolbar(page)).toBeVisible()
  await expect(toolbar(page)).toHaveAttribute("aria-orientation", "horizontal")
})

test("Tab lands on the first item, and Tab again leaves the toolbar", async ({
  page,
  tab,
}) => {
  await page.getByRole("button", { name: "Before" }).focus()
  await tab()
  await expectFocus(page, "Bold")
  await tab()
  await expectFocus(page, "After")
})

test("Shift+Tab from after the toolbar lands on its tab stop", async ({
  page,
  tab,
}) => {
  await page.getByRole("button", { name: "After" }).focus()
  await tab({ shift: true })
  await expectFocus(page, "Bold")
})

test("ArrowRight moves through every item, into toggle groups and out of fields", async ({
  page,
  tab,
}) => {
  await walkTo(page, tab, "Help")
})

test("ArrowRight on the last item wraps to the first, and ArrowLeft back", async ({
  page,
  tab,
}) => {
  await walkTo(page, tab, "Help")
  await page.keyboard.press("ArrowRight")
  await expectFocus(page, "Bold")
  await page.keyboard.press("ArrowLeft")
  await expectFocus(page, "Help")
})

test("arrow keys never press a toggle, and Space and Enter do", async ({
  page,
  tab,
}) => {
  await walkTo(page, tab, "Italic")
  await expect(page.getByRole("button", { name: "Italic" })).toHaveAttribute(
    "aria-pressed",
    "false"
  )
  await page.keyboard.press("Space")
  await expect(page.getByRole("button", { name: "Italic" })).toHaveAttribute(
    "aria-pressed",
    "true"
  )
  expect(await lastAction(page)).toBe("Text style: bold, italic")
  await page.keyboard.press("ArrowRight")
  await expectFocus(page, "Underline")
  await page.keyboard.press("ArrowRight")
  await page.keyboard.press("ArrowRight")
  await page.keyboard.press("Enter")
  expect(await lastAction(page)).toBe("Alignment: center")
})

test("Tab comes back to the item focused last", async ({ page, tab }) => {
  await walkTo(page, tab, "Center")
  await tab()
  await expectFocus(page, "After")
  await tab({ shift: true })
  await expectFocus(page, "Center")
})

test("a toggle group in the toolbar is no tab stop of its own", async ({
  page,
  tab,
}) => {
  await page.getByRole("button", { name: "Before" }).focus()
  await tab()
  await expectFocus(page, "Bold")
  await tab()
  await expectFocus(page, "After")
  await expect(page.getByRole("button", { name: "Left" })).toHaveAttribute(
    "tabindex",
    "-1"
  )
})

test("a disabled button stays reachable, says it's disabled and does nothing", async ({
  page,
  tab,
}) => {
  await walkTo(page, tab, "Redo")
  const redo = page.getByRole("button", { name: "Redo" })
  await expect(redo).toHaveAttribute("aria-disabled", "true")
  await page.keyboard.press("Enter")
  await page.keyboard.press("Space")
  await redo.click({ force: true })
  expect(await lastAction(page)).toBe("")
  await page.keyboard.press("ArrowRight")
  await expectFocus(page, "Spellcheck")
})

test("a button runs its action when pressed", async ({ page }) => {
  await page.getByRole("button", { name: "Undo" }).click()
  expect(await lastAction(page)).toBe("undo")
})

test("a menu trigger rendered through a button opens with ArrowDown, and arrows still move past it", async ({
  page,
  tab,
}) => {
  await walkTo(page, tab, "Font")
  await expect(page.getByRole("button", { name: "Font" })).toHaveAttribute(
    "aria-haspopup",
    "menu"
  )
  await page.keyboard.press("ArrowDown")
  await expect(menuNamed(page, "Font")).toBeVisible()
  await expectFocus(page, "Sans")
  await page.keyboard.press("Escape")
  await expectFocus(page, "Font")
  await page.keyboard.press("ArrowRight")
  await expectFocus(page, "Font size")
})

test("choosing from a menu in the toolbar returns focus to its trigger", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Font" }).click()
  await page.getByRole("menuitem", { name: "Serif" }).click()
  expect(await lastAction(page)).toBe("font: Serif")
  await expectFocus(page, "Font")
})

// Where Home and End move the caret depends on the platform, so this checks
// only that focus stays in the field.
test("a text field keeps Home and End for its caret", async ({ page, tab }) => {
  await walkTo(page, tab, "Comment")
  await page.keyboard.press("Home")
  await expectFocus(page, "Comment")
  await page.keyboard.press("End")
  await expectFocus(page, "Comment")
})

test("Up and Down step a number field in the toolbar", async ({
  page,
  tab,
}) => {
  await walkTo(page, tab, "Font size")
  await page.keyboard.press("ArrowUp")
  await expect(page.getByRole("textbox", { name: "Font size" })).toHaveValue(
    "15"
  )
  await expectFocus(page, "Font size")
})

test("separators run across the toolbar", async ({ page }) => {
  const separators = toolbar(page).getByRole("separator")
  await expect(separators).toHaveCount(2)
  await expect(separators.first()).toHaveAttribute(
    "aria-orientation",
    "vertical"
  )
})

test("a group of buttons is named", async ({ page }) => {
  await expect(
    toolbar(page).getByRole("group", { name: "History" })
  ).toBeVisible()
})

test("a link in the toolbar follows its href with Enter", async ({
  page,
  tab,
}) => {
  await walkTo(page, tab, "Help")
  await page.keyboard.press("Enter")
  await expect(page).toHaveURL(/#help$/)
})

test.describe("vertical", () => {
  test.beforeEach(async ({ open }) => {
    await open("toolbar", { orientation: "vertical" })
  })

  test("ArrowDown and ArrowUp move between items, and Left and Right don't", async ({
    page,
    tab,
  }) => {
    await expect(toolbar(page)).toHaveAttribute("aria-orientation", "vertical")
    await page.getByRole("button", { name: "Before" }).focus()
    await tab()
    await page.keyboard.press("ArrowDown")
    await expectFocus(page, "Italic")
    await page.keyboard.press("ArrowRight")
    await expectFocus(page, "Italic")
    await page.keyboard.press("ArrowUp")
    await expectFocus(page, "Bold")
  })

  test("separators run across a vertical toolbar", async ({ page }) => {
    await expect(toolbar(page).getByRole("separator").first()).toHaveAttribute(
      "aria-orientation",
      "horizontal"
    )
  })
})

test("with loop off, arrows stop at the ends", async ({ page, open, tab }) => {
  await open("toolbar", { loop: "false" })
  await page.getByRole("button", { name: "Before" }).focus()
  await tab()
  await page.keyboard.press("ArrowLeft")
  await expectFocus(page, "Bold")
})

test("a disabled toolbar keeps one tab stop, and every item says it's disabled", async ({
  page,
  open,
  tab,
}) => {
  await open("toolbar", { disabled: "" })
  await page.getByRole("button", { name: "Before" }).focus()
  await tab()
  await expectFocus(page, "Bold")
  await expect(page.getByRole("button", { name: "Bold" })).toHaveAttribute(
    "aria-disabled",
    "true"
  )
  await expect(page.getByRole("button", { name: "Undo" })).toHaveAttribute(
    "aria-disabled",
    "true"
  )
  await expect(page.getByRole("link", { name: "Help" })).toHaveAttribute(
    "aria-disabled",
    "true"
  )
  await page.keyboard.press("Space")
  await page.keyboard.press("ArrowRight")
  await expectFocus(page, "Italic")
  expect(await lastAction(page)).toBe("")
  await tab()
  await expectFocus(page, "After")
})

test.describe("disabled groups", () => {
  test.beforeEach(async ({ open }) => {
    await open("toolbar", { locked: "" })
  })

  test("toggles and toggle groups in a disabled group are disabled", async ({
    page,
  }) => {
    for (const name of ["Bold", "Italic", "Spellcheck", "Undo"]) {
      await expect(page.getByRole("button", { name })).toHaveAttribute(
        "aria-disabled",
        "true"
      )
    }
    await page
      .getByRole("button", { name: "Spellcheck" })
      .click({ force: true })
    await page.getByRole("button", { name: "Italic" }).click({ force: true })
    expect(await lastAction(page)).toBe("")
    await expect(page.getByRole("button", { name: "Italic" })).toHaveAttribute(
      "aria-pressed",
      "false"
    )
  })

  test("a link in a disabled group is disabled, and follows its href once enabled", async ({
    page,
  }) => {
    const help = page.getByRole("link", { name: "Help" })
    await expect(help).toHaveAttribute("aria-disabled", "true")
    await expect(help).toHaveAttribute("data-disabled", "")
    await help.click({ force: true })
    await expect(page).not.toHaveURL(/#help$/)
    await page.getByRole("button", { name: "Unlock" }).click()
    await expect(help).not.toHaveAttribute("aria-disabled", "true")
    await help.click()
    await expect(page).toHaveURL(/#help$/)
  })

  test("enabling a group enables the toggles and buttons in it", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Unlock" }).click()
    for (const name of ["Bold", "Italic", "Spellcheck", "Undo"]) {
      await expect(page.getByRole("button", { name })).not.toHaveAttribute(
        "aria-disabled",
        "true"
      )
    }
    await page.getByRole("button", { name: "Spellcheck" }).click()
    expect(await lastAction(page)).toBe("spellcheck: on")
    await page.getByRole("button", { name: "Italic" }).click()
    expect(await lastAction(page)).toBe("Text style: bold, italic")
    await page.getByRole("button", { name: "Undo" }).click()
    expect(await lastAction(page)).toBe("undo")
  })
})
