import { expect, lastAction, menuNamed, test, waitForStill } from "../fixtures"

// Behavior past the menu button pattern, tagged `@enhancement`. Untagged tests
// here are pattern behavior every menu must have.

test.describe("pattern details", () => {
  test.beforeEach(async ({ open }) => {
    await open("menu")
  })

  test("Escape in a submenu closes only the submenu", async ({ page }) => {
    await page.getByRole("button", { name: "File" }).focus()
    await page.keyboard.press("Enter")
    await page.keyboard.type("sha")
    await page.keyboard.press("ArrowRight")
    await expect(page.getByRole("menuitem", { name: "Email" })).toBeFocused()
    await page.keyboard.press("Escape")
    await expect(menuNamed(page, "Share")).toBeHidden()
    await expect(menuNamed(page, "File")).toBeVisible()
    await expect(page.getByRole("menuitem", { name: "Share" })).toBeFocused()
  })

  test("Tab moves focus to the element after the trigger", async ({
    page,
    tab,
  }) => {
    await page.getByRole("button", { name: "File" }).focus()
    await page.keyboard.press("Enter")
    await expect(page.getByRole("menuitem", { name: "New file" })).toBeFocused()
    await tab()
    await expect(page.getByRole("button", { name: "After" })).toBeFocused()
  })

  test(
    "Shift+Tab moves focus to the element before the trigger",
    { tag: "@enhancement" },
    async ({ page, tab }) => {
      await page.getByRole("button", { name: "File" }).focus()
      await page.keyboard.press("Enter")
      await expect(
        page.getByRole("menuitem", { name: "New file" })
      ).toBeFocused()
      await tab({ shift: true })
      await expect(page.getByRole("button", { name: "Before" })).toBeFocused()
    }
  )
})

