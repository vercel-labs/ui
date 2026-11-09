import { expect, lastAction, menuNamed, test } from "../fixtures"

// Edge cases found while writing the docs examples. Composition projects render
// parts, and -data projects render the same labels from a data menu.

const selections = (page: import("@playwright/test").Page) =>
  page.getByRole("status", { name: "Selections" }).textContent()

test.describe("menu cases", () => {
  test.beforeEach(async ({ open }) => {
    await open("menu-cases")
  })

  test.describe("disabled submenu triggers", () => {
    test("a disabled submenu trigger says so and doesn't open on press or hover", async ({
      page,
    }) => {
      await page.getByRole("button", { name: "Edit" }).click()
      const share = page.getByRole("menuitem", { name: "Share" })
      await expect(share).toHaveAttribute("aria-disabled", "true")
      await expect(share).toHaveAttribute("data-disabled", "")
      // Playwright won't click aria-disabled elements on its own.
      await share.click({ force: true })
      // Longer than the hover delay.
      await page.waitForTimeout(300)
      await expect(menuNamed(page, "Share")).toBeHidden()
      await expect(menuNamed(page, "Edit")).toBeVisible()
    })

    test("ArrowRight, Enter and Space don't open a disabled submenu", async ({
      page,
    }) => {
      await page.getByRole("button", { name: "Edit" }).focus()
      await page.keyboard.press("Enter")
      await expect(menuNamed(page, "Edit")).toBeVisible()
      await page.keyboard.type("sha")
      const share = page.getByRole("menuitem", { name: "Share" })
      await expect(share).toBeFocused()
      for (const key of ["ArrowRight", "Enter", " "]) {
        await page.keyboard.press(key)
        await expect(menuNamed(page, "Share")).toBeHidden()
        await expect(share).toBeFocused()
      }
    })
  })

  test.describe("closing on select", () => {
    test("an item with closeOnSelect false runs and keeps the menu open", async ({
      page,
    }) => {
      await page.getByRole("button", { name: "Edit" }).click()
      await page.getByRole("menuitem", { name: "Zoom in" }).click()
      expect(await lastAction(page)).toBe("zoom")
      await expect(menuNamed(page, "Edit")).toBeVisible()
    })

    test("a checkbox item with closeOnSelect closes the menu", async ({
      page,
    }) => {
      await page.getByRole("button", { name: "Edit" }).click()
      await page.getByRole("menuitemcheckbox", { name: "Autosave" }).click()
      await expect(menuNamed(page, "Edit")).toBeHidden()
      await page.getByRole("button", { name: "Edit" }).click()
      await expect(
        page.getByRole("menuitemcheckbox", { name: "Autosave" })
      ).toHaveAttribute("aria-checked", "true")
    })

    test("a controlled checkbox item keeps its checked value", async ({
      page,
    }) => {
      await page.getByRole("button", { name: "Edit" }).click()
      const pinned = page.getByRole("menuitemcheckbox", { name: "Pinned" })
      await expect(pinned).toHaveAttribute("aria-checked", "true")
      await pinned.click()
      await expect(pinned).toHaveAttribute("aria-checked", "true")
    })
  })

  test.describe("radio groups", () => {
    test("items follow the group's value when it changes", async ({ page }) => {
      await page.getByRole("button", { name: "Align right" }).click()
      await page.getByRole("button", { name: "Edit" }).click()
      await expect(
        page.getByRole("menuitemradio", { name: "Right" })
      ).toHaveAttribute("aria-checked", "true")
      await expect(
        page.getByRole("menuitemradio", { name: "Left" })
      ).toHaveAttribute("aria-checked", "false")
    })

    test("choosing an item in a controlled group checks it", async ({
      page,
      framework,
    }) => {
      test.skip(
        framework.endsWith("-data"),
        "Data menus report no radio changes yet."
      )
      await page.getByRole("button", { name: "Edit" }).click()
      await page.getByRole("menuitemradio", { name: "Right" }).click()
      await expect(
        page.getByRole("menuitemradio", { name: "Right" })
      ).toHaveAttribute("aria-checked", "true")
      await expect(
        page.getByRole("menuitemradio", { name: "Left" })
      ).toHaveAttribute("aria-checked", "false")
    })
  })

  test.describe("preventing selection", () => {
    test.beforeEach(({ framework }) => {
      test.skip(framework.endsWith("-data"), "Data items have no onSelect.")
    })

    test("preventDefault in onSelect keeps the menu open on click", async ({
      page,
    }) => {
      await page.getByRole("button", { name: "Edit" }).click()
      await page.getByRole("menuitem", { name: "Pin" }).click()
      expect(await selections(page)).toBe("1")
      await expect(menuNamed(page, "Edit")).toBeVisible()
      expect(await lastAction(page)).toBe("")
    })

    test("preventDefault in onSelect keeps the menu open on Enter and Space", async ({
      page,
    }) => {
      await page.getByRole("button", { name: "Edit" }).focus()
      await page.keyboard.press("Enter")
      const pin = page.getByRole("menuitem", { name: "Pin" })
      await expect(pin).toBeFocused()
      await page.keyboard.press("Enter")
      expect(await selections(page)).toBe("1")
      await expect(menuNamed(page, "Edit")).toBeVisible()
      await expect(pin).toBeFocused()
      await page.keyboard.press(" ")
      expect(await selections(page)).toBe("2")
      await expect(menuNamed(page, "Edit")).toBeVisible()
      expect(await lastAction(page)).toBe("")
    })
  })

  test("submenus take their own loop option", async ({ page, framework }) => {
    test.skip(framework.endsWith("-data"), "Data submenus take no options.")
    await page.getByRole("button", { name: "Edit" }).focus()
    await page.keyboard.press("Enter")
    await page.keyboard.type("mo")
    await expect(page.getByRole("menuitem", { name: "More" })).toBeFocused()
    await page.keyboard.press("ArrowRight")
    await expect(page.getByRole("menuitem", { name: "First" })).toBeFocused()
    await page.keyboard.press("ArrowUp")
    await expect(page.getByRole("menuitem", { name: "First" })).toBeFocused()
  })

  test.describe("shortcuts", () => {
    test("special keys show as glyphs or names", async ({ page }) => {
      await page.getByRole("button", { name: "Edit" }).click()
      const hint = page
        .getByRole("menuitem", { name: "Erase" })
        .locator('[data-slot="menu-shortcut"]')
      const text = (await hint.textContent())!.replace(/[⁦-⁩]/g, "")
      expect(["⌘⌫", "Ctrl+Backspace"]).toContain(text)
    })

    test("data menus match Option shortcuts by physical key", async ({
      page,
      framework,
    }) => {
      test.skip(!framework.endsWith("-data"), "Only data menus run shortcuts.")
      await page.getByRole("button", { name: "Before" }).focus()
      // Option+N on a Mac types a dead key, so only the code names the key.
      await page.evaluate(() =>
        document.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: "Dead",
            code: "KeyN",
            altKey: true,
            bubbles: true,
          })
        )
      )
      expect(await lastAction(page)).toBe("window")
    })

    test("data menus run shortcuts of items added later", async ({
      page,
      framework,
    }) => {
      test.skip(!framework.endsWith("-data"), "Only data menus run shortcuts.")
      await page.getByRole("button", { name: "Add journal" }).click()
      await page.keyboard.press("ControlOrMeta+j")
      expect(await lastAction(page)).toBe("journal")
    })

    test("turning shortcuts off after the menu renders stops them", async ({
      page,
      framework,
    }) => {
      test.skip(!framework.endsWith("-data"), "Only data menus run shortcuts.")
      await page.keyboard.press("ControlOrMeta+Backspace")
      expect(await lastAction(page)).toBe("erase")
      await page.getByRole("button", { name: "Turn off shortcuts" }).click()
      await page.getByRole("button", { name: "Before" }).focus()
      await page.keyboard.press("Alt+n")
      await page.evaluate(() =>
        document.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: "Dead",
            code: "KeyN",
            altKey: true,
            bubbles: true,
          })
        )
      )
      expect(await lastAction(page)).toBe("erase")
    })

    test("data menu shortcuts pause while a modal dialog is open", async ({
      page,
      framework,
    }) => {
      test.skip(!framework.endsWith("-data"), "Only data menus run shortcuts.")
      await page.getByRole("button", { name: "Open dialog" }).click()
      await expect(page.getByRole("dialog", { name: "Settings" })).toBeVisible()
      await page.keyboard.press("ControlOrMeta+Backspace")
      expect(await lastAction(page)).toBe("")
      await page.getByRole("button", { name: "Close" }).click()
      await expect(page.getByRole("dialog", { name: "Settings" })).toBeHidden()
      await page.keyboard.press("ControlOrMeta+Backspace")
      expect(await lastAction(page)).toBe("erase")
    })

    test("a data menu shortcut without Command, Control or Option types into a field", async ({
      page,
      framework,
    }) => {
      test.skip(!framework.endsWith("-data"), "Only data menus run shortcuts.")
      const notes = page.getByRole("textbox", { name: "Notes" })
      await notes.focus()
      await page.keyboard.press("Shift+Z")
      await expect(notes).toHaveValue("Z")
      expect(await lastAction(page)).toBe("")
    })

    test("a data menu shortcut with Command or Control runs while typing in a field", async ({
      page,
      framework,
    }) => {
      test.skip(!framework.endsWith("-data"), "Only data menus run shortcuts.")
      await page.getByRole("textbox", { name: "Notes" }).focus()
      await page.keyboard.press("ControlOrMeta+Backspace")
      expect(await lastAction(page)).toBe("erase")
    })

    test("a data menu shortcut without a modifier runs outside a field", async ({
      page,
      framework,
    }) => {
      test.skip(!framework.endsWith("-data"), "Only data menus run shortcuts.")
      await page.getByRole("button", { name: "Before" }).focus()
      await page.keyboard.press("Shift+Z")
      expect(await lastAction(page)).toBe("zoom")
      await expect(menuNamed(page, "Edit")).toBeHidden()
    })
  })

  test("offsets place the menu below the trigger in a tall viewport", async ({
    page,
    framework,
  }) => {
    test.skip(framework.endsWith("-data"), "The offsets menu is composed.")
    await page.setViewportSize({ width: 1000, height: 1600 })
    const trigger = page.getByRole("button", { name: "Offsets" })
    await trigger.click()
    const menu = menuNamed(page, "Offsets")
    await expect(menu).toHaveAttribute("data-side", "bottom")
    const anchor = (await trigger.boundingBox())!
    const box = (await menu.boundingBox())!
    expect(
      Math.abs(box.y - (anchor.y + anchor.height) - 8)
    ).toBeLessThanOrEqual(1)
    expect(Math.abs(box.x - (anchor.x - 4))).toBeLessThanOrEqual(1)
  })
})

