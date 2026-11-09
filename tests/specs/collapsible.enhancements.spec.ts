import type { Page } from "@playwright/test"
import { collapsibleFixture as fixture } from "../fixtures/collapsible"
import { expect, test } from "../fixtures"

// Behavior past the WAI-ARIA pattern, tagged `@enhancement`.

const trigger = (page: Page) =>
  page.getByRole("button", { name: fixture.trigger, exact: true })
const content = (page: Page) => page.getByText(fixture.content)
const panel = (page: Page) => page.locator(".collapsible-panel")
const output = (page: Page, name: string) =>
  page.locator(`output[aria-label="${name}"]`)

test.describe("enhancements", { tag: "@enhancement" }, () => {
  test("closing the panel while focus is inside it moves focus to the trigger", async ({
    page,
    open,
  }) => {
    await open("collapsible", { open: "" })
    await page.getByRole("button", { name: fixture.close }).focus()
    await page.keyboard.press("Enter")
    await expect(content(page)).toBeHidden()
    await expect(trigger(page)).toBeFocused()
  })

  test("onOpenChangeComplete runs once the animation has finished", async ({
    page,
    open,
  }) => {
    await open("collapsible", { animate: "slow" })
    await trigger(page).click()
    await expect(
      page.locator(".collapsible-panel[data-starting-style]")
    ).toHaveCount(0)
    await expect(output(page, "Last completed")).toHaveText("")
    await expect(output(page, "Last completed")).toHaveText("open", {
      timeout: 5_000,
    })
    await trigger(page).click()
    await expect(output(page, "Last completed")).toHaveText("closed", {
      timeout: 5_000,
    })
  })

  test("find in page reports its own reason and opens without an animation", async ({
    page,
    open,
  }) => {
    await open("collapsible", { "hidden-until-found": "", animate: "slow" })
    const id = await panel(page).getAttribute("id")
    await page.evaluate((id) => (location.hash = `#${id}`), id)
    await expect(output(page, "Last reason")).toHaveText("find-in-page")
    await expect(output(page, "Last completed")).toHaveText("open")
    expect(
      await panel(page).evaluate((el) =>
        el.style.getPropertyValue("--collapsible-panel-height")
      )
    ).toBe("auto")
  })

  test("a canceled find in page keeps the panel hidden until found", async ({
    page,
    open,
  }) => {
    await open("collapsible", { "hidden-until-found": "", cancel: "open" })
    await panel(page).evaluate((el) => {
      el.dispatchEvent(new Event("beforematch", { bubbles: true }))
      el.removeAttribute("hidden")
    })
    await expect(trigger(page)).toHaveAttribute("aria-expanded", "false")
    await expect(panel(page)).toHaveAttribute("hidden", "until-found")
  })

  test("an infinite exit animation still unmounts the panel", async ({
    page,
    open,
  }) => {
    await open("collapsible", { open: "", animate: "infinite" })
    await trigger(page).click()
    await expect(content(page)).toBeHidden()
    await expect(page.locator(".collapsible-panel:not([hidden])")).toHaveCount(
      0
    )
  })

  test("parts report open and closed through data attributes", async ({
    page,
    open,
  }) => {
    await open("collapsible", { "keep-mounted": "" })
    for (const el of [
      trigger(page),
      panel(page),
      page.locator(".collapsible"),
    ]) {
      await expect(el).toHaveAttribute("data-closed", "")
    }
    await trigger(page).click()
    for (const el of [
      trigger(page),
      panel(page),
      page.locator(".collapsible"),
    ]) {
      await expect(el).toHaveAttribute("data-open", "")
    }
  })
})
