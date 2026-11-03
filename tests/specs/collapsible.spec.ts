import type { Page } from "@playwright/test"
import { collapsibleFixture as fixture } from "../fixtures/collapsible"
import { expect, lastAction, test } from "../fixtures"

// Behavior follows the WAI-ARIA disclosure pattern:
// https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/

const trigger = (page: Page) => page.getByRole("button", { name: fixture.trigger, exact: true })
const content = (page: Page) => page.getByText(fixture.content)
const panel = (page: Page) => page.locator(".collapsible-panel")

test.describe("opening and closing", () => {
  test("starts closed, with the panel out of the page", async ({ page, open }) => {
    await open("collapsible")
    await expect(trigger(page)).toHaveAttribute("aria-expanded", "false")
    await expect(content(page)).toBeHidden()
  })

  test("clicking the trigger opens the panel, and clicking again closes it", async ({ page, open }) => {
    await open("collapsible")
    await trigger(page).click()
    await expect(trigger(page)).toHaveAttribute("aria-expanded", "true")
    await expect(content(page)).toBeVisible()
    expect(await lastAction(page)).toBe("open")
    await trigger(page).click()
    await expect(trigger(page)).toHaveAttribute("aria-expanded", "false")
    await expect(content(page)).toBeHidden()
    expect(await lastAction(page)).toBe("closed")
  })

  test("the trigger controls the panel", async ({ page, open }) => {
    await open("collapsible", { open: "" })
    const id = await panel(page).getAttribute("id")
    expect(id).toBeTruthy()
    await expect(trigger(page)).toHaveAttribute("aria-controls", id!)
  })

  // Generated ids carry the prefix, so a page using ui-sdk is recognizable from its HTML.
  test("generated ids start with ui-sdk-", async ({ page, open }) => {
    await open("collapsible", { open: "" })
    await expect(panel(page)).toHaveAttribute("id", /^ui-sdk-/)
    await expect(trigger(page)).toHaveAttribute("id", /^ui-sdk-/)
  })

  test("it can start open", async ({ page, open }) => {
    await open("collapsible", { open: "" })
    await expect(trigger(page)).toHaveAttribute("aria-expanded", "true")
    await expect(content(page)).toBeVisible()
  })

  test("an opening can be canceled", async ({ page, open }) => {
    await open("collapsible", { cancel: "open" })
    await trigger(page).click()
    await expect(trigger(page)).toHaveAttribute("aria-expanded", "false")
    await expect(content(page)).toBeHidden()
  })

  test("a disabled collapsible doesn't open", async ({ page, open }) => {
    await open("collapsible", { disabled: "" })
    await trigger(page).click({ force: true })
    await expect(trigger(page)).toHaveAttribute("aria-expanded", "false")
    await expect(content(page)).toBeHidden()
  })

  test("a disabled trigger stays focusable and says it's disabled", async ({ page, open }) => {
    await open("collapsible", { disabled: "" })
    await trigger(page).focus()
    await expect(trigger(page)).toBeFocused()
    await expect(trigger(page)).toHaveAttribute("aria-disabled", "true")
  })

  test("a controller opens and closes it from anywhere", async ({ page, open }) => {
    await open("collapsible")
    await page.getByRole("button", { name: fixture.controller }).click()
    await expect(content(page)).toBeVisible()
    await page.getByRole("button", { name: fixture.controller }).click()
    await expect(content(page)).toBeHidden()
  })
})

test.describe("keyboard", () => {
  for (const key of ["Enter", " "]) {
    test(`${key === " " ? "Space" : key} toggles the panel and keeps focus on the trigger`, async ({
      page,
      open,
    }) => {
      await open("collapsible")
      await trigger(page).focus()
      await page.keyboard.press(key)
      await expect(trigger(page)).toHaveAttribute("aria-expanded", "true")
      await expect(content(page)).toBeVisible()
      await page.keyboard.press(key)
      await expect(trigger(page)).toHaveAttribute("aria-expanded", "false")
      await expect(trigger(page)).toBeFocused()
    })
  }

  test("Tab moves from the open trigger into the panel", async ({ page, open, tab }) => {
    await open("collapsible", { open: "" })
    await trigger(page).focus()
    await tab()
    await expect(page.getByRole("textbox", { name: fixture.field })).toBeFocused()
  })

  test("Tab skips a closed panel", async ({ page, open, tab }) => {
    await open("collapsible", { "keep-mounted": "" })
    await trigger(page).focus()
    await tab()
    await expect(page.getByRole("button", { name: "After" })).toBeFocused()
  })
})