// <ui-menu> options are attributes, and attributes can change at any time.
test.describe("web component attributes", () => {
  test.beforeEach(async ({ framework, open }) => {
    test.skip(framework !== "web", "Web component markup only.")
    await open("menu")
  })

  const setAttribute = (
    page: import("@playwright/test").Page,
    selector: string,
    name: string,
    value = ""
  ) =>
    page.evaluate(
      ([selector, name, value]) =>
        document.querySelector(selector)!.setAttribute(name, value),
      [selector, name, value]
    )

  test("changing loop on the menu stops wrapping", async ({ page }) => {
    await setAttribute(page, "ui-menu", "loop", "false")
    await page.getByRole("button", { name: "File" }).focus()
    await page.keyboard.press("Enter")
    await expect(page.getByRole("menuitem", { name: "New file" })).toBeFocused()
    await page.keyboard.press("ArrowUp")
    await expect(page.getByRole("menuitem", { name: "New file" })).toBeFocused()
  })

  test("a bare modal attribute makes the menu modal", async ({ page }) => {
    await setAttribute(page, "ui-menu", "modal")
    await page.getByRole("button", { name: "File" }).click()
    await expect(menuNamed(page, "File")).toBeVisible()
    expect(
      await page.evaluate(() => document.documentElement.style.overflow)
    ).toBe("hidden")
    await page.keyboard.press("Escape")
    await expect(menuNamed(page, "File")).toBeHidden()
  })

  test("modal set to pointer only closes on outside presses", async ({
    page,
  }) => {
    await setAttribute(page, "ui-menu", "modal", "pointer")
    await page.getByRole("button", { name: "File" }).click()
    await expect(menuNamed(page, "File")).toBeVisible()
    expect(
      await page.evaluate(() => document.documentElement.style.overflow)
    ).toBe("")
  })

  test("changing presentation applies on the next open", async ({ page }) => {
    await setAttribute(page, "ui-menu", "presentation", "sheet")
    await page.getByRole("button", { name: "File" }).click()
    await expect(menuNamed(page, "File")).toHaveAttribute(
      "data-presentation",
      "sheet"
    )
  })

  test("changing container renders the popup there", async ({ page }) => {
    await page.evaluate(() =>
      document.body.append(
        Object.assign(document.createElement("div"), { id: "late" })
      )
    )
    await setAttribute(page, "ui-menu", "container", "#late")
    await page.getByRole("button", { name: "File" }).click()
    await expect(page.locator('#late > [role="menu"]')).toHaveCount(1)
  })

  test("delay works on the menu and on submenus, as a number", async ({
    page,
  }) => {
    await setAttribute(page, "ui-menu", "delay", "250")
    await setAttribute(page, "ui-menu-sub", "delay", "750")
    const delays = await page.evaluate(() =>
      ["ui-menu", "ui-menu-sub"].map(
        (tag) =>
          (document.querySelector(tag) as HTMLElement & { delay?: number })
            .delay
      )
    )
    expect(delays).toEqual([250, 750])
  })

  test("the element's api is the controller, without internals", async ({
    page,
  }) => {
    const keys = await page.evaluate(() =>
      Object.keys(
        (document.querySelector("ui-menu") as HTMLElement & { api: object }).api
      ).sort()
    )
    expect(keys).toEqual([
      "close",
      "focus",
      "getPayload",
      "isOpen",
      "open",
      "setOpen",
      "toggle",
    ])
  })

  test("align on the content positions it and leaves text alignment alone", async ({
    page,
  }) => {
    await setAttribute(page, "ui-menu-content", "align", "end")
    await page.getByRole("button", { name: "File" }).click()
    const menu = menuNamed(page, "File")
    await expect(menu).toHaveAttribute("data-align", "end")
    const [own, inherited] = await menu.evaluate((el) => [
      getComputedStyle(el).textAlign,
      getComputedStyle(el.parentElement!).textAlign,
    ])
    expect(own).toBe(inherited)
  })
})

