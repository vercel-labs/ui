import { expect, lastAction, panelOf, regionNamed, test, triggerNamed } from "../fixtures"

// Behavior follows the WAI-ARIA accordion pattern:
// https://www.w3.org/WAI/ARIA/apg/patterns/accordion/

const names = ["Shipping", "Returns", "Warranty", "Support"]

test.describe("expanding and collapsing", () => {
  test.beforeEach(async ({ open }) => {
    await open("accordion")
  })

  test("the default item is expanded and shows its panel", async ({ page }) => {
    await expect(triggerNamed(page, "Shipping")).toHaveAttribute("aria-expanded", "true")
    for (const name of ["Returns", "Warranty", "Support"])
      await expect(triggerNamed(page, name)).toHaveAttribute("aria-expanded", "false")
    await expect(regionNamed(page, "Shipping")).toBeVisible()
    await expect(page.getByRole("region")).toHaveCount(1)
  })

  test("clicking a collapsed trigger expands it and collapses the open one", async ({ page }) => {
    await triggerNamed(page, "Returns").click()
    await expect(triggerNamed(page, "Returns")).toHaveAttribute("aria-expanded", "true")
    await expect(triggerNamed(page, "Shipping")).toHaveAttribute("aria-expanded", "false")
    await expect(regionNamed(page, "Returns")).toBeVisible()
    await expect(page.getByRole("region")).toHaveCount(1)
    expect(await lastAction(page)).toBe("returns")
  })

  test("clicking an expanded trigger collapses it", async ({ page }) => {
    await triggerNamed(page, "Shipping").click()
    await expect(triggerNamed(page, "Shipping")).toHaveAttribute("aria-expanded", "false")
    await expect(page.getByRole("region")).toHaveCount(0)
    expect(await lastAction(page)).toBe("none")
  })

  test("clicking a disabled trigger does nothing", async ({ page }) => {
    await triggerNamed(page, "Warranty").click({ force: true })
    await expect(triggerNamed(page, "Warranty")).toHaveAttribute("aria-expanded", "false")
    await expect(regionNamed(page, "Shipping")).toBeVisible()
    expect(await lastAction(page)).toBe("")
  })

  test("a change can be canceled", async ({ page, open }) => {
    await open("accordion", { cancel: "returns" })
    await triggerNamed(page, "Returns").click()
    await expect(triggerNamed(page, "Returns")).toHaveAttribute("aria-expanded", "false")
    await expect(regionNamed(page, "Shipping")).toBeVisible()
    await triggerNamed(page, "Support").click()
    await expect(regionNamed(page, "Support")).toBeVisible()
  })

  test("without a default value, every item starts collapsed", async ({ page, open }) => {
    await open("accordion", { default: "none" })
    for (const name of names) await expect(triggerNamed(page, name)).toHaveAttribute("aria-expanded", "false")
    await expect(page.getByRole("region")).toHaveCount(0)
  })

  test("a default value can expand several items", async ({ page, open }) => {
    await open("accordion", { multiple: "", default: "shipping,support" })
    await expect(regionNamed(page, "Shipping")).toBeVisible()
    await expect(regionNamed(page, "Support")).toBeVisible()
    await expect(page.getByRole("region")).toHaveCount(2)
  })
})

test.describe("multiple", () => {
  test.beforeEach(async ({ open }) => {
    await open("accordion", { multiple: "" })
  })

  test("items expand and collapse independently", async ({ page }) => {
    await triggerNamed(page, "Returns").click()
    await expect(triggerNamed(page, "Shipping")).toHaveAttribute("aria-expanded", "true")
    await expect(triggerNamed(page, "Returns")).toHaveAttribute("aria-expanded", "true")
    await expect(page.getByRole("region")).toHaveCount(2)
    expect(await lastAction(page)).toBe("shipping,returns")
    await triggerNamed(page, "Shipping").click()
    await expect(triggerNamed(page, "Shipping")).toHaveAttribute("aria-expanded", "false")
    await expect(regionNamed(page, "Returns")).toBeVisible()
    expect(await lastAction(page)).toBe("returns")
  })

  test("every item can be expanded at once", async ({ page }) => {
    await triggerNamed(page, "Returns").click()
    await triggerNamed(page, "Support").click()
    await expect(page.getByRole("region")).toHaveCount(3)
  })
})

