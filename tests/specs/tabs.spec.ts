import {
  coversTab,
  expect,
  lastAction,
  opacityOf,
  panelNamed,
  slowTransitions,
  tabNamed,
  test,
} from "../fixtures"

// Behavior follows the WAI-ARIA tabs pattern:
// https://www.w3.org/WAI/ARIA/apg/patterns/tabs/

test.describe("selection", () => {
  test.beforeEach(async ({ open }) => {
    await open("tabs")
  })

  test("the default tab is selected and shows its panel", async ({ page }) => {
    await expect(tabNamed(page, "Account")).toHaveAttribute("aria-selected", "true")
    for (const name of ["Password", "Billing", "Notifications"])
      await expect(tabNamed(page, name)).toHaveAttribute("aria-selected", "false")
    await expect(panelNamed(page, "Account")).toBeVisible()
    await expect(page.getByRole("tabpanel")).toHaveCount(1)
  })

  test("clicking a tab selects it and shows its panel", async ({ page }) => {
    await tabNamed(page, "Password").click()
    await expect(tabNamed(page, "Password")).toHaveAttribute("aria-selected", "true")
    await expect(tabNamed(page, "Account")).toHaveAttribute("aria-selected", "false")
    await expect(panelNamed(page, "Password")).toBeVisible()
    await expect(panelNamed(page, "Account")).toBeHidden()
    expect(await lastAction(page)).toBe("password")
  })

  test("clicking a disabled tab does nothing", async ({ page }) => {
    await tabNamed(page, "Billing").click({ force: true })
    await expect(tabNamed(page, "Billing")).toHaveAttribute("aria-selected", "false")
    await expect(panelNamed(page, "Account")).toBeVisible()
    expect(await lastAction(page)).toBe("")
  })

  test("clicking the selected tab keeps it selected", async ({ page }) => {
    await tabNamed(page, "Account").click()
    await expect(tabNamed(page, "Account")).toHaveAttribute("aria-selected", "true")
    await expect(panelNamed(page, "Account")).toBeVisible()
  })

  test("a change can be cancelled", async ({ page, open }) => {
    await open("tabs", { cancel: "notifications" })
    await tabNamed(page, "Notifications").click()
    await expect(tabNamed(page, "Notifications")).toHaveAttribute("aria-selected", "false")
    await expect(panelNamed(page, "Account")).toBeVisible()
    await tabNamed(page, "Password").click()
    await expect(panelNamed(page, "Password")).toBeVisible()
  })

  test("without a default value, the first enabled tab is selected", async ({ page, open }) => {
    await open("tabs", { default: "none" })
    await expect(tabNamed(page, "Account")).toHaveAttribute("aria-selected", "true")
    await expect(panelNamed(page, "Account")).toBeVisible()
  })

  test("without a default value, the first render already selects the first enabled tab", async ({
    page,
    open,
  }) => {
    await page.addInitScript(() => {
      const changes: string[] = []
      ;(window as unknown as { __tabChanges: string[] }).__tabChanges = changes
      new MutationObserver((records) => {
        for (const record of records) {
          const el = record.target as Element
          const role = el.getAttribute("role")
          // An attribute set for the first time is the first render's, like a custom element's.
          if (
            record.type === "attributes" &&
            record.oldValue !== null &&
            (role === "tab" || role === "tabpanel")
          )
            changes.push(`${el.textContent?.trim()} ${record.attributeName} was ${record.oldValue}`)
          for (const node of record.addedNodes)
            if (node instanceof Element && node.getAttribute("role") === "tabpanel")
              changes.push(`${node.textContent?.trim()} added`)
        }
      }).observe(document, {
        subtree: true,
        childList: true,
        attributeOldValue: true,
        attributeFilter: ["aria-selected", "hidden"],
      })
    })
    await open("tabs", { default: "none" })
    await expect(panelNamed(page, "Account")).toBeVisible()
    expect(await page.evaluate(() => (window as unknown as { __tabChanges: string[] }).__tabChanges)).toEqual(
      [],
    )
  })
})