test.describe("enhancements", { tag: "@enhancement" }, () => {
  test("an outside press only closes the menu by default", async ({
    page,
    open,
  }) => {
    await open("menu")
    await page.getByRole("button", { name: "File" }).click()
    await page.getByRole("button", { name: "After" }).click()
    await expect(menuNamed(page, "File")).toBeHidden()
    await expect(page.getByRole("button", { name: "After" })).not.toBeFocused()
  })

  test("with modal false, an outside press reaches what it hits", async ({
    page,
    open,
    browserName,
  }) => {
    await open("menu", { modal: "false" })
    const after = page.getByRole("button", { name: "After" })
    await after.evaluate((el) =>
      el.addEventListener("click", () => (el.dataset.clicked = ""))
    )
    await page.getByRole("button", { name: "File" }).click()
    await after.click()
    await expect(menuNamed(page, "File")).toBeHidden()
    await expect(after).toHaveAttribute("data-clicked")
    // Safari doesn't focus buttons on click.
    if (browserName !== "webkit") {
      await expect(after).toBeFocused()
    }
  })

  test("with modal true, the page scroll is locked and restored exactly", async ({
    page,
    open,
  }) => {
    await open("menu", { modal: "true" })
    const before = await page.evaluate(
      () => document.documentElement.style.cssText
    )
    await page.getByRole("button", { name: "File" }).click()
    await expect(menuNamed(page, "File")).toBeVisible()
    expect(
      await page.evaluate(() => document.documentElement.style.overflow)
    ).toBe("hidden")
    expect(
      await page
        .getByRole("button", { name: "Before" })
        .evaluate((el) => (el as HTMLElement).inert)
    ).toBe(true)
    await page.keyboard.press("Escape")
    await expect(menuNamed(page, "File")).toBeHidden()
    expect(
      await page.evaluate(() => document.documentElement.style.cssText)
    ).toBe(before)
    expect(
      await page
        .getByRole("button", { name: "Before" })
        .evaluate((el) => (el as HTMLElement).inert)
    ).toBe(false)
  })

  test("press, drag and release on an item selects it", async ({
    page,
    open,
  }) => {
    await open("menu")
    const trigger = (await page
      .getByRole("button", { name: "File" })
      .boundingBox())!
    await page.mouse.move(
      trigger.x + trigger.width / 2,
      trigger.y + trigger.height / 2
    )
    await page.mouse.down()
    const item = (await page
      .getByRole("menuitem", { name: "Delete" })
      .boundingBox())!
    await page.mouse.move(item.x + 20, item.y + item.height / 2, { steps: 6 })
    await page.waitForTimeout(250)
    await page.mouse.up()
    expect(await lastAction(page)).toBe("delete")
    await expect(menuNamed(page, "File")).toBeHidden()
  })

  test("Enter on the trigger opens the menu after a drag selected an item", async ({
    page,
    open,
  }) => {
    await open("menu")
    const trigger = (await page
      .getByRole("button", { name: "File" })
      .boundingBox())!
    await page.mouse.move(
      trigger.x + trigger.width / 2,
      trigger.y + trigger.height / 2
    )
    await page.mouse.down()
    const item = (await page
      .getByRole("menuitem", { name: "Delete" })
      .boundingBox())!
    await page.mouse.move(item.x + 20, item.y + item.height / 2, { steps: 6 })
    await page.waitForTimeout(250)
    await page.mouse.up()
    await expect(menuNamed(page, "File")).toBeHidden()
    await page.getByRole("button", { name: "File" }).focus()
    await page.keyboard.press("Enter")
    await expect(menuNamed(page, "File")).toBeVisible()
  })

  test("a quick click opens the menu without selecting", async ({
    page,
    open,
  }) => {
    await open("menu")
    await page.getByRole("button", { name: "File" }).click()
    await expect(menuNamed(page, "File")).toBeVisible()
    expect(await lastAction(page)).toBe("")
  })

  test("a virtual click from a screen reader focuses the first item", async ({
    page,
    open,
  }) => {
    await open("menu")
    await page
      .getByRole("button", { name: "File" })
      .evaluate((el) => (el as HTMLElement).click())
    await expect(page.getByRole("menuitem", { name: "New file" })).toBeFocused()
  })

  test("moving the highlight changes only two elements", async ({
    page,
    open,
    framework,
  }) => {
    await open("menu")
    await page.getByRole("button", { name: "File" }).focus()
    await page.keyboard.press("Enter")
    await expect(page.getByRole("menuitem", { name: "New file" })).toBeFocused()
    await expect(menuNamed(page, "File")).not.toHaveAttribute(
      "data-starting-style"
    )
    const commits = await page.evaluate(
      () => (window as any).__menuCommits?.commits ?? 0
    )
    await page.evaluate(() => {
      const log: string[] = ((window as any).__mutations = [])
      new MutationObserver((records) => {
        for (const record of records) {
          if (record.attributeName !== "style") {
            log.push(
              `${(record.target as Element).textContent?.slice(0, 8)}:${record.attributeName}`
            )
          }
        }
      }).observe(document.querySelector('[role="menu"]')!, {
        attributes: true,
        subtree: true,
      })
    })
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("ArrowDown")
    await expect(page.getByRole("menuitem", { name: "Save" })).toBeFocused()
    const mutations = await page.evaluate(() => (window as any).__mutations)
    expect(mutations, JSON.stringify(mutations)).toHaveLength(4)
    if (framework.startsWith("react")) {
      expect(
        await page.evaluate(() => (window as any).__menuCommits.commits)
      ).toBe(commits)
    }
  })

  test("an infinite exit animation still unmounts", async ({ page, open }) => {
    await open("menu", { animate: "infinite" })
    await page.getByRole("button", { name: "File" }).click()
    await expect(menuNamed(page, "File")).toBeVisible()
    await page.getByRole("button", { name: "File" }).click()
    await expect(page.getByRole("menu")).toHaveCount(0, { timeout: 1000 })
  })

  test("a menu closed without animation reports closed", async ({
    page,
    open,
  }) => {
    await open("menu")
    await page.getByRole("button", { name: "File" }).click()
    await expect(menuNamed(page, "File")).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(
      page.locator('[data-slot="menu-content"][data-open]')
    ).toHaveCount(0)
  })

  test("rapid toggling ends in a consistent state", async ({ page, open }) => {
    await open("menu", { animate: "" })
    const trigger = page.getByRole("button", { name: "File" })
    for (let i = 0; i < 9; i++) {
      await trigger.click({ delay: 0 })
    }
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
    await expect(menuNamed(page, "File")).toBeVisible()
    await expect(page.locator('[role="menu"]:not([data-nested])')).toHaveCount(
      1
    )
  })

  test("a submenu's first item lines up with its trigger", async ({
    page,
    open,
  }) => {
    await open("menu")
    await page.getByRole("button", { name: "File" }).click()
    await page.getByRole("menuitem", { name: "Share" }).hover()
    await expect(menuNamed(page, "Share")).toBeVisible()
    const trigger = (await page
      .getByRole("menuitem", { name: "Share" })
      .boundingBox())!
    const first = (await page
      .getByRole("menuitem", { name: "Email" })
      .boundingBox())!
    expect(Math.abs(first.y - trigger.y)).toBeLessThanOrEqual(1)
  })

  test("moving the keyboard highlight away closes an open submenu", async ({
    page,
    open,
  }) => {
    await open("menu")
    await page.getByRole("button", { name: "File" }).click()
    await page.getByRole("menuitem", { name: "Share" }).hover()
    await expect(menuNamed(page, "Share")).toBeVisible()
    await page.keyboard.press("ArrowDown")
    await expect(page.getByRole("menuitem", { name: "Delete" })).toBeFocused()
    await expect(menuNamed(page, "Share")).toBeHidden()
  })

  test("switching windows closes the menu", async ({ page, open }) => {
    await open("menu")
    await page.getByRole("button", { name: "File" }).click()
    await expect(menuNamed(page, "File")).toBeVisible()
    await page.evaluate(() => window.dispatchEvent(new Event("blur")))
    await expect(menuNamed(page, "File")).toBeHidden()
  })

  test("items expose their shortcut to assistive technology", async ({
    page,
    open,
  }) => {
    await open("menu")
    await page.getByRole("button", { name: "File" }).click()
    await expect(
      page.getByRole("menuitem", { name: "New file" })
    ).toHaveAttribute("aria-keyshortcuts", /^(Meta|Control)\+N$/)
  })

  test("a controller opens the menu from anywhere", async ({ page, open }) => {
    await open("menu")
    await page.getByRole("button", { name: "Open with controller" }).click()
    await expect(page.getByRole("menuitem", { name: "New file" })).toBeFocused()
  })

  test("data menus run item shortcuts while closed", async ({
    page,
    open,
    framework,
  }) => {
    test.skip(
      !framework.endsWith("-data"),
      "Only data menus know their items while closed."
    )
    await open("menu")
    await page.getByRole("button", { name: "Before" }).focus()
    await page.keyboard.press("ControlOrMeta+o")
    expect(await lastAction(page)).toBe("open")
    await expect(menuNamed(page, "File")).toBeHidden()
  })

  test("menus render into their container", async ({
    page,
    open,
    fixtureOptions,
  }) => {
    test.skip(!fixtureOptions.container, "Only for portal projects.")
    await open("menu")
    await page.getByRole("button", { name: "File" }).click()
    await page.getByRole("menuitem", { name: "Share" }).hover()
    await expect(menuNamed(page, "Share")).toBeVisible()
    await expect(
      page.locator(`#${fixtureOptions.container} > [role="menu"]`)
    ).toHaveCount(1)
    await expect(
      page.locator(`#${fixtureOptions.container} [role="menu"]`)
    ).toHaveCount(2)
  })

  test("without top layer support, menus portal to the body", async ({
    page,
    open,
  }) => {
    // An older browser: no popover methods, and no built-in styles that hide [popover].
    await page.addInitScript(() => {
      delete (HTMLElement.prototype as Partial<HTMLElement>).showPopover
      delete (HTMLElement.prototype as Partial<HTMLElement>).hidePopover
      document.addEventListener("DOMContentLoaded", () => {
        const style = document.createElement("style")
        style.textContent = "[popover]:not([hidden]) { display: block; }"
        document.head.append(style)
      })
    })
    await open("menu")
    const trigger = page.getByRole("button", { name: "File" })
    await trigger.focus()
    await page.keyboard.press("Enter")
    await expect(page.getByRole("menuitem", { name: "New file" })).toBeFocused()
    expect(
      await menuNamed(page, "File").evaluate((el) => el.parentElement?.tagName)
    ).toMatch(/BODY|DIV/)
    await page.keyboard.press("ArrowDown")
    await expect(page.getByRole("menuitem", { name: "Open…" })).toBeFocused()
    await page.keyboard.press("Escape")
    await expect(menuNamed(page, "File")).toBeHidden()
    await expect(trigger).toBeFocused()
  })

  test("on small touch screens the menu becomes a sheet", async ({
    browser,
    framework,
    baseURL,
  }) => {
    const context = await browser.newContext({
      viewport: { width: 375, height: 700 },
      hasTouch: true,
      isMobile: true,
      baseURL,
    })
    const page = await context.newPage()
    await page.goto(`/?fixture=menu&framework=${framework}&presentation=auto`)
    await page.locator("body[data-mounted]").waitFor({ state: "attached" })
    await page.getByRole("button", { name: "File" }).tap()
    const menu = menuNamed(page, "File")
    await expect(menu).toHaveAttribute("data-presentation", "sheet")
    await waitForStill(menu)
    const box = (await menu.boundingBox())!
    expect(Math.round(box.y + box.height)).toBe(700)
    expect(Math.round(box.width)).toBe(375)
    await context.close()
  })
})