test.describe("disabled", () => {
  test("a disabled item's trigger is marked disabled and stays focusable", async ({ page, open }) => {
    await open("accordion")
    const warranty = triggerNamed(page, "Warranty")
    await expect(warranty).toHaveAttribute("aria-disabled", "true")
    await expect(warranty).toHaveAttribute("data-disabled", "")
    await warranty.focus()
    await expect(warranty).toBeFocused()
  })

  test("a disabled accordion disables every trigger", async ({ page, open }) => {
    await open("accordion", { disabled: "" })
    for (const name of names) await expect(triggerNamed(page, name)).toHaveAttribute("aria-disabled", "true")
    await triggerNamed(page, "Returns").click({ force: true })
    await expect(triggerNamed(page, "Returns")).toHaveAttribute("aria-expanded", "false")
    await expect(regionNamed(page, "Shipping")).toBeVisible()
  })
})

test.describe("keyboard", () => {
  test.beforeEach(async ({ open }) => {
    await open("accordion")
  })

  test("Tab moves through every trigger in order, disabled ones included", async ({ page, tab }) => {
    await page.getByRole("button", { name: "Before" }).focus()
    for (const name of names) {
      await tab()
      await expect(triggerNamed(page, name)).toBeFocused()
    }
    await tab()
    await expect(page.getByRole("button", { name: "After" })).toBeFocused()
  })

  for (const key of ["Enter", " "]) {
    test(`${key === " " ? "Space" : key} toggles the focused trigger's panel`, async ({ page }) => {
      const returns = triggerNamed(page, "Returns")
      await returns.focus()
      await page.keyboard.press(key)
      await expect(returns).toHaveAttribute("aria-expanded", "true")
      await expect(regionNamed(page, "Returns")).toBeVisible()
      expect(await lastAction(page)).toBe("returns")
      await page.keyboard.press(key)
      await expect(returns).toHaveAttribute("aria-expanded", "false")
      await expect(returns).toBeFocused()
      expect(await lastAction(page)).toBe("none")
    })
  }

  test("Enter on a disabled trigger does nothing", async ({ page }) => {
    await triggerNamed(page, "Warranty").focus()
    await page.keyboard.press("Enter")
    await expect(triggerNamed(page, "Warranty")).toHaveAttribute("aria-expanded", "false")
    await expect(regionNamed(page, "Shipping")).toBeVisible()
  })

  test("Tab moves from an expanded trigger into its panel", async ({ page, tab }) => {
    await triggerNamed(page, "Returns").click()
    await triggerNamed(page, "Returns").focus()
    await tab()
    await expect(page.getByRole("textbox", { name: "Order number" })).toBeFocused()
    await tab()
    await expect(triggerNamed(page, "Warranty")).toBeFocused()
  })

  test("keys pressed in quick succession are never lost", async ({ page, open }) => {
    await triggerNamed(page, "Returns").focus()
    await page.keyboard.press("Enter")
    await page.keyboard.press("Enter")
    await page.keyboard.press(" ")
    await expect(triggerNamed(page, "Returns")).toHaveAttribute("aria-expanded", "true")
    await expect(regionNamed(page, "Returns")).toBeVisible()
  })

  test("arrow keys leave focus where it is", async ({ page }) => {
    await triggerNamed(page, "Returns").focus()
    for (const key of ["ArrowDown", "ArrowUp", "Home", "End"]) {
      await page.keyboard.press(key)
      await expect(triggerNamed(page, "Returns")).toBeFocused()
    }
  })
})