test.describe("keyboard navigation", () => {
  test.beforeEach(async ({ open, page, tab }) => {
    await open("tabs")
    await page.getByRole("button", { name: "Before" }).focus()
    await tab()
    await expect(tabNamed(page, "Account")).toBeFocused()
  })

  test("Tab moves focus to the selected tab", async ({ page, tab }) => {
    await tabNamed(page, "Notifications").click()
    await page.getByRole("button", { name: "Before" }).focus()
    await tab()
    await expect(tabNamed(page, "Notifications")).toBeFocused()
  })

  test("ArrowRight and ArrowLeft move focus and select the tab", async ({ page }) => {
    await page.keyboard.press("ArrowRight")
    await expect(tabNamed(page, "Password")).toBeFocused()
    await expect(tabNamed(page, "Password")).toHaveAttribute("aria-selected", "true")
    await expect(panelNamed(page, "Password")).toBeVisible()
    expect(await lastAction(page)).toBe("password")
    await page.keyboard.press("ArrowLeft")
    await expect(tabNamed(page, "Account")).toBeFocused()
    await expect(panelNamed(page, "Account")).toBeVisible()
  })

  test("disabled tabs are focusable but never selected", async ({ page }) => {
    await page.keyboard.press("ArrowRight")
    await expect(tabNamed(page, "Password")).toBeFocused()
    await page.keyboard.press("ArrowRight")
    const billing = tabNamed(page, "Billing")
    await expect(billing).toBeFocused()
    await expect(billing).toHaveAttribute("aria-disabled", "true")
    await expect(billing).toHaveAttribute("aria-selected", "false")
    await expect(panelNamed(page, "Password")).toBeVisible()
  })

  test("focus wraps at both ends", async ({ page }) => {
    await page.keyboard.press("ArrowLeft")
    await expect(tabNamed(page, "Notifications")).toBeFocused()
    await expect(tabNamed(page, "Notifications")).toHaveAttribute("aria-selected", "true")
    await page.keyboard.press("ArrowRight")
    await expect(tabNamed(page, "Account")).toBeFocused()
    await expect(tabNamed(page, "Account")).toHaveAttribute("aria-selected", "true")
  })

  test("Home and End move to the first and last tabs", async ({ page }) => {
    await page.keyboard.press("End")
    await expect(tabNamed(page, "Notifications")).toBeFocused()
    await expect(panelNamed(page, "Notifications")).toBeVisible()
    await page.keyboard.press("Home")
    await expect(tabNamed(page, "Account")).toBeFocused()
    await expect(panelNamed(page, "Account")).toBeVisible()
  })

  test("ArrowUp and ArrowDown do nothing in a horizontal tab list", async ({ page }) => {
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("ArrowUp")
    await expect(tabNamed(page, "Account")).toBeFocused()
    await expect(tabNamed(page, "Account")).toHaveAttribute("aria-selected", "true")
  })

  test("arrow keys with a modifier are left to the browser", async ({ page }) => {
    await page.keyboard.press("Alt+ArrowRight")
    await page.keyboard.press("Shift+ArrowRight")
    await expect(tabNamed(page, "Account")).toBeFocused()
    await expect(tabNamed(page, "Account")).toHaveAttribute("aria-selected", "true")
  })

  test("keys pressed in quick succession are never lost", async ({ page }) => {
    await page.keyboard.press("ArrowRight")
    await page.keyboard.press("ArrowRight")
    await page.keyboard.press("ArrowRight")
    await page.keyboard.press("ArrowLeft")
    await page.keyboard.press("End")
    await expect(tabNamed(page, "Notifications")).toBeFocused()
    await expect(panelNamed(page, "Notifications")).toBeVisible()
  })

  test("Tab moves focus from the tab list into the selected panel", async ({ page, tab }) => {
    await tab()
    await expect(panelNamed(page, "Account")).toBeFocused()
  })

  test("Shift+Tab from the panel returns to the selected tab", async ({ page, tab }) => {
    await tab()
    await expect(panelNamed(page, "Account")).toBeFocused()
    await tab({ shift: true })
    await expect(tabNamed(page, "Account")).toBeFocused()
  })
})