test.describe("web components", () => {
  test.beforeEach(({ framework }) => {
    test.skip(framework !== "web", "Web component markup only.")
  })

  test("items added after the menu connects join it @enhancement", async ({
    page,
    open,
  }) => {
    await open("menu")
    await page.evaluate(() => {
      const item = Object.assign(document.createElement("ui-menu-item"), {
        className: "item",
        textContent: "Print",
      })
      item.setAttribute("value", "print")
      document.querySelector("ui-menu-content")!.append(item)
    })
    await page.getByRole("button", { name: "File" }).focus()
    await page.keyboard.press("Enter")
    await expect(page.getByRole("menuitem", { name: "New file" })).toBeFocused()
    await page.keyboard.press("End")
    await expect(page.getByRole("menuitem", { name: "Print" })).toBeFocused()
    await page.keyboard.press("Enter")
    expect(await lastAction(page)).toBe("print")
  })

  test("display defaults lose to layered utility classes, like Tailwind's @enhancement", async ({
    page,
    open,
  }) => {
    await open("menu")
    await page.evaluate(() => {
      const style = document.createElement("style")
      style.textContent = "@layer utilities { .as-flex { display: flex } }"
      document.head.append(style)
      document
        .querySelector('ui-menu-item[value="delete"]')!
        .classList.add("as-flex")
    })
    await page.getByRole("button", { name: "File" }).click()
    await expect(page.getByRole("menuitem", { name: "Delete" })).toHaveCSS(
      "display",
      "flex"
    )
    // Parts nothing styles still get the default.
    await expect(page.locator("ui-menu-group").first()).toHaveCSS(
      "display",
      "block"
    )
  })

  test("changing an attribute updates the part @enhancement", async ({
    page,
    open,
  }) => {
    await open("menu")
    await page.evaluate(() =>
      document
        .querySelector('ui-menu-item[value="delete"]')!
        .setAttribute("disabled", "")
    )
    await page.getByRole("button", { name: "File" }).click()
    await expect(
      page.getByRole("menuitem", { name: "Delete" })
    ).toHaveAttribute("aria-disabled", "true")
    await page.evaluate(() =>
      document
        .querySelector('ui-menu-item[value="delete"]')!
        .removeAttribute("disabled")
    )
    await expect(
      page.getByRole("menuitem", { name: "Delete" })
    ).not.toHaveAttribute("aria-disabled")
  })
})