test.describe("structure", () => {
  test.beforeEach(async ({ open }) => {
    await open("accordion")
  })

  test("each trigger sits in a heading", async ({ page }) => {
    for (const name of names) {
      const heading = page.getByRole("heading", { name, level: 3 })
      await expect(heading).toBeVisible()
      await expect(heading.getByRole("button", { name })).toBeVisible()
    }
  })

  test("the trigger controls its panel, and the panel is labelled by its trigger", async ({ page }) => {
    const trigger = triggerNamed(page, "Shipping")
    const panel = regionNamed(page, "Shipping")
    const triggerId = await trigger.getAttribute("id")
    const panelId = await panel.getAttribute("id")
    expect(triggerId).toBeTruthy()
    expect(panelId).toBeTruthy()
    await expect(trigger).toHaveAttribute("aria-controls", panelId!)
    await expect(panel).toHaveAttribute("aria-labelledby", triggerId!)
  })
})

test.describe("mounting", () => {
  test("collapsed panels leave the page by default", async ({ page, open }) => {
    await open("accordion")
    await expect(page.getByRole("region")).toHaveCount(1)
    await triggerNamed(page, "Returns").click()
    await expect(page.getByRole("region")).toHaveCount(1)
    await expect(regionNamed(page, "Returns")).toBeVisible()
  })

  test("with keepMounted, collapsed panels stay in the page, hidden", async ({ page, open }) => {
    await open("accordion", { "keep-mounted": "" })
    await expect(page.locator('[role="region"]')).toHaveCount(4)
    await expect(page.getByRole("region")).toHaveCount(1)
    await expect(await panelOf(page, "Returns")).toBeHidden()
    await triggerNamed(page, "Returns").click()
    await expect(regionNamed(page, "Returns")).toBeVisible()
    await expect(await panelOf(page, "Shipping")).toBeHidden()
  })

  test("with keepMounted, a class that sets display doesn't show collapsed panels", async ({
    page,
    open,
  }) => {
    await open("accordion", { "keep-mounted": "" })
    await page.addStyleTag({ content: ".accordion-panel { display: flex }" })
    await expect(await panelOf(page, "Returns")).toHaveCSS("display", "none")
    await triggerNamed(page, "Returns").click()
    await expect(regionNamed(page, "Returns")).toHaveCSS("display", "flex")
    await expect(await panelOf(page, "Warranty")).toHaveCSS("display", "none")
  })

  test("with hiddenUntilFound, collapsed panels stay findable", async ({ page, open }) => {
    await open("accordion", { "hidden-until-found": "" })
    await expect(page.locator('[role="region"]')).toHaveCount(4)
    for (const name of ["Returns", "Warranty", "Support"])
      await expect(await panelOf(page, name)).toHaveAttribute("hidden", "until-found")
    await expect(regionNamed(page, "Shipping")).toBeVisible()
  })

  test("finding text in a collapsed panel expands it", async ({ page, open }) => {
    await open("accordion", { "hidden-until-found": "" })
    const panel = await panelOf(page, "Returns")
    await expect(panel).toHaveAttribute("hidden", "until-found")
    // What the browser does when find in page matches hidden text.
    await panel.evaluate((el) => {
      el.dispatchEvent(new Event("beforematch", { bubbles: true }))
      el.removeAttribute("hidden")
    })
    await expect(triggerNamed(page, "Returns")).toHaveAttribute("aria-expanded", "true")
    await expect(regionNamed(page, "Returns")).toBeVisible()
    expect(await lastAction(page)).toBe("returns")
  })

  test("following a link into a collapsed panel expands it", async ({ page, open }) => {
    await open("accordion", { "hidden-until-found": "" })
    const id = await (await panelOf(page, "Returns")).getAttribute("id")
    // The browser reveals hidden-until-found targets of a fragment itself.
    await page.evaluate((id) => (location.hash = `#${id}`), id)
    await expect(triggerNamed(page, "Returns")).toHaveAttribute("aria-expanded", "true")
    await expect(regionNamed(page, "Returns")).toBeVisible()
    expect(await lastAction(page)).toBe("returns")
  })

  test("the browser's own find expands a collapsed panel", async ({ page, open, browserName }) => {
    test.skip(browserName !== "firefox", "Only Firefox reveals hidden-until-found matches for window.find().")
    await open("accordion", { "hidden-until-found": "" })
    expect(
      await page.evaluate(() =>
        (window as unknown as { find: (text: string) => boolean }).find("thirty days"),
      ),
    ).toBe(true)
    await expect(triggerNamed(page, "Returns")).toHaveAttribute("aria-expanded", "true")
    await expect(regionNamed(page, "Returns")).toBeVisible()
  })
})