test("a menu with defaultOpen shows on a client-only mount @enhancement", async ({
  page,
  open,
  framework,
}) => {
  test.skip(
    framework.endsWith("-ssr"),
    "Server-rendered fixtures have their own spec."
  )
  await open("menu", { open: "" })
  await expect(menuNamed(page, "File")).toBeVisible()
  await expect(page.getByRole("menuitem", { name: "New file" })).toBeVisible()
})

test.describe("controlled menus", () => {
  test.beforeEach(async ({ framework, open }) => {
    test.skip(
      !["react", "vue", "svelte"].includes(framework.split("-")[0]) ||
        framework.includes("data")
    )
    await open("menu-cases")
  })

  const closeFromOutside = (page: import("@playwright/test").Page) =>
    page.evaluate(() =>
      (
        window as unknown as { __closeControlled: () => void }
      ).__closeControlled()
    )

  test("closing through the open prop returns focus to the trigger", async ({
    page,
  }) => {
    const trigger = page.getByRole("button", { name: "Controlled" })
    await trigger.focus()
    await page.keyboard.press("Enter")
    await expect(page.getByRole("menuitem", { name: "Done" })).toBeFocused()
    await page.keyboard.press("Enter")
    await expect(menuNamed(page, "Controlled")).toBeHidden()
    await expect(trigger).toBeFocused()
  })

  test("closing through the open prop from elsewhere returns focus too", async ({
    page,
  }) => {
    const trigger = page.getByRole("button", { name: "Controlled" })
    await trigger.focus()
    await page.keyboard.press("Enter")
    await expect(page.getByRole("menuitem", { name: "Done" })).toBeFocused()
    await closeFromOutside(page)
    await expect(menuNamed(page, "Controlled")).toBeHidden()
    await expect(trigger).toBeFocused()
  })

  test("closing through the open prop leaves focus that moved outside the menu", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Controlled" }).click()
    await expect(menuNamed(page, "Controlled")).toBeVisible()
    await page
      .getByRole("button", { name: "After" })
      .evaluate((el) => (el as HTMLElement).focus())
    await closeFromOutside(page)
    await expect(menuNamed(page, "Controlled")).toBeHidden()
    await expect(page.getByRole("button", { name: "After" })).toBeFocused()
  })

  test("an outside press on a controlled menu doesn't take focus back", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Controlled" }).click()
    await expect(menuNamed(page, "Controlled")).toBeVisible()
    await page.getByRole("button", { name: "Before" }).click()
    await expect(menuNamed(page, "Controlled")).toBeHidden()
    await expect(
      page.getByRole("button", { name: "Controlled" })
    ).not.toBeFocused()
  })
})