test.describe("manual activation", () => {
  test.beforeEach(async ({ open, page, tab }) => {
    await open("tabs", { activation: "manual" })
    await page.getByRole("button", { name: "Before" }).focus()
    await tab()
    await expect(tabNamed(page, "Account")).toBeFocused()
  })

  test("arrow keys move focus without selecting", async ({ page }) => {
    await page.keyboard.press("ArrowRight")
    await expect(tabNamed(page, "Password")).toBeFocused()
    await expect(tabNamed(page, "Password")).toHaveAttribute("aria-selected", "false")
    await expect(panelNamed(page, "Account")).toBeVisible()
  })

  for (const key of ["Enter", " "]) {
    test(`${key === " " ? "Space" : key} selects the focused tab`, async ({ page }) => {
      await page.keyboard.press("ArrowRight")
      await expect(tabNamed(page, "Password")).toBeFocused()
      await page.keyboard.press(key)
      await expect(tabNamed(page, "Password")).toHaveAttribute("aria-selected", "true")
      await expect(panelNamed(page, "Password")).toBeVisible()
      expect(await lastAction(page)).toBe("password")
    })
  }

  test("Enter on a disabled tab does nothing", async ({ page }) => {
    await page.keyboard.press("ArrowRight")
    await page.keyboard.press("ArrowRight")
    await expect(tabNamed(page, "Billing")).toBeFocused()
    await page.keyboard.press("Enter")
    await expect(tabNamed(page, "Billing")).toHaveAttribute("aria-selected", "false")
    await expect(panelNamed(page, "Account")).toBeVisible()
  })
})

test.describe("vertical", () => {
  test.beforeEach(async ({ open, page, tab }) => {
    await open("tabs", { orientation: "vertical" })
    await page.getByRole("button", { name: "Before" }).focus()
    await tab()
    await expect(tabNamed(page, "Account")).toBeFocused()
  })

  test("the tab list reports its orientation", async ({ page }) => {
    await expect(page.getByRole("tablist")).toHaveAttribute("aria-orientation", "vertical")
  })

  test("ArrowDown and ArrowUp move between tabs", async ({ page }) => {
    await page.keyboard.press("ArrowDown")
    await expect(tabNamed(page, "Password")).toBeFocused()
    await expect(panelNamed(page, "Password")).toBeVisible()
    await page.keyboard.press("ArrowUp")
    await expect(tabNamed(page, "Account")).toBeFocused()
    await expect(panelNamed(page, "Account")).toBeVisible()
  })

  test("ArrowLeft and ArrowRight do nothing in a vertical tab list", async ({ page }) => {
    await page.keyboard.press("ArrowRight")
    await page.keyboard.press("ArrowLeft")
    await expect(tabNamed(page, "Account")).toBeFocused()
    await expect(tabNamed(page, "Account")).toHaveAttribute("aria-selected", "true")
  })
})

test.describe("panels", () => {
  test.beforeEach(async ({ open }) => {
    await open("tabs")
  })

  test("the selected tab controls its panel, and the panel is labelled by its tab", async ({ page }) => {
    const tab = tabNamed(page, "Account")
    const panel = panelNamed(page, "Account")
    const tabId = await tab.getAttribute("id")
    const panelId = await panel.getAttribute("id")
    expect(tabId).toBeTruthy()
    expect(panelId).toBeTruthy()
    await expect(tab).toHaveAttribute("aria-controls", panelId!)
    await expect(panel).toHaveAttribute("aria-labelledby", tabId!)
  })

  test("with keepMounted, hidden panels stay in the page", async ({ page, open }) => {
    await open("tabs", { "keep-mounted": "" })
    await expect(page.locator('[role="tabpanel"]')).toHaveCount(4)
    await expect(page.getByRole("tabpanel")).toHaveCount(1)
    await tabNamed(page, "Notifications").click()
    await expect(panelNamed(page, "Notifications")).toBeVisible()
    await expect(page.getByRole("tabpanel")).toHaveCount(1)
    // Every tab controls its own panel, mounted or not.
    for (const name of ["Account", "Password", "Billing", "Notifications"]) {
      const tab = tabNamed(page, name)
      const controls = await tab.getAttribute("aria-controls")
      expect(controls, name).toBeTruthy()
      const panel = page.locator(`[id="${controls}"]`)
      await expect(panel).toHaveAttribute("role", "tabpanel")
      await expect(panel).toHaveAttribute("aria-labelledby", (await tab.getAttribute("id"))!)
    }
  })

  test("with keepMounted, a class that sets display doesn't show hidden panels", async ({ page, open }) => {
    await open("tabs", { "keep-mounted": "" })
    await page.addStyleTag({ content: ".panel { display: flex }" })
    const displays = () =>
      page.locator(".panel").evaluateAll((panels) => panels.map((el) => getComputedStyle(el).display))
    await expect.poll(displays).toEqual(["flex", "none", "none", "none"])
    await tabNamed(page, "Notifications").click()
    await expect.poll(displays).toEqual(["none", "none", "none", "flex"])
  })
})