test.describe("animation", () => {
  test("an opening panel animates its height from zero to its content", async ({ page, open }) => {
    await open("accordion", { animate: "slow" })
    // Records the height variable and the panel's height every time the variable changes.
    await page.evaluate(() => {
      const log: { value: string; height: number }[] = []
      ;(window as unknown as { heights: typeof log }).heights = log
      new MutationObserver(() => {
        const panel = document.querySelector<HTMLElement>('[role="region"][aria-labelledby]:not([hidden])')
        if (!panel) return
        const value = panel.style.getPropertyValue("--accordion-panel-height")
        if (log.at(-1)?.value !== value) log.push({ value, height: panel.getBoundingClientRect().height })
      }).observe(document.body, { subtree: true, attributes: true, attributeFilter: ["style"] })
    })
    await triggerNamed(page, "Shipping").click()
    await expect(page.getByRole("region")).toHaveCount(0)
    await triggerNamed(page, "Returns").click()
    const panel = regionNamed(page, "Returns")
    await expect
      .poll(() => panel.evaluate((el) => el.style.getPropertyValue("--accordion-panel-height")), {
        timeout: 10_000,
      })
      .toBe("auto")
    const full = await panel.evaluate((el) => el.scrollHeight)
    expect(Math.round(await panel.evaluate((el) => el.getBoundingClientRect().height))).toBe(full)
    const log = await page.evaluate(
      () => (window as unknown as { heights: { value: string; height: number }[] }).heights,
    )
    const measured = log.find((entry) => entry.value === `${full}px`)
    expect(measured, JSON.stringify(log)).toBeTruthy()
    expect(measured!.height).toBeLessThan(full)
  })

  test("a collapsing panel stays mounted while it animates out", async ({ page, open }) => {
    await open("accordion", { animate: "" })
    await triggerNamed(page, "Shipping").click()
    await expect(page.locator('[role="region"][data-ending-style]')).toHaveCount(1)
    await expect(page.getByRole("region")).toHaveCount(0)
  })

  test("an initially open panel does not animate", async ({ page, open }) => {
    await open("accordion", { animate: "slow" })
    const panel = regionNamed(page, "Shipping")
    await expect(panel).toBeVisible()
    expect(await panel.getAttribute("data-starting-style")).toBeNull()
    const [height, full] = await panel.evaluate((el) => [el.getBoundingClientRect().height, el.scrollHeight])
    expect(Math.round(height)).toBe(full)
  })

  test("content that grows while open is shown in full", async ({ page, open }) => {
    await open("accordion")
    const panel = regionNamed(page, "Shipping")
    const before = await panel.evaluate((el) => el.getBoundingClientRect().height)
    await panel.evaluate((el) => {
      const line = document.createElement("div")
      line.textContent = "Another line"
      el.append(line)
    })
    const [height, full] = await panel.evaluate((el) => [el.getBoundingClientRect().height, el.scrollHeight])
    expect(height).toBeGreaterThan(before)
    expect(Math.round(height)).toBe(full)
  })

  test("with reduced motion, a panel opens at once", async ({ page, open }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    await open("accordion", { animate: "slow" })
    await triggerNamed(page, "Returns").click()
    await expect(regionNamed(page, "Returns")).toBeVisible()
    await expect
      .poll(
        () =>
          regionNamed(page, "Returns").evaluate((el) =>
            el.style.getPropertyValue("--accordion-panel-height"),
          ),
        {
          timeout: 500,
        },
      )
      .toBe("auto")
  })

  test("switching items quickly while panels animate leaves one panel", async ({ page, open }) => {
    await open("accordion", { animate: "" })
    await triggerNamed(page, "Returns").click()
    await triggerNamed(page, "Support").click()
    await triggerNamed(page, "Shipping").click()
    await expect(triggerNamed(page, "Shipping")).toHaveAttribute("aria-expanded", "true")
    await expect(page.getByRole("region")).toHaveCount(1)
    await expect(regionNamed(page, "Shipping")).toBeVisible()
  })
})