test.describe("mounting", () => {
  test("with keepMounted, the closed panel stays in the page, hidden", async ({ page, open }) => {
    await open("collapsible", { "keep-mounted": "" })
    await expect(panel(page)).toHaveCount(1)
    await expect(panel(page)).toBeHidden()
    await trigger(page).click()
    await expect(content(page)).toBeVisible()
  })

  test("with keepMounted, a class that sets display doesn't show the closed panel", async ({
    page,
    open,
  }) => {
    await open("collapsible", { "keep-mounted": "" })
    await page.addStyleTag({ content: ".collapsible-panel { display: flex }" })
    await expect(panel(page)).toHaveCSS("display", "none")
    await trigger(page).click()
    await expect(content(page)).toBeVisible()
    await expect(panel(page)).toHaveCSS("display", "flex")
  })

  test("with hiddenUntilFound, the closed panel stays findable", async ({ page, open }) => {
    await open("collapsible", { "hidden-until-found": "" })
    await expect(panel(page)).toHaveAttribute("hidden", "until-found")
    // Content hidden until found keeps its boxes in WebKit, so ask the browser whether it shows.
    expect(await content(page).evaluate((el) => el.checkVisibility())).toBe(false)
  })

  test("with hiddenUntilFound, a class that sets display keeps the closed panel findable", async ({
    page,
    open,
  }) => {
    await open("collapsible", { "hidden-until-found": "" })
    await page.addStyleTag({ content: ".collapsible-panel { display: flex }" })
    await expect(panel(page)).toHaveAttribute("hidden", "until-found")
    await expect(panel(page)).toHaveCSS("display", "flex")
    expect(await content(page).evaluate((el) => el.checkVisibility())).toBe(false)
    const id = await panel(page).getAttribute("id")
    await page.evaluate((id) => (location.hash = `#${id}`), id)
    await expect(trigger(page)).toHaveAttribute("aria-expanded", "true")
    await expect(content(page)).toBeVisible()
  })

  test("finding text in the closed panel opens it", async ({ page, open }) => {
    await open("collapsible", { "hidden-until-found": "" })
    // What the browser does when find in page matches hidden text.
    await panel(page).evaluate((el) => {
      el.dispatchEvent(new Event("beforematch", { bubbles: true }))
      el.removeAttribute("hidden")
    })
    await expect(trigger(page)).toHaveAttribute("aria-expanded", "true")
    await expect(content(page)).toBeVisible()
    expect(await lastAction(page)).toBe("open")
  })

  test("following a link into the closed panel opens it", async ({ page, open }) => {
    await open("collapsible", { "hidden-until-found": "" })
    const id = await panel(page).getAttribute("id")
    // The browser reveals hidden-until-found targets of a fragment itself.
    await page.evaluate((id) => (location.hash = `#${id}`), id)
    await expect(trigger(page)).toHaveAttribute("aria-expanded", "true")
    await expect(content(page)).toBeVisible()
  })

  test("the browser's own find opens the closed panel", async ({ page, open, browserName }) => {
    test.skip(browserName !== "firefox", "Only Firefox reveals hidden-until-found matches for window.find().")
    await open("collapsible", { "hidden-until-found": "" })
    expect(
      await page.evaluate(() => (window as unknown as { find: (text: string) => boolean }).find("Lisbon")),
    ).toBe(true)
    await expect(trigger(page)).toHaveAttribute("aria-expanded", "true")
    await expect(content(page)).toBeVisible()
  })
})

test.describe("animation", () => {
  test("an opening panel animates its height from zero to its content", async ({ page, open }) => {
    await open("collapsible", { animate: "slow" })
    await trigger(page).click()
    const heights: number[] = []
    await expect
      .poll(
        async () => {
          const [value, height] = await panel(page).evaluate((el) => [
            el.style.getPropertyValue("--collapsible-panel-height"),
            el.getBoundingClientRect().height,
          ])
          heights.push(Number(height))
          return value
        },
        { timeout: 10_000 },
      )
      .toBe("auto")
    const full = await panel(page).evaluate((el) => el.scrollHeight)
    expect(Math.round(await panel(page).evaluate((el) => el.getBoundingClientRect().height))).toBe(full)
    expect(
      heights.some((height) => height > 0 && height < full),
      JSON.stringify(heights),
    ).toBe(true)
  })

  test("a closing panel stays in the page while it animates out", async ({ page, open }) => {
    await open("collapsible", { open: "", animate: "" })
    await trigger(page).click()
    await expect(page.locator(".collapsible-panel[data-ending-style]")).toHaveCount(1)
    await expect(content(page)).toBeHidden()
  })

  test("a panel open from the start doesn't animate", async ({ page, open }) => {
    await open("collapsible", { open: "", animate: "slow" })
    await expect(content(page)).toBeVisible()
    expect(await panel(page).getAttribute("data-starting-style")).toBeNull()
    const [height, full] = await panel(page).evaluate((el) => [
      el.getBoundingClientRect().height,
      el.scrollHeight,
    ])
    expect(Math.round(height)).toBe(full)
  })

  test("content that grows while open is shown in full", async ({ page, open }) => {
    await open("collapsible", { open: "" })
    const before = await panel(page).evaluate((el) => el.getBoundingClientRect().height)
    await panel(page).evaluate((el) => {
      const line = document.createElement("p")
      line.textContent = "Another line"
      el.querySelector("p")!.append(line)
    })
    const [height, full] = await panel(page).evaluate((el) => [
      el.getBoundingClientRect().height,
      el.scrollHeight,
    ])
    expect(height).toBeGreaterThan(before)
    expect(Math.round(height)).toBe(full)
  })

  test("with reduced motion, the panel opens at once", async ({ page, open }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    await open("collapsible", { animate: "slow" })
    await trigger(page).click()
    await expect(content(page)).toBeVisible()
    await expect
      .poll(() => panel(page).evaluate((el) => el.style.getPropertyValue("--collapsible-panel-height")), {
        timeout: 500,
      })
      .toBe("auto")
  })
})