test.describe("indicator", () => {
  test("the indicator covers the selected tab", async ({ page, open }) => {
    await open("tabs")
    await expect.poll(() => coversTab(page, "Account")).toBe(true)
  })

  test("the indicator follows the selection", async ({ page, open }) => {
    await open("tabs")
    await tabNamed(page, "Notifications").click()
    await expect.poll(() => coversTab(page, "Notifications")).toBe(true)
  })

  test("the indicator follows the selected tab when it resizes", async ({ page, open }) => {
    await open("tabs")
    await expect.poll(() => coversTab(page, "Account")).toBe(true)
    await tabNamed(page, "Account").evaluate((el) => ((el as HTMLElement).style.paddingInline = "40px"))
    await expect.poll(() => coversTab(page, "Account")).toBe(true)
  })

  test("the indicator covers the selected tab in a vertical list", async ({ page, open }) => {
    await open("tabs", { orientation: "vertical" })
    await tabNamed(page, "Notifications").click()
    await expect.poll(() => coversTab(page, "Notifications")).toBe(true)
  })
})

test.describe("activation direction", () => {
  test("parts report which way the selection moved", async ({ page, open }) => {
    await open("tabs")
    const list = page.getByRole("tablist")
    await tabNamed(page, "Notifications").click()
    await expect(list).toHaveAttribute("data-activation-direction", "right")
    await expect(panelNamed(page, "Notifications")).toHaveAttribute("data-activation-direction", "right")
    await tabNamed(page, "Password").click()
    await expect(list).toHaveAttribute("data-activation-direction", "left")
  })

  test("vertical lists report up and down", async ({ page, open }) => {
    await open("tabs", { orientation: "vertical" })
    const list = page.getByRole("tablist")
    await tabNamed(page, "Password").click()
    await expect(list).toHaveAttribute("data-activation-direction", "down")
    await tabNamed(page, "Account").click()
    await expect(list).toHaveAttribute("data-activation-direction", "up")
  })
})

test.describe("animation", () => {
  test("the next panel animates in from its starting style", async ({ page, open }) => {
    await open("tabs", { animate: "" })
    await slowTransitions(page)
    await expect(panelNamed(page, "Account")).toBeVisible()
    await tabNamed(page, "Password").click()
    await expect(panelNamed(page, "Password")).toBeVisible()
    expect(await opacityOf(panelNamed(page, "Password"))).toBeLessThan(0.5)
  })

  test("the previous panel stays mounted while it animates out", async ({ page, open }) => {
    await open("tabs", { animate: "" })
    await expect(panelNamed(page, "Account")).toBeVisible()
    await tabNamed(page, "Password").click()
    await expect(page.locator('[role="tabpanel"][data-ending-style]')).toHaveCount(1)
    await expect(panelNamed(page, "Password")).toBeVisible()
    await expect(page.getByRole("tabpanel")).toHaveCount(1)
    await expect(panelNamed(page, "Account")).toBeHidden()
  })

  test("exit keyframes keyed on the selected state play on the previous panel", async ({ page, open }) => {
    await open("tabs")
    await page.addStyleTag({
      content:
        '@keyframes exit { to { opacity: 0 } } [role="tabpanel"]:not([data-selected]) { animation: exit 3s }',
    })
    await expect(panelNamed(page, "Account")).toBeVisible()
    await tabNamed(page, "Password").click()
    const exiting = page.locator('[role="tabpanel"]:not([data-selected])[data-ending-style]')
    await expect(exiting).toHaveCount(1)
    expect(
      await exiting.evaluate((el) =>
        el.getAnimations().some((animation) => (animation as CSSAnimation).animationName === "exit"),
      ),
    ).toBe(true)
  })

  test("switching tabs quickly while panels animate leaves one panel", async ({ page, open }) => {
    await open("tabs", { animate: "" })
    await tabNamed(page, "Password").click()
    await tabNamed(page, "Notifications").click()
    await tabNamed(page, "Account").click()
    await expect(panelNamed(page, "Account")).toBeVisible()
    await expect(page.locator('[role="tabpanel"]:not([hidden])')).toHaveCount(1)
  })
})
