import {
  expect,
  lastAction,
  panelOf,
  regionNamed,
  test,
  triggerNamed,
} from "../fixtures"

// Behavior past the WAI-ARIA pattern, tagged `@enhancement`.

test.describe("enhancements", { tag: "@enhancement" }, () => {
  test("with collapsible off, the open trigger is marked disabled and stays open", async ({
    page,
    open,
  }) => {
    await open("accordion", { collapsible: "false" })
    const shipping = triggerNamed(page, "Shipping")
    await expect(shipping).toHaveAttribute("aria-disabled", "true")
    await shipping.click({ force: true })
    await expect(shipping).toHaveAttribute("aria-expanded", "true")
    await expect(regionNamed(page, "Shipping")).toBeVisible()
    await triggerNamed(page, "Returns").click()
    await expect(shipping).not.toHaveAttribute("aria-disabled", "true")
    await expect(triggerNamed(page, "Returns")).toHaveAttribute(
      "aria-disabled",
      "true"
    )
    await expect(regionNamed(page, "Returns")).toBeVisible()
  })

  test("closing a panel that holds focus moves focus to its trigger", async ({
    page,
    open,
  }) => {
    await open("accordion", { default: "support" })
    await page.getByRole("button", { name: "Done" }).focus()
    await page.keyboard.press("Enter")
    await expect(triggerNamed(page, "Support")).toHaveAttribute(
      "aria-expanded",
      "false"
    )
    await expect(triggerNamed(page, "Support")).toBeFocused()
    expect(await lastAction(page)).toBe("none")
  })

  test("a canceled find in page keeps the panel hidden until found", async ({
    page,
    open,
  }) => {
    await open("accordion", { "hidden-until-found": "", cancel: "returns" })
    const panel = await panelOf(page, "Returns")
    await panel.evaluate((el) => {
      el.dispatchEvent(new Event("beforematch", { bubbles: true }))
      el.removeAttribute("hidden")
    })
    await expect(triggerNamed(page, "Returns")).toHaveAttribute(
      "aria-expanded",
      "false"
    )
    await expect(panel).toHaveAttribute("hidden", "until-found")
  })

  test("an infinite exit animation still unmounts the panel", async ({
    page,
    open,
  }) => {
    await open("accordion", { animate: "infinite" })
    await triggerNamed(page, "Shipping").click()
    await expect(page.getByRole("region")).toHaveCount(0)
    await expect(page.locator('[role="region"]:not([hidden])')).toHaveCount(0)
  })

  test("a controller expands and collapses items from anywhere", async ({
    page,
    open,
  }) => {
    await open("accordion")
    await page.getByRole("button", { name: "Show support" }).click()
    await expect(triggerNamed(page, "Support")).toHaveAttribute(
      "aria-expanded",
      "true"
    )
    await expect(regionNamed(page, "Support")).toBeVisible()
    expect(await lastAction(page)).toBe("support")
  })

  test("an item's onOpenChangeComplete runs once its panel has finished animating", async ({
    page,
    open,
  }) => {
    await open("accordion", { animate: "slow" })
    const completed = page.locator('output[aria-label="Last completed"]')
    await triggerNamed(page, "Returns").click()
    await expect(completed).toHaveText("")
    await expect(completed).toHaveText(/returns open|shipping closed/, {
      timeout: 5_000,
    })
    await expect
      .poll(() =>
        regionNamed(page, "Returns").evaluate((el) =>
          el.style.getPropertyValue("--accordion-panel-height")
        )
      )
      .toBe("auto")
    await triggerNamed(page, "Returns").click()
    await expect(completed).toHaveText("returns closed", { timeout: 5_000 })
  })

  test("find in page opens a panel at once, without an animation", async ({
    page,
    open,
  }) => {
    await open("accordion", { "hidden-until-found": "", animate: "slow" })
    const id = await (await panelOf(page, "Returns")).getAttribute("id")
    await page.evaluate((id) => (location.hash = `#${id}`), id)
    await expect(regionNamed(page, "Returns")).toBeVisible()
    expect(
      await regionNamed(page, "Returns").evaluate((el) =>
        el.style.getPropertyValue("--accordion-panel-height")
      )
    ).toBe("auto")
    await expect(
      page.locator('output[aria-label="Last completed"]')
    ).toHaveText(/returns open|shipping closed/)
  })
})
