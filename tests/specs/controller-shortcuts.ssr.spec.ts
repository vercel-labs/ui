import { expect, emulatePlatform, test } from "../fixtures"
import { dialogFixture } from "../fixtures/dialog"
import { drawerFixture } from "../fixtures/drawer"
import { popoverFixture } from "../fixtures/popover"
import { tooltipFixture } from "../fixtures/tooltip"

// Only *-ssr projects render on the server first.
test.beforeEach(({ framework }) => {
  test.skip(!framework.endsWith("-ssr"), "Only for server-rendered fixtures.")
})

// Off Apple platforms the keys a trigger shows never change after mount, so
// nothing re-renders it: the trigger must bind after hydration, not during it.
test.describe("off Apple platforms", () => {
  test.beforeEach(async ({ page }) => {
    await emulatePlatform(page, "Linux x86_64")
  })

  test("a dialog trigger connected through a controller keeps its aria-keyshortcuts after hydration", async ({
    page,
    open,
  }) => {
    await open("dialog", { shortcut: "" })
    const trigger = page.getByRole("button", {
      name: dialogFixture.shortcut.trigger,
      exact: true,
    })
    await expect(trigger).toHaveAttribute("aria-keyshortcuts", "Control+E")
  })

  test("a drawer trigger connected through a controller keeps its aria-keyshortcuts after hydration", async ({
    page,
    open,
  }) => {
    await open("drawer", { shortcut: "" })
    const trigger = page.getByRole("button", {
      name: drawerFixture.shortcut.trigger,
      exact: true,
    })
    await expect(trigger).toHaveAttribute("aria-keyshortcuts", "Control+G")
  })

  test("a popover trigger connected through a controller keeps its aria-keyshortcuts after hydration", async ({
    page,
    open,
  }) => {
    await open("popover", { shortcut: "" })
    const trigger = page.getByRole("button", {
      name: popoverFixture.shortcut.remote.trigger,
      exact: true,
    })
    await expect(trigger).toHaveAttribute("aria-keyshortcuts", "Control+E")
  })

  test("a tooltip trigger connected through a controller keeps its aria-keyshortcuts after hydration", async ({
    page,
    open,
  }) => {
    await open("tooltip", { shortcut: "" })
    const trigger = page.getByRole("button", {
      name: tooltipFixture.shortcut.trigger,
      exact: true,
    })
    await expect(trigger).toHaveAttribute("aria-keyshortcuts", "Control+S")
  })
})
