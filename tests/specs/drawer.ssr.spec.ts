import type { Page } from "@playwright/test"
import { expect, shortcutKeys, test } from "../fixtures"
import { drawerFixture } from "../fixtures/drawer"
import {
  drawerDialog,
  drawerTrigger,
  sheetRect,
  waitForRest,
} from "./drawer.helpers"

// Only *-ssr projects render on the server first.
test.beforeEach(({ framework }) => {
  test.skip(!framework.endsWith("-ssr"), "Only for server-rendered fixtures.")
})

const hydrationErrors = (page: Page) =>
  page.evaluate(
    () =>
      (window as unknown as { __hydrationErrors: string[] }).__hydrationErrors
  )

test("a closed drawer hydrates without mismatches and opens", async ({
  page,
  open,
}) => {
  await open("drawer")
  await drawerTrigger(page).click()
  await expect(drawerDialog(page)).toBeVisible()
  expect(await hydrationErrors(page)).toEqual([])
})

test("a drawer open from the start hydrates without mismatches and rests at its snap point without animating in", async ({
  page,
  open,
}) => {
  await open("drawer", { open: "", snap: "0.5,1", scroll: "" })
  await expect(drawerDialog(page)).toBeVisible()
  await waitForRest(page)
  expect((await sheetRect(page)).top).toBe(
    Math.round(page.viewportSize()!.height * 0.5)
  )
  expect(await hydrationErrors(page)).toEqual([])
})

test("a Shortcut part in a trigger connected through a controller hydrates without mismatches, then shows the keys for this platform", async ({
  page,
  open,
}) => {
  await open("drawer", { shortcut: "" })
  const trigger = page.getByRole("button", {
    name: drawerFixture.shortcut.trigger,
    exact: true,
  })
  await expect(trigger.locator("[data-slot=drawer-shortcut]")).toHaveText(
    (await shortcutKeys(page, "G")).text
  )
  expect(await hydrationErrors(page)).toEqual([])
})
