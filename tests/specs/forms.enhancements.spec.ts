import { expect, test } from "../fixtures"
import { checkbox, email, radio, save, switchNamed } from "./forms.helpers"

// Behavior past the WAI-ARIA pattern, tagged `@enhancement`.

test.describe("enhancements", { tag: "@enhancement" }, () => {
  test("the first invalid control takes focus in document order", async ({
    page,
    open,
  }) => {
    await open("forms")
    await checkbox(page, "Accept the terms").click()
    await save(page)
    await expect(
      page.getByRole("radiogroup", { name: "Plan" }).getByRole("radio").first()
    ).toBeFocused()
    await radio(page, "Pro").click()
    await save(page)
    await expect(email(page)).toBeFocused()
  })

  test("a later required field without an error part doesn't take focus from the first", async ({
    page,
    open,
  }) => {
    await open("forms", { nickname: "" })
    await checkbox(page, "Accept the terms").click()
    await radio(page, "Pro").click()
    await save(page)
    await expect(email(page)).toBeFocused()
    await expect(
      page.getByRole("textbox", { name: "Nickname" })
    ).not.toBeFocused()
  })
})

// Custom elements are form-associated: the element itself is the form control.
test.describe(
  "form-associated custom elements",
  { tag: "@enhancement" },
  () => {
    test.beforeEach(({ framework }) => {
      test.skip(!framework.startsWith("web"), "Custom elements only.")
    })

    test("take part in the form with no hidden input", async ({
      page,
      open,
    }) => {
      await open("forms")
      const names = await page.evaluate(() =>
        Array.from(document.querySelector("form")!.elements)
          .filter((el) => el.localName.startsWith("ui-"))
          .map((el) => el.localName)
      )
      expect(names).toContain("ui-checkbox")
      expect(names).toContain("ui-radio-group")
      expect(names).toContain("ui-checkbox-group")
      expect(
        await page
          .locator("ui-checkbox input, ui-switch input, ui-radio-group input")
          .count()
      ).toBe(0)
    })

    test("report validity like native controls", async ({ page, open }) => {
      await open("forms")
      const terms = page.locator("ui-checkbox[name=terms]")
      expect(
        await terms.evaluate((el: any) => [
          el.willValidate,
          el.validity.valueMissing,
          el.checkValidity(),
        ])
      ).toEqual([true, true, false])
      expect(await terms.evaluate((el) => el.matches(":invalid"))).toBe(true)
      await checkbox(page, "Accept the terms").click()
      expect(await terms.evaluate((el: any) => el.checkValidity())).toBe(true)
      await terms.evaluate((el: any) => el.setCustomValidity("Not today."))
      expect(
        await terms.evaluate((el: any) => [
          el.validity.customError,
          el.validationMessage,
        ])
      ).toEqual([true, "Not today."])
    })

    test("have live checked and value properties", async ({ page, open }) => {
      await open("forms")
      await page
        .locator("ui-switch[name=airplane]")
        .evaluate((el: any) => (el.checked = true))
      await expect(switchNamed(page, "Airplane mode")).toBeChecked()
      await page
        .locator("ui-radio-group")
        .evaluate((el: any) => (el.value = "enterprise"))
      await expect(radio(page, "Enterprise")).toBeChecked()
      expect(
        await page.locator("ui-checkbox-group").evaluate((el: any) => el.value)
      ).toEqual(["cheese"])
    })

    test("are named by their labels", async ({ page, open }) => {
      await open("forms")
      await expect(
        page.locator("ui-checkbox[value=weekly]")
      ).toHaveAccessibleName("Newsletter")
      await expect(page.locator("ui-radio[value=pro]")).toHaveAccessibleName(
        "Pro"
      )
    })
  }
)
