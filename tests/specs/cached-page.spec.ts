import type { Page } from "@playwright/test"
import { expect, focusIsWithin, test } from "../fixtures"

// A page with an open modal popup stays while another page shows: Vue's
// <KeepAlive> caches it, and React's <Activity> hides it. The popup goes with
// its page, rendered in place or into a container, and comes back as it was,
// with focus in it. Left in its container, it would stay shown, focused and in
// the top layer over the other page.
const popups = [
  { popup: "dialog", role: "dialog" },
  { popup: "alert-dialog", role: "alertdialog" },
  { popup: "drawer", role: "dialog" },
  { popup: "popover", role: "dialog" },
] as const

const placements: { placement: string; options: Record<string, string> }[] = [
  { placement: "in place", options: {} },
  { placement: "into a container", options: { container: "portal-root" } },
]

// Whether the page shows anything in the top layer, locks scroll or is inert.
const pageEffects = (page: Page) =>
  page.evaluate(() => ({
    topLayer: document.querySelectorAll(":popover-open").length > 0,
    locked: [document.documentElement, document.body].some(
      (el) => getComputedStyle(el).overflowY === "hidden"
    ),
    inert: !!document.querySelector("[inert]"),
  }))

for (const { popup, role } of popups) {
  for (const { placement, options } of placements) {
    test(`an open ${popup} rendered ${placement} goes with its cached page and comes back as it was`, async ({
      page,
      open,
    }) => {
      await open("cached-page", { popup, ...options })
      await page.getByRole("button", { name: "Edit profile" }).click()
      const content = page.getByRole(role, { name: "Edit profile" })
      await expect(content).toBeVisible()
      await content.getByRole("textbox", { name: "Name" }).fill("Ada")

      for (const cycle of [1, 2]) {
        await content.getByRole("button", { name: "Leave page" }).click()
        const back = page.getByRole("button", { name: "Back to profile" })
        await expect(back).toBeVisible()
        await expect(page.getByRole(role), `away ${cycle}`).toHaveCount(0)
        expect(await focusIsWithin(page, role), `away ${cycle}`).toBe(false)
        await expect
          .poll(() => pageEffects(page), `away ${cycle}`)
          .toEqual({ topLayer: false, locked: false, inert: false })

        await back.click()
        await expect(content).toBeVisible()
        await expect(
          content.getByRole("textbox", { name: "Name" })
        ).toHaveValue("Ada")
        await expect
          .poll(() => pageEffects(page), `back ${cycle}`)
          .toEqual({ topLayer: true, locked: true, inert: true })
        await expect
          .poll(() => focusIsWithin(page, role), `back ${cycle}`)
          .toBe(true)
      }

      await content.getByRole("button", { name: "Close" }).click()
      await expect(page.getByRole(role)).toHaveCount(0)
      await expect
        .poll(() => pageEffects(page))
        .toEqual({ topLayer: false, locked: false, inert: false })
    })
  }
}

for (const popup of ["dialog", "popover"]) {
  test(`an open ${popup} presented as a sheet goes with its cached page and comes back`, async ({
    page,
    open,
  }) => {
    await open("cached-page", {
      popup,
      presentation: "sheet",
      container: "portal-root",
    })
    await page.getByRole("button", { name: "Edit profile" }).click()
    const content = page.getByRole("dialog", { name: "Edit profile" })
    await expect(content).toBeVisible()
    await content.getByRole("button", { name: "Leave page" }).click()
    await expect(page.getByRole("dialog")).toHaveCount(0)
    await expect
      .poll(() => pageEffects(page))
      .toEqual({ topLayer: false, locked: false, inert: false })
    await page.getByRole("button", { name: "Back to profile" }).click()
    await expect(content).toBeVisible()
    await expect
      .poll(() => pageEffects(page))
      .toEqual({ topLayer: true, locked: true, inert: true })
    await expect.poll(() => focusIsWithin(page, "dialog")).toBe(true)
  })
}
